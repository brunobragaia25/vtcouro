import { NextRequest, NextResponse } from 'next/server'
import { verifySessionToken } from './adminSession'

export async function requireAdmin(request: NextRequest): Promise<NextResponse | null> {
  const cookie = request.cookies.get('admin_auth')?.value
  const valid = await verifySessionToken(cookie)

  if (!valid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return null
}
