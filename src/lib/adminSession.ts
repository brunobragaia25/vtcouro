const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

function getKey(secret: string) {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

async function sign(payload: string, secret: string): Promise<string> {
  const key = await getKey(secret)
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))
  return Buffer.from(signature).toString('base64url')
}

export async function createSessionToken(): Promise<string> {
  const secret = process.env.ADMIN_PASSWORD
  if (!secret) throw new Error('ADMIN_PASSWORD not configured')

  const expiresAt = Date.now() + SESSION_DURATION_MS
  const signature = await sign(String(expiresAt), secret)
  return `${expiresAt}.${signature}`
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  const secret = process.env.ADMIN_PASSWORD
  if (!secret || !token) return false

  const [expiresAtStr, signature] = token.split('.')
  if (!expiresAtStr || !signature) return false

  const expiresAt = Number(expiresAtStr)
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false

  const expectedSignature = await sign(expiresAtStr, secret)
  return timingSafeEqual(signature, expectedSignature)
}
