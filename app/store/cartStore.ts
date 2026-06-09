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
  // 1. Stop execution completely if running on Vercel's build server
  if (typeof window === 'undefined') return;

  try {
    const res = await fetch('/api/cart', { credentials: 'include' });
    
    // 2. Safely log bad responses instead of throwing a fatal error that kills the build
    if (!res.ok) {
      console.warn('Cart endpoint returned non-OK status during build pass.');
      return;
    }

    const data = await res.json();
    set({ items: Array.isArray(data) ? data : [] });
  } catch (error) {
    // 3. Catch structural network/parsing errors gracefully
    console.error('Failed to load cart safely:', error);
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