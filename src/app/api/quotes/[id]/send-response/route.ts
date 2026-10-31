export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { escapeHtml, textToEmailHtml } from '@/lib/html';
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';
import { FROM_EMAIL, ORGANIZATION } from '@/lib/seo';

// A Vercel recusa corpo de requisicao acima de ~4.5MB nas functions
const MAX_PDF_SIZE = 4 * 1024 * 1024;

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

    const formData = await request.formData();
    const message = String(formData.get('response') ?? '').trim();
    const pdf = formData.get('file');
    const file = pdf instanceof File && pdf.size > 0 ? pdf : null;

    if (!message && !file) {
      return NextResponse.json(
        { error: 'Response cannot be empty' },
        { status: 400 }
      );
    }

    let attachment: { filename: string; content: Buffer } | null = null;
    if (file) {
      if (file.size > MAX_PDF_SIZE) {
        return NextResponse.json(
          { error: `PDF maior que ${MAX_PDF_SIZE / 1024 / 1024}MB` },
          { status: 400 }
        );
      }
      const content = Buffer.from(await file.arrayBuffer());
      // %PDF - mesma checagem de magic bytes do /api/upload
      if (content.subarray(0, 4).toString('latin1') !== '%PDF') {
        return NextResponse.json(
          { error: 'O arquivo enviado não é um PDF válido' },
          { status: 400 }
        );
      }
      const filename = file.name.toLowerCase().endsWith('.pdf') ? file.name : `${file.name}.pdf`;
      attachment = { filename, content };
    }

    const response = message || 'Segue em anexo a proposta comercial referente ao seu orçamento.';

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

    const emailText = [
      `Olá ${quote.name},`,
      '',
      'Recebemos sua solicitação e preparamos uma resposta para você:',
      '',
      `Protocolo: #${quote.protocolNumber}`,
      '',
      'Resposta:',
      response,
      attachment ? `\nProposta em PDF anexada: ${attachment.filename}` : '',
      '',
      'Qualquer dúvida, entre em contato conosco:',
      ORGANIZATION.email,
      '(11) 2636-1112',
      'WhatsApp: (11) 94138-2445',
    ].join('\n');

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
              ${textToEmailHtml(response)}
              ${attachment ? `<p style="margin: 0; color: #4b1c09; font-size: 14px;">📎 Proposta em PDF anexada a este e-mail: <strong>${escapeHtml(attachment.filename)}</strong></p>` : ''}
            </div>
          </div>

          <p style="color: #666; line-height: 1.6; margin-top: 20px; font-size: 14px;">
            Qualquer dúvida, entre em contato conosco:
          </p>
          <p style="margin: 5px 0; color: #4b1c09; font-weight: bold;">
            📧 vendas@vtcouro.com.br<br/>
            📞 (11) 2636-1112<br/>
            💬 WhatsApp: <a href="https://wa.me/5511941382445" style="color: #4b1c09;">(11) 94138-2445</a>
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
      replyTo: ORGANIZATION.email,
      subject: `VTCouro - Resposta ao Orçamento #${quote.protocolNumber}`,
      html: emailHtml,
      text: emailText,
      ...(attachment && { attachments: [attachment] }),
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
        response: attachment ? `${response}\n\n[PDF anexado: ${attachment.filename}]` : response,
        status: 'respondido',
      },
    });

    return NextResponse.json({ success: true, quote: updatedQuote });
  } catch (error) {
    console.error('Send response error:', error);
    return NextResponse.json({ error: 'Failed to send response' }, { status: 500 });
  }
}
