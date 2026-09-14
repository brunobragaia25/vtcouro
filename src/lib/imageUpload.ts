import sharp from 'sharp'

// As imagens iam pro Storage exatamente como o admin mandava (ate 5MB) e
// sem cache-control, o que estourava o egress do Supabase: o arquivo
// original era rebaixado inteiro toda vez que o otimizador do next/image
// precisava dele, e o default de 1h do Supabase fazia isso se repetir o
// tempo todo. Aqui a imagem e reduzida para um tamanho util na web e
// gravada como webp com cache longo - o nome do arquivo ja e unico, entao
// o conteudo e imutavel e pode ser cacheado "para sempre".
const MAX_WIDTH = 2000
const WEBP_QUALITY = 82
const ONE_YEAR_SECONDS = '31536000'

// O limite existe so para barrar arquivo absurdo - o que chega no Storage
// e sempre a versao ja comprimida, entao nao precisa ser apertado. Com
// 5MB uma foto normal de celular/camera era recusada a toa.
export const MAX_IMAGE_UPLOAD_BYTES = 15 * 1024 * 1024
export const MAX_IMAGE_UPLOAD_LABEL = '15MB'

export async function optimizeImage(file: File): Promise<Buffer> {
  const input = Buffer.from(await file.arrayBuffer())

  return sharp(input)
    .rotate() // respeita o EXIF; sem isso foto de celular sai deitada
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer()
}

export function webpFileName(baseName: string): string {
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  return `${baseName}-${unique}.webp`
}

export const UPLOAD_OPTIONS = {
  contentType: 'image/webp',
  cacheControl: ONE_YEAR_SECONDS,
}
