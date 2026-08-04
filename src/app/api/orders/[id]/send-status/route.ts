export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { escapeHtml } from '@/lib/html';
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';
import { FROM_EMAIL } from '@/lib/seo';

const statusLabels = {
  pendente: 'Pendente',
  em_producao: 'Em Produção',
  enviado: 'Enviado',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
};

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

    const resend = new Resend(process.env.RESEND_API_KEY);

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        quote: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const statusLabel = statusLabels[order.status as keyof typeof statusLabels];

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #4b1c09; color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">VTCouro</h1>
          <p style="margin: 5px 0 0 0; font-size: 14px;">Atualização de Status do Pedido</p>
        </div>

        <div style="padding: 30px; background-color: #f9f9f9;">
          <p style="margin-top: 0; font-size: 16px; color: #1f1f1f;">
            Olá <strong>${escapeHtml(order.quote.name)}</strong>,
          </p>
          <p style="color: #666; line-height: 1.6;">
            O status do seu pedido foi atualizado. Confira os detalhes abaixo:
          </p>

          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0; color: #999; font-size: 12px; text-transform: uppercase;">
              Número do Pedido
            </p>
            <p style="margin: 0 0 20px 0; font-size: 24px; color: #4b1c09; font-weight: bold;">
              #${order.orderNumber}
            </p>

            <div style="background-color: #fff5ec; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <p style="margin: 0 0 10px 0; color: #999; font-size: 12px; text-transform: uppercase;">
                Status Atual
              </p>
              <p style="margin: 0; font-size: 18px; color: #4b1c09; font-weight: bold;">
                ${statusLabel}
              </p>
            </div>

            ${
              order.totalValue
                ? `
              <p style="margin: 0 0 5px 0; color: #999; font-size: 12px; text-transform: uppercase;">
                Valor Total
              </p>
              <p style="margin: 0 0 20px 0; font-size: 18px; color: #1f1f1f; font-weight: bold;">
                R$ ${order.totalValue.toFixed(2).replace('.', ',')}
              </p>
            `
                : ''
            }

            ${
              order.notes
                ? `
              <p style="margin: 0 0 5px 0; color: #999; font-size: 12px; text-transform: uppercase;">
                Observações
              </p>
              <p style="margin: 0 0 20px 0; color: #666; font-size: 14px;">${escapeHtml(order.notes)}</p>
            `
                : ''
            }
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

    const response = await resend.emails.send({
      from: FROM_EMAIL,
      to: order.quote.email,
      subject: `VTCouro - Pedido #${order.orderNumber} — Status: ${statusLabel}`,
      html: emailHtml,
    });

    if (response.error) {
      console.error('Resend error:', response.error);
      return NextResponse.json(
        { error: 'Failed to send status email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Send status error:', error);
    return NextResponse.json({ error: 'Failed to send status email' }, { status: 500 });
  }
}
