import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { Product } from "@/shared/types/UserCredentials";

const CART_STORAGE_KEY = "cart";

export const useCartStore = defineStore("cart", () => {
  const cart = ref<Product[]>([]);

  const loadCartFromStorage = () => {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      cart.value = JSON.parse(storedCart);
    }
  };

  const saveCartToStorage = () => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart.value));
  };

  const addToCart = (product: Product) => {
    const existingProduct = cart.value.find((p) => p.id === product.id);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.value.push({ ...product, quantity: 1 });
    }
    saveCartToStorage();
  };

  const updateQuantity = (productId: number, quantity: number) => {
    const product = cart.value.find((p) => p.id === productId);
    if (product && quantity > 0) {
      product.quantity = quantity;
    } else if (product) {
      removeFromCart(productId);
    }
    saveCartToStorage();
  };

  const removeFromCart = (productId: number) => {
    cart.value = cart.value.filter((product) => product.id !== productId);
    saveCartToStorage();
  };

  const cartItems = computed(() => cart.value);
  const cartCount = computed(() =>
    cart.value.reduce((count, product) => count + product.quantity, 0)
  );

  const totalSum = computed(() => {
    return cart.value.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  });

  loadCartFromStorage();

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    cartItems,
    cartCount,
    totalSum,
    saveCartToStorage,
    loadCartFromStorage,
  };
});
