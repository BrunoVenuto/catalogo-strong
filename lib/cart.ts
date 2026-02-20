import { Product } from "@/config/products";

const CART_KEY = "catalogo-cart";

export function getCart(): Product[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}

export function addToCart(product: Product) {
  const cart = getCart();
  cart.push(product);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));

  // 🔔 eventos (lógica apenas)
  window.dispatchEvent(new Event("cart:add"));
  window.dispatchEvent(new Event("cart:update"));
}

export function removeFromCart(index: number) {
  const cart = getCart();
  cart.splice(index, 1);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart:update"));
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event("cart:update"));
}
