import { NextRequest, NextResponse } from 'next/server'
import { verifySessionToken } from '@/lib/adminSession'

// Rotas de API que devem continuar acessíveis sem login (site público)
function isPublicApiRoute(pathname: string, method: string): boolean {
  if (pathname.startsWith('/api/admin/login')) return true
  if (method === 'GET' && (
    pathname.startsWith('/api/products') ||
    pathname.startsWith('/api/categories') ||
    pathname.startsWith('/api/subcategories') ||
    pathname.startsWith('/api/banners')
  )) return true
  if (method === 'POST' && pathname === '/api/quotes') return true
  if (method === 'POST' && pathname === '/api/upload') return true
  return false
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const cookie = request.cookies.get('admin_auth')?.value

  if (pathname.startsWith('/api/')) {
    if (isPublicApiRoute(pathname, request.method)) {
      return NextResponse.next()
    }
    const valid = await verifySessionToken(cookie)
    if (!valid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.next()
  }

  if (!pathname.startsWith('/admin') || pathname === '/admin/login') {
    return NextResponse.next()
  }

  const valid = await verifySessionToken(cookie)
  if (!valid) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
}
