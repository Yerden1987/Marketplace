import { defineStore } from "pinia";
import { ref } from "vue";

const FAVORITES_STORAGE_KEY = "favorites";

export const useFavoriteStore = defineStore("favorite", () => {
  const favoriteProducts = ref<number[]>([]);

  const loadFavoritesFromStorage = () => {
    const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (storedFavorites) {
      favoriteProducts.value = JSON.parse(storedFavorites);
    }
  };

  const saveFavoritesToStorage = () => {
    localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(favoriteProducts.value)
    );
  };

  const addToFavorites = (productId: number) => {
    if (!favoriteProducts.value.includes(productId)) {
      favoriteProducts.value.push(productId);
      saveFavoritesToStorage();
    }
  };

  const removeFromFavorites = (productId: number) => {
    favoriteProducts.value = favoriteProducts.value.filter(
      (id) => id !== productId
    );
    saveFavoritesToStorage();
  };

  const isFavorite = (productId: number) => {
    return favoriteProducts.value.includes(productId);
  };

  loadFavoritesFromStorage();

  return {
    favoriteProducts,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    saveFavoritesToStorage,
    loadFavoritesFromStorage,
  };
});