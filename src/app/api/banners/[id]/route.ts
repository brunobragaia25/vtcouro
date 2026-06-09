export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminAuth'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  const body = await request.json()
  const banner = await prisma.banner.update({
    where: { id: params.id },
    data: body,
  })
  return NextResponse.json(banner)
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  await prisma.banner.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
