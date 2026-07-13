import { create } from 'zustand';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  stock: number;
  quantity: number;
  category?: string;
  imageUrl?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemsCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (product, qty = 1) => {
    const items = get().items;
    const existing = items.find((i) => i.id === product.id);

    if (existing) {
      const newQty = existing.quantity + qty;
      if (newQty > product.stock) {
        // Limitar al stock máximo disponible
        set({
          items: items.map((i) =>
            i.id === product.id ? { ...i, quantity: product.stock } : i
          ),
        });
        return;
      }
      set({
        items: items.map((i) =>
          i.id === product.id ? { ...i, quantity: newQty } : i
        ),
      });
    } else {
      if (product.stock <= 0) return;
      const initialQty = qty > product.stock ? product.stock : qty;
      set({ items: [...items, { ...product, quantity: initialQty }] });
    }
  },
  removeItem: (id) => {
    set({ items: get().items.filter((i) => i.id !== id) });
  },
  updateQuantity: (id, quantity) => {
    if (quantity < 1) return;
    const items = get().items;
    const item = items.find((i) => i.id === id);
    if (!item) return;

    if (quantity > item.stock) {
      quantity = item.stock; // Limitar al stock disponible
    }

    set({
      items: items.map((i) => (i.id === id ? { ...i, quantity } : i)),
    });
  },
  clearCart: () => set({ items: [] }),
  getTotal: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },
  getItemsCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));
