import { create } from "zustand";
import { Product } from "./interfaces";
import { devtools } from "zustand/middleware";

interface CartState {
  products: (Product & { quantity: number })[];
  addProduct: (product: Product) => void;
  reduceProduct: (product: Product) => void;
  clearCart: () => void;
  items: () => number;
  total: () => number;
}

const useCartStore = create<CartState>()(
  devtools(
    (set, get) => ({
      products: [],

      addProduct: (product: Product) =>
        set((state) => {
          let hasProduct = false;

          const products = state.products.map((p) => {
            if (p.id === product.id) {
              hasProduct = true;
              return { ...p, quantity: p.quantity + 1 };
            }
            return p;
          });

          if (hasProduct) {
            return { products };
          }

          return {
            products: [...products, { ...product, quantity: 1 }],
          };
        }),

      reduceProduct: (product: Product) =>
        set((state) => {
          return {
            products: state.products
              .map((p) => {
                if (p.id === product.id) {
                  return { ...p, quantity: p.quantity - 1 };
                }
                return p;
              })
              .filter((p) => p.quantity > 0),
          };
        }),

      clearCart: () =>
        set(() => {
          return { products: [] };
        }),

      items: () => get().products.reduce((acc, p) => acc + p.quantity, 0),

      total: () =>
        get().products.reduce((acc, p) => acc + p.price * p.quantity, 0),
    }),
    { name: "my Store", enabled: true, serialize: { options: true } },
  ),
);

export default useCartStore;
