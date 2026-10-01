// Texto e regra da Venda Especial, compartilhados entre o banner da home e o popup.
export const STOCK_SALE_TEXT =
  'Seleção especial de peças em couro e lona a pronta entrega, feche o pedido direto com a nossa equipe.'

export function getStockSaleProducts(products: any[]) {
  return products.filter((p) => p.isActive && p.isStockSale && p.stockQuantity > 0)
}
