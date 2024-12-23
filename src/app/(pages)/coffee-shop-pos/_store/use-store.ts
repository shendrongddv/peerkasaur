import { create } from "zustand";
import { persist } from "zustand/middleware";
import { initialProducts, Product } from "../_data/products";

export type CartItem = Omit<Product, "stock"> & { quantity: number };
export type PurchaseRecord = {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
};

type State = {
  products: Product[];
  cart: CartItem[];
  purchaseHistory: PurchaseRecord[];
  addToCart: (product: Product) => void;
  updateQuantity: (id: string, change: number) => void;
  updateStock: (id: string, change: number) => void;
  resetCart: () => void;
  addPurchaseRecord: (record: PurchaseRecord) => void;
  resetLocalStorage: () => void;
};

export const useStore = create<State>()(
  persist(
    (set) => ({
      products: initialProducts,
      cart: [],
      purchaseHistory: [],
      addToCart: (product) =>
        set((state) => {
          const existingItem = state.cart.find(
            (item) => item.id === product.id,
          );
          const updatedCart = existingItem
            ? state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              )
            : [...state.cart, { ...product, quantity: 1 }];
          const updatedProducts = state.products.map((p) =>
            p.id === product.id ? { ...p, stock: p.stock - 1 } : p,
          );
          return { cart: updatedCart, products: updatedProducts };
        }),
      updateQuantity: (id, change) =>
        set((state) => {
          const updatedCart = state.cart
            .map((item) =>
              item.id === id
                ? { ...item, quantity: Math.max(0, item.quantity + change) }
                : item,
            )
            .filter((item) => item.quantity > 0);
          const updatedProducts = state.products.map((p) =>
            p.id === id ? { ...p, stock: p.stock - change } : p,
          );
          return { cart: updatedCart, products: updatedProducts };
        }),
      updateStock: (id, change) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, stock: Math.max(0, p.stock + change) } : p,
          ),
        })),
      resetCart: () => set({ cart: [] }),
      addPurchaseRecord: (record) =>
        set((state) => ({
          purchaseHistory: [record, ...state.purchaseHistory],
        })),
      resetLocalStorage: () => {
        set({ products: initialProducts, cart: [], purchaseHistory: [] });
        window.location.reload();
      },
    }),
    {
      name: "coffee-shop-storage",
    },
  ),
);
