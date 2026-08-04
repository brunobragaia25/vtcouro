import type { Metadata } from 'next';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';
import { ORGANIZATION, SITE_NAME } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Termos de Serviço',
  description: `Condições de uso do site da ${SITE_NAME} e do processo de solicitação de orçamentos.`,
  alternates: { canonical: '/termos-de-servico' },
  robots: { index: true, follow: true },
};

const UPDATED_AT = '04 de agosto de 2026';

export default function TermosDeServicoPage() {
  return (
    <LegalPageLayout
      eyebrow="Termos"
      title="Termos de Serviço"
      updatedAt={UPDATED_AT}
    >
      <section>
        <p>
          Estes Termos de Serviço regulam o uso do site <a href="https://www.vtcouro.com.br">www.vtcouro.com.br</a>,
          operado pela <strong>{ORGANIZATION.legalName}</strong> ({SITE_NAME}). Ao navegar pelo
          catálogo ou enviar uma solicitação de orçamento, você concorda com as condições descritas
          abaixo.
        </p>
      </section>

      <section>
        <h2>1. Natureza do site</h2>
        <p>
          A {SITE_NAME} é uma fábrica de bolsas, mochilas, pastas e acessórios de couro personalizados,
          voltada ao atendimento de empresas em regime de encomenda (B2B). O site apresenta nosso
          catálogo e permite montar um pedido de orçamento — <strong>não há venda direta, carrinho de
          compra com pagamento ou processamento de cartão dentro do site</strong>. Toda negociação de
          preço, prazo e forma de pagamento é feita diretamente com nossa equipe comercial, por e-mail,
          telefone ou WhatsApp.
        </p>
      </section>

      <section>
        <h2>2. Como funciona o pedido de orçamento</h2>
        <ul>
          <li>Você monta uma lista de produtos, quantidades e, se desejar, envia a arte do seu logotipo</li>
          <li>Cada produto tem uma quantidade mínima de pedido, indicada em sua página no catálogo</li>
          <li>Após o envio, nossa equipe normalmente retorna em até 24 horas úteis com valores e prazos</li>
          <li>
            O orçamento enviado não representa a confirmação de um pedido: ele se torna vinculante
            somente após a aprovação formal de ambas as partes (por e-mail, WhatsApp ou outro meio
            escrito) e, quando aplicável, o pagamento do sinal combinado
          </li>
          <li>
            Preços, prazos de produção e disponibilidade de matéria-prima estão sujeitos a confirmação
            e podem variar até a aprovação final do pedido
          </li>
        </ul>
      </section>

      <section>
        <h2>3. Artes e logotipos enviados por você</h2>
        <p>
          Ao enviar um arquivo de arte, logotipo ou identidade visual para personalização de um
          produto, você declara ser titular dos direitos sobre esse material ou possuir autorização
          para utilizá-lo, e nos autoriza a reproduzi-lo exclusivamente para fabricar o produto
          solicitado. Você é o único responsável por eventual uso indevido de marca ou direito autoral
          de terceiros nos arquivos enviados.
        </p>
      </section>

      <section>
        <h2>4. Propriedade intelectual do site</h2>
        <p>
          A marca {SITE_NAME}, o layout, os textos, fotografias de produtos e demais conteúdos deste
          site pertencem à {ORGANIZATION.legalName} e são protegidos por lei. Não é permitido copiar,
          reproduzir ou usar esse conteúdo para fins comerciais sem autorização prévia.
        </p>
      </section>

      <section>
        <h2>5. Variações naturais do couro</h2>
        <p>
          Por se tratar de matéria-prima natural, peças de couro podem apresentar pequenas variações
          de tom, textura e marcas naturais entre uma unidade e outra. Essas variações fazem parte da
          identidade do material e não são consideradas defeito de fabricação.
        </p>
      </section>

      <section>
        <h2>6. Uso aceitável do site</h2>
        <p>Ao usar este site, você concorda em não:</p>
        <ul>
          <li>Fornecer informações falsas no formulário de orçamento</li>
          <li>Tentar acessar áreas restritas do site sem autorização</li>
          <li>Utilizar o site para fins ilícitos ou que violem direitos de terceiros</li>
          <li>Interferir no funcionamento do site por meios automatizados (bots, scraping) sem autorização</li>
        </ul>
      </section>

      <section>
        <h2>7. Links e canais externos</h2>
        <p>
          O site contém links para canais externos, como WhatsApp e redes sociais. Esses ambientes são
          operados por terceiros e possuem seus próprios termos, sobre os quais não temos controle.
        </p>
      </section>

      <section>
        <h2>8. Limitação de responsabilidade</h2>
        <p>
          Empregamos esforços razoáveis para manter o site disponível e as informações do catálogo
          atualizadas, mas não garantimos que ele estará livre de interrupções ou erros. Fotos de
          produtos têm caráter ilustrativo e podem apresentar pequenas variações em relação à peça
          final produzida.
        </p>
      </section>

      <section>
        <h2>9. Alterações destes termos</h2>
        <p>
          Podemos atualizar estes termos periodicamente. A data da última atualização está sempre
          indicada no topo desta página. O uso contínuo do site após uma alteração representa a
          aceitação dos novos termos.
        </p>
      </section>

      <section>
        <h2>10. Lei aplicável e foro</h2>
        <p>
          Estes termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da
          comarca de São Paulo/SP para dirimir eventuais controvérsias, com renúncia a qualquer outro,
          por mais privilegiado que seja.
        </p>
      </section>

      <section>
        <h2>11. Contato</h2>
        <p>
          Dúvidas sobre estes termos podem ser enviadas para{' '}
          <a href={`mailto:${ORGANIZATION.email}`}>{ORGANIZATION.email}</a> ou pelo telefone{' '}
          (11) 2636-1112.
        </p>
      </section>
    </LegalPageLayout>
  );
}
