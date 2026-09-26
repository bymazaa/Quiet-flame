import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MAX_ITEM_QUANTITY, MAX_CART_ITEMS } from "@/lib/validation/cart.schema";

export interface CartItem {
  productId: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

/**
 * Client-only cart. Deliberately stores nothing but productId + quantity —
 * never a price or name — so it can never be trusted for money math.
 * The /cart page always re-validates against the database
 * (see order.service.validateCart) before showing any total.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId, quantity = 1) => {
        const items = get().items;
        const existing = items.find((item) => item.productId === productId);

        if (existing) {
          set({
            items: items.map((item) =>
              item.productId === productId
                ? { ...item, quantity: Math.min(item.quantity + quantity, MAX_ITEM_QUANTITY) }
                : item
            ),
          });
          return;
        }

        if (items.length >= MAX_CART_ITEMS) return;

        set({ items: [...items, { productId, quantity: Math.min(quantity, MAX_ITEM_QUANTITY) }] });
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.productId !== productId) });
      },

      setQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.productId === productId ? { ...item, quantity: Math.min(quantity, MAX_ITEM_QUANTITY) } : item
          ),
        });
      },

      clear: () => set({ items: [] }),
    }),
    { name: "quiet-flame-cart" }
  )
);

/** Total item count for the header badge (sum of quantities). */
export function useCartCount(): number {
  return useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
}