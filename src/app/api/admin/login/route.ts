export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createSessionToken } from '@/lib/adminSession'

// In-memory rate limiter: max 5 attempts per IP per 15 minutes
const attempts = new Map<string, { count: number; resetAt: number }>()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  const now = Date.now()
  const entry = attempts.get(ip)

  if (entry) {
    if (now < entry.resetAt) {
      if (entry.count >= MAX_ATTEMPTS) {
        const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
        return NextResponse.json(
          { error: 'Muitas tentativas. Tente novamente em alguns minutos.' },
          { status: 429, headers: { 'Retry-After': String(retryAfter) } }
        )
      }
    } else {
      attempts.delete(ip)
    }
  }

  const { password } = await request.json()
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword) {
    return NextResponse.json({ error: 'Admin password not configured' }, { status: 500 })
  }

  if (password !== adminPassword) {
    const current = attempts.get(ip)
    if (current && now < current.resetAt) {
      current.count++
    } else {
      attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    }
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  attempts.delete(ip)

  const sessionToken = await createSessionToken()
  const response = NextResponse.json({ ok: true })
  response.cookies.set('admin_auth', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
  return response
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.delete('admin_auth')
  return response
}
