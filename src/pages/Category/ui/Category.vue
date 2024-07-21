<script setup lang="ts">
import { useHomeStore } from "@/app/providers/stores/home";
import { useCartStore } from "@/app/providers/stores/cart";
import { useFavoriteStore } from "@/app/providers/stores/favorite";
import { ref, computed, onBeforeMount, watchEffect } from "vue";
import { type Product } from "@/shared/types/UserCredentials";
import { useRoute } from "vue-router";

const route = useRoute();

const homeStore = useHomeStore();
const cartStore = useCartStore();
const favoriteStore = useFavoriteStore();

const categoryId = ref<number>(Number(route.params.id));

watchEffect(() => {
  const newCategoryId = Number(route.params.id);
  if (newCategoryId !== categoryId.value) {
    categoryId.value = newCategoryId;
    homeStore.fetchProductsByCategory(newCategoryId);
  }
});

const categoryName = computed(() => {
  const category = homeStore.categories.find(
    (cat) => cat.id === categoryId.value
  );
  return category ? category.name : "Category";
});

const filteredProducts = computed(() => {
  return homeStore.featuredProducts.filter(
    (product: Product) => product.category.id === categoryId.value
  );
});

const addToCart = (product: Product) => {
  cartStore.addToCart(product);
};

const toggleFavorite = (productId: number) => {
  if (favoriteStore.isFavorite(productId)) {
    favoriteStore.removeFromFavorites(productId);
  } else {
    favoriteStore.addToFavorites(productId);
  }
};

const activeImageIndex = ref<number | null>(null);
const currentImages = ref<string[]>([]);

const showImage = (images: string[], index: number) => {
  currentImages.value = images;
  activeImageIndex.value = index;
};

const closeModal = () => {
  activeImageIndex.value = null;
};

const nextImage = () => {
  if (activeImageIndex.value !== null) {
    activeImageIndex.value =
      (activeImageIndex.value + 1) % currentImages.value.length;
  }
};

const prevImage = () => {
  if (activeImageIndex.value !== null) {
    activeImageIndex.value =
      (activeImageIndex.value - 1 + currentImages.value.length) %
      currentImages.value.length;
  }
};

onBeforeMount(() => {
  homeStore.fetchProductsByCategory(categoryId.value);
});
</script>

<template>
  <div class="category-products">
    <h2>{{ categoryName }}</h2>
    <div class="product-list">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="product-card"
      >
        <div class="product-image">
          <img
            :src="product.images[0]"
            alt="Product Image"
            @click="showImage(product.images, 0)"
          />
          <span
            v-if="favoriteStore.isFavorite(product.id)"
            @click="toggleFavorite(product.id)"
            class="favorite"
            >♥</span
          >
          <span v-else @click="toggleFavorite(product.id)" class="favorite"
            >♡</span
          >
        </div>
        <div class="product-info">
          <h3>{{ product.title }}</h3>
          <p class="price">Price: $ {{ product.price }}</p>
          <button @click="addToCart(product)">Add to Cart</button>
        </div>
      </div>
    </div>

    <div
      v-if="activeImageIndex !== null"
      class="modal"
      @click.self="closeModal"
    >
      <div class="modal-content">
        <img :src="currentImages[activeImageIndex]" alt="Active Image" />
        <button class="close-button" @click="closeModal">✕</button>
        <button class="arrow left" @click="prevImage">❮</button>
        <button class="arrow right" @click="nextImage">❯</button>
      </div>
    </div>
  </div>
</template>
