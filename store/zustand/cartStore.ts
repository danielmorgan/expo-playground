import { create, StateCreator, StoreMutatorIdentifier } from "zustand";
import { CartItem, Product } from "../interfaces";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandStorage } from "./mmkv";

type Logger = <
  T extends unknown,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  f: StateCreator<T, Mps, Mcs>,
  name?: string,
) => StateCreator<T, Mps, Mcs>;

type LoggerImpl = <T extends unknown>(
  f: StateCreator<T, [], []>,
  name?: string,
) => StateCreator<T, [], []>;

const loggerImpl: LoggerImpl = (f, name) => (set, get, store) => {
  type T = ReturnType<typeof f>;
  const loggedSet: typeof set = (...a) => {
    set(...a);
    console.log(...(name ? [`${name}:`] : []), get());
  };
  store.setState = loggedSet;

  return f(loggedSet, get, store);
};

export const logger = loggerImpl as unknown as Logger;

interface CartState {
  products: CartItem[];
  addProduct: (product: Product) => void;
  reduceProduct: (product: Product) => void;
  clearCart: () => void;
  items: () => number;
  total: () => number;
}

const useCartStore = create<CartState>()(
  persist(
    logger((set, get) => ({
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
    })),
    {
      name: "cart",
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

export default useCartStore;
