// Recomprime as imagens EM USO no Supabase Storage, mantendo exatamente o
// mesmo caminho/URL (upsert) para nao precisar tocar no banco.
// Antes de sobrescrever, faz backup server-side (copy) que nao gasta egress.
//
//   node scripts/recompress-images.js --dry-run        -> so mostra o que faria
//   node scripts/recompress-images.js --png --limit=2  -> processa 2 PNGs de verdade
//   node scripts/recompress-images.js                  -> processa todos os pendentes
//   node scripts/recompress-images.js --fix-cache      -> so reaplica o cache-control
//
// Reexecutar e seguro: arquivos ja processados sao pulados via
// scripts/.recompress-state.json, entao da para ir em lotes e conferir o
// site entre um lote e outro.

const fs = require('fs')
const path = require('path')

const PROJECT = path.join(__dirname, '..')
process.chdir(PROJECT)
for (const f of ['.env.local', '.env']) {
  if (!fs.existsSync(f)) continue
  for (const line of fs.readFileSync(f, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}

const { PrismaClient } = require('@prisma/client')
const { createClient } = require('@supabase/supabase-js')
const sharp = require('sharp')

const BUCKET = 'Arquivo-Artes'
const BACKUP_PREFIX = '_backup-original'
const MAX_WIDTH = 2000
const QUALITY = 82
const ONE_YEAR = '31536000'
const STATE_FILE = path.join(__dirname, '.recompress-state.json')

const DRY = process.argv.includes('--dry-run')
const limitArg = process.argv.find((a) => a.startsWith('--limit='))
const LIMIT = limitArg ? parseInt(limitArg.split('=')[1], 10) : Infinity

const prisma = new PrismaClient()
const supa = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const state = fs.existsSync(STATE_FILE)
  ? JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'))
  : { done: {} }
const saveState = () => fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2))

async function usedFileNames() {
  const used = new Set()
  const add = (u) => {
    if (typeof u === 'string' && u.includes('/')) {
      used.add(decodeURIComponent(u.split('/').pop().split('?')[0]))
    }
  }
  ;(await prisma.product.findMany({ select: { imageUrl: true, images: true } })).forEach((p) => {
    add(p.imageUrl)
    ;(p.images || []).forEach(add)
  })
  ;(await prisma.category.findMany({ select: { imageUrl: true } })).forEach((c) => add(c.imageUrl))
  ;(await prisma.banner.findMany({ select: { imageUrl: true, mobileImageUrl: true } })).forEach((b) => {
    add(b.imageUrl)
    add(b.mobileImageUrl)
  })
  return used
}

const kb = (n) => (n / 1024).toFixed(0) + ' KB'

// Os primeiros arquivos foram gravados com upload({upsert:true}), que nao
// aplica o cacheControl novo. Aqui so reescrevemos os bytes que ja estao
// la com o header correto - sem passar pelo sharp de novo, para nao
// recomprimir um webp em cima de outro e perder qualidade.
async function fixCacheHeaders() {
  const paths = Object.keys(state.done).filter((p) => state.done[p] !== 'skipped')
  console.log(`Corrigindo cache-control de ${paths.length} arquivos ja processados\n`)
  for (const p of paths) {
    try {
      const { data: blob, error } = await supa.storage.from(BUCKET).download(p)
      if (error) throw error
      const buf = Buffer.from(await blob.arrayBuffer())
      const contentType = (state.done[p] && state.done[p].contentType) || 'image/webp'
      const { error: upErr } = await supa.storage
        .from(BUCKET)
        .update(p, buf, { contentType, cacheControl: ONE_YEAR })
      if (upErr) throw upErr
      console.log(`  ok  ${p}`)
    } catch (e) {
      console.log(`  ERRO ${p}: ${e.message}`)
    }
  }
}

