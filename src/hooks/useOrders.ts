import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface OrderQuote {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    sku: string;
    imageUrl?: string;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  quoteId: string;
  status: string;
  totalValue?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  quote: OrderQuote & { items: OrderItem[] };
}

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await fetch('/api/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      return response.json() as Promise<Order[]>;
    },
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { quoteId: string; totalValue?: number }) => {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create order');
      return response.json() as Promise<Order>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      totalValue,
      notes,
    }: {
      id: string;
      status?: string;
      totalValue?: number;
      notes?: string;
    }) => {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, totalValue, notes }),
      });
      if (!response.ok) throw new Error('Failed to update order');
      return response.json() as Promise<Order>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useSendOrderStatus() {
  return useMutation({
    mutationFn: async (orderId: string) => {
      const response = await fetch(`/api/orders/${orderId}/send-status`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to send status email');
      return response.json();
    },
  });
}
