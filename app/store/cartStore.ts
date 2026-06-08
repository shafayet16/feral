import { create } from 'zustand';

export type CartItem = {
  id: string;
  product_id: number;
  quantity: number;
  size: string;
  session_id: string;
  products?: {
    name: string;
    price: number;
    image: string;
  };
};

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (product_id: number, quantity: number, size: string) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  getTotal: () => number;
  getCount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      // No more hard‑coded session ID – the cookie will be sent automatically
      const res = await fetch('/api/cart', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load cart');
      const data = await res.json();
      set({ items: Array.isArray(data) ? data : [] });
    } catch (error) {
      console.error('Cart retrieval error:', error);
      set({ items: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (product_id, quantity, size) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id, quantity, size }),
        credentials: 'include',  // send cookies
      });
      if (!res.ok) throw new Error('Add failed');
      await get().fetchCart();
    } catch (error) {
      console.error('Add item error:', error);
    }
  },

  removeItem: async (itemId) => {
    if (!itemId) return;
    const previousItems = get().items;
    set({ items: previousItems.filter(item => item.id.toString() !== itemId.toString()) });
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Delete failed');
      await get().fetchCart();
    } catch (error) {
      console.error('Delete error:', error);
      set({ items: previousItems }); // rollback
    }
  },

  updateQuantity: async (id, quantity) => {
    try {
      const res = await fetch(`/api/cart/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Update failed');
      await get().fetchCart();
    } catch (error) {
      console.error('Update error:', error);
    }
  },

  getTotal: () =>
    get().items.reduce((sum, i) => sum + (Number(i.products?.price || 0) * i.quantity), 0),

  getCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));