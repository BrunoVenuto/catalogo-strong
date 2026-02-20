import type { Product } from "@/config/products";
import { products as defaultProducts } from "@/config/products";

// LocalStorage key for products
const KEY = "catalogo_products_v1";

function isBrowser() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function ensureProductsSeeded() {
  if (!isBrowser()) return;
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(defaultProducts));
    return;
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(KEY, JSON.stringify(defaultProducts));
    }
  } catch {
    localStorage.setItem(KEY, JSON.stringify(defaultProducts));
  }
}

export function getStoredProducts(): Product[] {
  if (!isBrowser()) return defaultProducts;
  const raw = localStorage.getItem(KEY);
  if (!raw) return defaultProducts;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Product[]) : defaultProducts;
  } catch {
    return defaultProducts;
  }
}

export function setStoredProducts(next: Product[]) {
  if (!isBrowser()) return;
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function resetProductsToDefault() {
  if (!isBrowser()) return;
  localStorage.setItem(KEY, JSON.stringify(defaultProducts));
}

export function nextProductId(existing: Product[]) {
  const maxId = existing.reduce((acc, p) => Math.max(acc, Number(p.id) || 0), 0);
  return maxId + 1;
}
