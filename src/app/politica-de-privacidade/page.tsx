import type { Metadata } from 'next';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';
import { ORGANIZATION, SITE_NAME } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: `Como a ${SITE_NAME} coleta, usa e protege os dados pessoais informados no site, em conformidade com a LGPD.`,
  alternates: { canonical: '/politica-de-privacidade' },
  robots: { index: true, follow: true },
};

const UPDATED_AT = '04 de agosto de 2026';

export default function PoliticaDePrivacidadePage() {
  return (
    <LegalPageLayout
      eyebrow="Privacidade"
      title="Política de Privacidade"
      updatedAt={UPDATED_AT}
    >
      <section>
        <p>
          Esta política explica como a <strong>{ORGANIZATION.legalName}</strong> ({SITE_NAME}) coleta,
          usa, armazena e protege os dados pessoais de quem navega e solicita orçamentos em{' '}
          <a href="https://www.vtcouro.com.br">www.vtcouro.com.br</a>. Ela segue os princípios da Lei
          Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).
        </p>
        <p>
          Somos uma fábrica de artigos de couro personalizados que atende empresas sob encomenda.
          O site não realiza vendas nem cobranças online: ele serve para apresentar o catálogo e
          coletar pedidos de orçamento, que são respondidos manualmente pela nossa equipe comercial.
        </p>
      </section>

      <section>
        <h2>1. Quem é o controlador dos seus dados</h2>
        <p>
          A {ORGANIZATION.legalName} é a controladora dos dados pessoais tratados através deste site.
        </p>
        <ul>
          <li>E-mail: <a href={`mailto:${ORGANIZATION.email}`}>{ORGANIZATION.email}</a></li>
          <li>Telefone: (11) 2636-1112</li>
          <li>
            Endereço: {ORGANIZATION.address.streetAddress}, {ORGANIZATION.address.addressLocality} /{' '}
            {ORGANIZATION.address.addressRegion}
          </li>
        </ul>
      </section>

      <section>
        <h2>2. Quais dados coletamos</h2>
        <p>Coletamos dados pessoais principalmente quando você preenche o formulário de orçamento:</p>
        <ul>
          <li>Nome completo</li>
          <li>E-mail</li>
          <li>Telefone / WhatsApp</li>
          <li>Nome da empresa (quando informado)</li>
          <li>Observações sobre o pedido (cores, prazos, personalização)</li>
          <li>Arquivos de arte enviados (logotipos em PDF, AI ou PNG) para a produção da peça</li>
        </ul>
        <p>
          Também coletamos automaticamente dados de navegação anônimos e agregados (como páginas
          visitadas) através do Vercel Analytics, uma ferramenta que não usa cookies nem identifica
          visitantes individualmente. Usamos o armazenamento local do navegador (localStorage) apenas
          para lembrar os produtos que você adicionou ao seu orçamento entre uma visita e outra — essa
          informação fica no seu próprio dispositivo e não é enviada aos nossos servidores até você
          concluir o envio.
        </p>
      </section>

      <section>
        <h2>3. Para que usamos seus dados</h2>
        <ul>
          <li>Elaborar e enviar o orçamento solicitado</li>
          <li>Entrar em contato para tirar dúvidas ou confirmar detalhes do pedido</li>
          <li>Produzir a peça personalizada, incluindo o uso do logotipo/arte enviado</li>
          <li>Enviar e-mails transacionais relacionados ao seu pedido (confirmação, resposta do orçamento)</li>
          <li>Cumprir obrigações legais e fiscais, quando aplicável</li>
        </ul>
        <p>
          Não usamos seus dados para envio de propaganda não solicitada, não fazemos publicidade
          direcionada e não vendemos dados pessoais a terceiros.
        </p>
      </section>

      <section>
        <h2>4. Base legal do tratamento</h2>
        <p>
          Tratamos seus dados com base na execução de procedimentos preliminares e do próprio
          contrato de fornecimento (art. 7º, V, da LGPD), quando você solicita um orçamento, e no
          legítimo interesse em responder contatos comerciais e melhorar o site.
        </p>
      </section>

      <section>
        <h2>5. Com quem compartilhamos dados</h2>
        <p>
          Não compartilhamos seus dados com terceiros para fins de marketing. Usamos os seguintes
          prestadores de serviço para operar o site, que têm acesso aos dados estritamente para
          executar essa função:
        </p>
        <ul>
          <li><strong>Vercel</strong> — hospedagem do site e métricas de audiência anônimas</li>
          <li><strong>Supabase</strong> — banco de dados e armazenamento dos arquivos de arte enviados</li>
          <li><strong>Resend</strong> — envio dos e-mails transacionais de orçamento</li>
        </ul>
        <p>
          Ao conversar conosco pelo WhatsApp, a troca de mensagens também está sujeita à política de
          privacidade da Meta/WhatsApp, que não controlamos.
        </p>
      </section>

      <section>
        <h2>6. Por quanto tempo guardamos seus dados</h2>
        <p>
          Mantemos os dados de orçamentos pelo tempo necessário para atendê-lo e pelo prazo exigido
          por obrigações legais e fiscais aplicáveis a registros comerciais. Você pode solicitar a
          exclusão antecipada a qualquer momento, conforme a seção 7 abaixo.
        </p>
      </section>

      <section>
        <h2>7. Seus direitos como titular dos dados</h2>
        <p>Nos termos do art. 18 da LGPD, você pode solicitar a qualquer momento:</p>
        <ul>
          <li>Confirmação de que tratamos seus dados e acesso a eles</li>
          <li>Correção de dados incompletos, inexatos ou desatualizados</li>
          <li>Anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em excesso</li>
          <li>Portabilidade dos dados a outro fornecedor de serviço</li>
          <li>Eliminação dos dados tratados com base no seu consentimento</li>
          <li>Revogação do consentimento e informação sobre com quem compartilhamos seus dados</li>
        </ul>
        <p>
          Para exercer qualquer um desses direitos, envie um e-mail para{' '}
          <a href={`mailto:${ORGANIZATION.email}`}>{ORGANIZATION.email}</a>. Responderemos dentro de um
          prazo razoável.
        </p>
      </section>

      <section>
        <h2>8. Segurança dos dados</h2>
        <p>
          Adotamos medidas técnicas e administrativas razoáveis para proteger seus dados contra
          acessos não autorizados e situações de perda, alteração ou vazamento, incluindo conexão
          criptografada (HTTPS) em todo o site e controle de acesso restrito ao painel administrativo.
        </p>
      </section>

      <section>
        <h2>9. Crianças e adolescentes</h2>
        <p>
          Nosso site é destinado a empresas e não coleta intencionalmente dados de menores de idade.
        </p>
      </section>

      <section>
        <h2>10. Alterações desta política</h2>
        <p>
          Podemos atualizar esta política periodicamente para refletir mudanças no site ou na
          legislação. A data da última atualização está sempre indicada no topo desta página.
        </p>
      </section>

      <section>
        <h2>11. Contato</h2>
        <p>
          Dúvidas sobre esta política ou sobre o tratamento dos seus dados podem ser enviadas para{' '}
          <a href={`mailto:${ORGANIZATION.email}`}>{ORGANIZATION.email}</a> ou pelo telefone{' '}
          (11) 2636-1112.
        </p>
      </section>
    </LegalPageLayout>
  );
}
