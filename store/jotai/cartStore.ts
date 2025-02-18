import { atom } from "jotai";
import { CartItem, Product } from "../interfaces";

/**
 * Store
 */
const cartItemsAtom = atom<CartItem[]>([]);

/**
 * Getters
 */
export const getCartItemsAtom = atom((get) => get(cartItemsAtom));

export const totalAtom = atom((get) => {
  const cart = get(cartItemsAtom);
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
});

export const countAtom = atom((get) => {
  const cart = get(cartItemsAtom);
  return cart.reduce((total, item) => total + item.quantity, 0);
});

/**
 * Setters
 */
export const addToCartAtom = atom(null, (get, set, product: Product) => {
  const cart = get(cartItemsAtom);
  const existingItem = cart.find((item) => product.id === item.id);
  if (!existingItem) {
    set(cartItemsAtom, [...cart, { ...product, quantity: 1 }]);
  } else {
    existingItem.quantity++;
    set(cartItemsAtom, [...cart]);
  }
});

export const removeFromCartAtom = atom(null, (get, set, product: Product) => {
  const cart = get(cartItemsAtom);
  const existingItem = cart.find((item) => product.id === item.id);
  if (existingItem) {
    existingItem.quantity--;
    if (existingItem.quantity === 0) {
      set(
        cartItemsAtom,
        cart.filter((item) => item.id !== product.id),
      );
    } else {
      set(cartItemsAtom, [...cart]);
    }
  }
});

export const clearCartAtom = atom(null, (get, set) => {
  set(cartItemsAtom, []);
});
