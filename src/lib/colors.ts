export function parseColorEntry(raw: string): { name: string; hex: string } {
  if (raw.includes('|')) {
    const idx = raw.lastIndexOf('|')
    return { name: raw.slice(0, idx), hex: raw.slice(idx + 1) }
  }
  const legacyMap: { [key: string]: string } = {
    'Caramelo': '#D4A574', 'Preto': '#1f1f1f', 'Marrom': '#8B4513',
    'Natural': '#E8D4C0', 'Chocolate': '#6B4423', 'Café': '#8B6F47',
    'Branco': '#F5F5F5', 'Cinza': '#808080', 'Vermelho': '#C41E3A', 'Azul': '#1E40AF',
  }
  return { name: raw, hex: legacyMap[raw] || '#cccccc' }
}
