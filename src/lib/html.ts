export function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Converte texto digitado/colado no admin em HTML de e-mail sem depender de
// `white-space: pre-wrap` (ignorado pelo Outlook). Linhas com TAB (tabelas
// coladas do Word/Excel) viram <table>; linhas em branco separam parágrafos.
export function textToEmailHtml(text: string, color = '#1f1f1f'): string {
  const lines = text.replace(/\r\n?/g, '\n').split('\n')
  const blocks: string[] = []
  let paragraph: string[] = []
  let rows: string[][] = []

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push(
        `<p style="margin: 0 0 12px 0; color: ${color}; line-height: 1.6;">${paragraph.join('<br/>')}</p>`
      )
      paragraph = []
    }
  }

  const flushTable = () => {
    if (rows.length) {
      const cols = Math.max(...rows.map(r => r.length))
      const body = rows
        .map((cells, i) => {
          const tag = i === 0 ? 'th' : 'td'
          const weight = i === 0 ? 'font-weight: bold; background-color: #f5f5f5;' : ''
          const tds = Array.from({ length: cols }, (_, c) =>
            `<${tag} style="padding: 6px 8px; border: 1px solid #e0e0e0; text-align: left; font-size: 13px; color: ${color}; ${weight}">${escapeHtml((cells[c] ?? '').trim())}</${tag}>`
          ).join('')
          return `<tr>${tds}</tr>`
        })
        .join('')
      blocks.push(
        `<table style="width: 100%; border-collapse: collapse; margin: 0 0 12px 0;">${body}</table>`
      )
      rows = []
    }
  }

  for (const line of lines) {
    if (line.includes('\t')) {
      flushParagraph()
      rows.push(line.split('\t'))
    } else if (line.trim() === '') {
      flushParagraph()
      flushTable()
    } else {
      flushTable()
      paragraph.push(escapeHtml(line))
    }
  }
  flushParagraph()
  flushTable()

  return blocks.join('')
}
