export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminAuth'

export async function GET(request: NextRequest) {
  const isAdmin = request.nextUrl.searchParams.get('admin') === '1'
  const banners = await prisma.banner.findMany({
    where: isAdmin ? undefined : { isActive: true },
    orderBy: { orderIndex: 'asc' },
  })
  return NextResponse.json(banners)
}

export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  const body = await request.json()
  const { imageUrl, link, isActive, orderIndex } = body

  if (!imageUrl) {
    return NextResponse.json({ error: 'imageUrl é obrigatório' }, { status: 400 })
  }

  const banner = await prisma.banner.create({
    data: { imageUrl, link, isActive: isActive ?? true, orderIndex: orderIndex ?? 0 },
  })
  return NextResponse.json(banner, { status: 201 })
}
