// Carrinho da Venda Especial. Separado do 'orcamento_cart' porque o
// fechamento aqui e pelo WhatsApp, sem passar pelo formulario de orcamento.
export interface StockCartItem {
  productId: string
  name: string
  sku?: string
  color: string
  quantity: number
}

export const STOCK_CART_KEY = 'estoque_cart'

export function readStockCart(): StockCartItem[] {
  try {
    const raw = localStorage.getItem(STOCK_CART_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function writeStockCart(items: StockCartItem[]) {
  try {
    localStorage.setItem(STOCK_CART_KEY, JSON.stringify(items))
  } catch {}
}