async function main() {
  if (process.argv.includes('--fix-cache')) {
    await fixCacheHeaders()
    await prisma.$disconnect()
    return
  }

  const used = await usedFileNames()
  const targets = []

  for (const folder of ['products', 'banners', 'categories']) {
    const { data, error } = await supa.storage.from(BUCKET).list(folder, { limit: 1000 })
    if (error) throw error
    data
      .filter((f) => used.has(f.name))
      .forEach((f) =>
        targets.push({
          folder,
          name: f.name,
          path: `${folder}/${f.name}`,
          size: (f.metadata && f.metadata.size) || 0,
          mime: (f.metadata && f.metadata.mimetype) || '',
        })
      )
  }

  const ONLY = process.argv.includes('--png')
    ? 'image/png'
    : process.argv.includes('--jpeg')
      ? 'image/jpeg'
      : null

  const notDone = targets.filter((t) => !state.done[t.path] && (!ONLY || t.mime === ONLY))
  const pending = notDone.slice(0, LIMIT)
  console.log(
    `${targets.length} imagens em uso | ${targets.length - notDone.length} ja processadas | ${notDone.length} pendentes${ONLY ? ' (' + ONLY + ')' : ''} | processando agora ${pending.length}${DRY ? ' [DRY-RUN]' : ''}\n`
  )

  let before = 0
  let after = 0
  let changed = 0

  for (const t of pending) {
    try {
      const { data: blob, error: dlErr } = await supa.storage.from(BUCKET).download(t.path)
      if (dlErr) throw dlErr
      const input = Buffer.from(await blob.arrayBuffer())

      const meta = await sharp(input).metadata()
      // PNG de foto e o grande vilao: vira webp. JPEG continua JPEG para
      // manter extensao e content-type coerentes.
      const toWebp = t.mime === 'image/png'
      const pipeline = sharp(input)
        .rotate()
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      const output = toWebp
        ? await pipeline.webp({ quality: QUALITY }).toBuffer()
        : await pipeline.jpeg({ quality: QUALITY, mozjpeg: true }).toBuffer()

      const contentType = toWebp ? 'image/webp' : 'image/jpeg'
      const gain = 1 - output.length / input.length

      console.log(
        `${gain > 0.2 ? '*' : ' '} ${t.path}\n    ${meta.width}x${meta.height} ${t.mime} ${kb(input.length)} -> ${contentType} ${kb(output.length)}  (-${(gain * 100).toFixed(0)}%)`
      )

      before += input.length
      after += gain > 0.2 ? output.length : input.length

      if (gain <= 0.2) {
        console.log('    ganho pequeno, mantido como esta')
        if (!DRY) {
          state.done[t.path] = 'skipped'
          saveState()
        }
        continue
      }

      if (DRY) continue

      // Backup server-side (nao gasta egress) antes de sobrescrever.
      const backupPath = `${BACKUP_PREFIX}/${t.path}`
      const { error: cpErr } = await supa.storage.from(BUCKET).copy(t.path, backupPath)
      if (cpErr && !String(cpErr.message || '').toLowerCase().includes('exists')) throw cpErr

      // update() e nao upload({upsert:true}): no upsert o Supabase mantem o
      // cacheControl antigo (max-age=3600) mesmo passando um novo, e o
      // cache longo e metade do ganho aqui.
      const { error: upErr } = await supa.storage
        .from(BUCKET)
        .update(t.path, output, { contentType, cacheControl: ONE_YEAR })
      if (upErr) throw upErr

      state.done[t.path] = { before: input.length, after: output.length, contentType }
      saveState()
      changed++
    } catch (e) {
      console.log(`  ERRO em ${t.path}: ${e.message}`)
    }
  }

  console.log(
    `\nTOTAL: ${(before / 1048576).toFixed(1)} MB -> ${(after / 1048576).toFixed(1)} MB  (-${(100 - (after / before) * 100).toFixed(0)}%)`
  )
  if (!DRY) console.log(`${changed} arquivos regravados. Backups em ${BACKUP_PREFIX}/`)
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
