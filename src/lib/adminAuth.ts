import { NextRequest, NextResponse } from 'next/server'

export function requireAdmin(request: NextRequest): NextResponse | null {
  const adminPassword = process.env.ADMIN_PASSWORD
  const cookie = request.cookies.get('admin_auth')?.value

  if (!adminPassword || cookie !== adminPassword) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return null
}
