export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { escapeHtml } from '@/lib/html';
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';
import { FROM_EMAIL } from '@/lib/seo';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    const { response } = await request.json();

    if (!response || response.trim().length === 0) {
      return NextResponse.json(
        { error: 'Response cannot be empty' },
        { status: 400 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const quote = await prisma.quote.findUnique({
      where: { id: params.id },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #4b1c09; color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">VTCouro</h1>
          <p style="margin: 5px 0 0 0; font-size: 14px;">Resposta do Seu Orçamento</p>
        </div>

        <div style="padding: 30px; background-color: #f9f9f9;">
          <p style="margin-top: 0; font-size: 16px; color: #1f1f1f;">
            Olá <strong>${escapeHtml(quote.name)}</strong>,
          </p>
          <p style="color: #666; line-height: 1.6;">
            Recebemos sua solicitação e preparamos uma resposta para você:
          </p>

          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0; color: #999; font-size: 12px; text-transform: uppercase;">
              Protocolo
            </p>
            <p style="margin: 0 0 20px 0; font-size: 24px; color: #4b1c09; font-weight: bold;">
              #${quote.protocolNumber}
            </p>

            <div style="background-color: #fff5ec; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <p style="margin: 0 0 10px 0; color: #999; font-size: 12px; text-transform: uppercase;">
                Resposta
              </p>
              <p style="margin: 0; color: #1f1f1f; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(response)}</p>
            </div>
          </div>

          <p style="color: #666; line-height: 1.6; margin-top: 20px; font-size: 14px;">
            Qualquer dúvida, entre em contato conosco:
          </p>
          <p style="margin: 5px 0; color: #4b1c09; font-weight: bold;">
            📧 vendas@vtcouro.com.br<br/>
            📞 (11) 2636-1112
          </p>
        </div>

        <div style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #999;">
          <p style="margin: 0;">
            © 2026 VTCouro. Todos os direitos reservados.
          </p>
        </div>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: FROM_EMAIL,
      to: quote.email,
      subject: `VTCouro - Resposta ao Orçamento #${quote.protocolNumber}`,
      html: emailHtml,
    });

    if (emailResponse.error) {
      console.error('Resend error:', emailResponse.error);
      return NextResponse.json(
        { error: 'Failed to send response email' },
        { status: 500 }
      );
    }

    // Update quote with response and status
    const updatedQuote = await prisma.quote.update({
      where: { id: params.id },
      data: {
        response,
        status: 'respondido',
      },
    });

    return NextResponse.json({ success: true, quote: updatedQuote });
  } catch (error) {
    console.error('Send response error:', error);
    return NextResponse.json({ error: 'Failed to send response' }, { status: 500 });
  }
}
