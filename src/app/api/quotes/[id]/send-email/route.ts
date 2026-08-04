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

    const itemsHtml = quote.items
      .map(
        item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${escapeHtml(item.product?.name)}${item.color ? ` <span style="color: #999;">(${escapeHtml(item.color)})</span>` : ''}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: center;">
          ${item.artFileUrl ? '✓ Enviado' : '⚠ Pendente'}
        </td>
      </tr>
    `
      )
      .join('');

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #4b1c09; color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">VTCouro</h1>
          <p style="margin: 5px 0 0 0; font-size: 14px;">Seu Orçamento</p>
        </div>

        <div style="padding: 30px; background-color: #f9f9f9;">
          <p style="margin-top: 0; font-size: 16px; color: #1f1f1f;">
            Olá <strong>${escapeHtml(quote.name)}</strong>,
          </p>
          <p style="color: #666; line-height: 1.6;">
            Seu orçamento foi recebido e está em processamento. Você pode acompanhar os detalhes abaixo.
          </p>

          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0; color: #999; font-size: 12px; text-transform: uppercase;">
              Protocolo
            </p>
            <p style="margin: 0 0 20px 0; font-size: 24px; color: #4b1c09; font-weight: bold;">
              #${quote.protocolNumber}
            </p>

            <p style="margin: 0 0 10px 0; color: #999; font-size: 12px; text-transform: uppercase;">
              Dados da Empresa
            </p>
            <p style="margin: 0 0 5px 0; color: #1f1f1f;"><strong>${escapeHtml(quote.company)}</strong></p>
            <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">${escapeHtml(quote.email)}</p>
            <p style="margin: 0 0 20px 0; color: #666; font-size: 14px;">${escapeHtml(quote.phone)}</p>

            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f5f5f5;">
                  <th style="padding: 12px; text-align: left; font-weight: bold; color: #1f1f1f;">Produto</th>
                  <th style="padding: 12px; text-align: center; font-weight: bold; color: #1f1f1f;">Qtd</th>
                  <th style="padding: 12px; text-align: center; font-weight: bold; color: #1f1f1f;">Arte</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
          </div>

          ${
            quote.notes
              ? `
            <div style="background-color: #fff5ec; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0; color: #999; font-size: 12px; text-transform: uppercase;">
                Observações
              </p>
              <p style="margin: 0; color: #1f1f1f; line-height: 1.6;">${escapeHtml(quote.notes)}</p>
            </div>
          `
              : ''
          }

          <div style="background-color: #4b1c09; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="margin: 0 0 15px 0; color: white; font-size: 14px;">
              Próximos passos
            </p>
            <p style="margin: 0 0 15px 0; color: white; font-size: 13px; line-height: 1.6;">
              1. Revise os detalhes do seu orçamento<br/>
              2. Envie os arquivos de arte (se necessário)<br/>
              3. Aguarde nossa resposta com a cotação final
            </p>
            <a href="https://vtcouro.com.br/orcamentos" style="display: inline-block; padding: 12px 24px; background-color: white; color: #4b1c09; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Acompanhar Orçamento
            </a>
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
      to: quote.email,
      subject: `VTCouro - Orçamento Recebido #${quote.protocolNumber}`,
      html: emailHtml,
    });

    if (response.error) {
      console.error('Resend error:', response.error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Send email error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
