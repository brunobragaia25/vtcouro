export const dynamic = 'force-dynamic'

﻿import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { escapeHtml } from '@/lib/html';
import { Resend } from 'resend';
import { ORGANIZATION, absoluteUrl } from '@/lib/seo';

const FROM_EMAIL = 'onboarding@resend.dev';

async function generateProtocolNumber() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  let protocolNumber = '';
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const todayQuotes = await prisma.quote.count({
      where: {
        createdAt: {
          gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
          lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
        },
      },
    });

    const sequence = String(todayQuotes + attempts + 1).padStart(5, '0');
    protocolNumber = `${month}${day}-${sequence}`;

    // Check if this protocol number already exists
    const existing = await prisma.quote.findUnique({
      where: { protocolNumber },
    });

    if (!existing) {
      return protocolNumber;
    }

    attempts++;
  }

  // Fallback: use timestamp-based unique number
  return `${month}${day}-${String(Date.now()).slice(-5)}`;
}

export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request)
  if (authError) return authError
  try {
    const quotes = await prisma.quote.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
        order: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(quotes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, customerEmail, customerPhone, companyName, status, notes, items } = body;

    const protocolNumber = await generateProtocolNumber();

    const quote = await prisma.quote.create({
      data: {
        protocolNumber,
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        company: companyName,
        status: status || 'novo',
        notes: notes || '',
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            color: item.color || null,
            artFileUrl: item.artFile || null,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Send notification email
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const itemsHtml = quote.items
        .map(item => `<li>${escapeHtml(item.product?.name)}${item.color ? ` (${escapeHtml(item.color)})` : ''} - ${item.quantity} un.</li>`)
        .join('');

      const notificationHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #4b1c09; color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">🎉 Novo Orçamento</h1>
          </div>

          <div style="padding: 30px; background-color: #f9f9f9;">
            <p style="margin-top: 0; font-size: 16px; color: #1f1f1f;">
              Um novo orçamento foi recebido!
            </p>

            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0; color: #999; font-size: 12px; text-transform: uppercase;">
                Protocolo
              </p>
              <p style="margin: 0 0 20px 0; font-size: 24px; color: #4b1c09; font-weight: bold;">
                #${quote.protocolNumber}
              </p>

              <p style="margin: 0 0 5px 0; color: #999; font-size: 12px; text-transform: uppercase;">
                Cliente
              </p>
              <p style="margin: 0 0 10px 0; color: #1f1f1f; font-weight: bold;">${escapeHtml(quote.name)}</p>
              <p style="margin: 0 0 20px 0; color: #666; font-size: 14px;">${escapeHtml(quote.company) || 'Sem empresa'}</p>

              <p style="margin: 0 0 5px 0; color: #999; font-size: 12px; text-transform: uppercase;">
                Contato
              </p>
              <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">${escapeHtml(quote.email)}</p>
              <p style="margin: 0 0 20px 0; color: #666; font-size: 14px;">${escapeHtml(quote.phone) || 'Sem telefone'}</p>

              <p style="margin: 0 0 5px 0; color: #999; font-size: 12px; text-transform: uppercase;">
                Itens (${quote.items.length})
              </p>
              <ul style="margin: 0 0 20px 0; padding-left: 20px; color: #666; font-size: 14px;">
                ${itemsHtml}
              </ul>

              ${quote.notes ? `
                <p style="margin: 0 0 5px 0; color: #999; font-size: 12px; text-transform: uppercase;">
                  Observações
                </p>
                <p style="margin: 0 0 20px 0; color: #666; font-size: 14px; font-style: italic;">"${escapeHtml(quote.notes)}"</p>
              ` : ''}

              <a href="${absoluteUrl('/admin/orcamentos')}" style="display: inline-block; padding: 12px 24px; background-color: #4b1c09; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;">
                Acessar Admin
              </a>
            </div>
          </div>

          <div style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #999;">
            <p style="margin: 0;">
              © 2026 VTCouro. Todos os direitos reservados.
            </p>
          </div>
        </div>
      `;

      // resend.emails.send() nao rejeita em erro de negocio (dominio nao
      // verificado, destinatario bloqueado em sandbox etc) - ele resolve
      // com { error }. So .catch() nao pega isso, precisa checar o campo.
      const notificationResult = await resend.emails
        .send({
          from: FROM_EMAIL,
          to: 'bragaiasouza@gmail.com',
          subject: `Novo Orçamento - #${quote.protocolNumber} de ${quote.name}`,
          html: notificationHtml,
        })
        .catch(err => ({ error: err, data: null }));
      if (notificationResult.error) {
        console.error('Failed to send notification email:', notificationResult.error);
      }

      // Confirmacao para o cliente: a tela de sucesso do site ja informa que
      // um e-mail foi enviado para ele, entao isso precisa acontecer de fato.
      const confirmationItemsHtml = quote.items
        .map(item => `<li>${escapeHtml(item.product?.name)}${item.color ? ` (${escapeHtml(item.color)})` : ''} - ${item.quantity} un.</li>`)
        .join('');

      const confirmationHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #4b1c09; color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">VTCouro</h1>
            <p style="margin: 5px 0 0 0; font-size: 14px;">Confirmação de Orçamento</p>
          </div>

          <div style="padding: 30px; background-color: #f9f9f9;">
            <p style="margin-top: 0; font-size: 16px; color: #1f1f1f;">
              Olá <strong>${escapeHtml(quote.name)}</strong>,
            </p>
            <p style="color: #666; line-height: 1.6;">
              Recebemos sua solicitação de orçamento! Nossa equipe entrará em contato em até 24 horas úteis com os valores detalhados.
            </p>

            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0; color: #999; font-size: 12px; text-transform: uppercase;">
                Protocolo
              </p>
              <p style="margin: 0 0 20px 0; font-size: 24px; color: #4b1c09; font-weight: bold;">
                #${quote.protocolNumber}
              </p>

              <p style="margin: 0 0 5px 0; color: #999; font-size: 12px; text-transform: uppercase;">
                Itens (${quote.items.length})
              </p>
              <ul style="margin: 0; padding-left: 20px; color: #666; font-size: 14px;">
                ${confirmationItemsHtml}
              </ul>
            </div>

            <p style="color: #666; line-height: 1.6; margin-top: 20px; font-size: 14px;">
              Qualquer dúvida, entre em contato conosco:
            </p>
            <p style="margin: 5px 0; color: #4b1c09; font-weight: bold;">
              📧 ${ORGANIZATION.email}<br/>
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

      const confirmationResult = await resend.emails
        .send({
          from: FROM_EMAIL,
          to: quote.email,
          subject: `Recebemos seu orçamento - Protocolo #${quote.protocolNumber}`,
          html: confirmationHtml,
        })
        .catch(err => ({ error: err, data: null }));
      if (confirmationResult.error) {
        console.error('Failed to send confirmation email to customer:', confirmationResult.error);
      }
    }

    return NextResponse.json(quote, { status: 201 });
  } catch (error) {
    console.error('Create quote error:', error);
    return NextResponse.json({ error: 'Failed to create quote' }, { status: 500 });
  }
}
