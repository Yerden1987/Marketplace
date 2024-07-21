<script setup lang="ts">
import { useFavoriteStore } from "@/app/providers/stores/favorite";
import { useHomeStore } from "@/app/providers/stores/home";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";

const homeStore = useHomeStore();
const favoriteStore = useFavoriteStore();
const { allProducts } = storeToRefs(homeStore);
const { favoriteProducts } = storeToRefs(favoriteStore);

const allFavoriteProducts = computed(() =>
  allProducts.value.filter((product) =>
    favoriteProducts.value.includes(product.id)
  )
);

onBeforeMount(() => {
  homeStore.fetchAllProducts();
  favoriteStore.loadFavoritesFromStorage();
});



const addToCart = (product: any) => {
  homeStore.addToCart(product);
};

const toggleFavorite = (productId: number) => {
  if (favoriteStore.isFavorite(productId)) {
    favoriteStore.removeFromFavorites(productId);
  } else {
    favoriteStore.addToFavorites(productId);
  }
  favoriteStore.saveFavoritesToStorage();
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
    activeImageIndex.value = (activeImageIndex.value + 1) % currentImages.value.length;
  }
};

const prevImage = () => {
  if (activeImageIndex.value !== null) {
    activeImageIndex.value = (activeImageIndex.value - 1 + currentImages.value.length) % currentImages.value.length;
  }
};
</script>

<template>
  <div class="favorites">
    <h2 v-if="allFavoriteProducts.length > 0">Favorite Products</h2>
    <h2 v-else>Here will be the favorite products</h2>
    <div class="product-list">
      <div
        class="product-card"
        v-for="product in allFavoriteProducts"
        :key="product.id"
      >
        <div class="product-image">
          <img
            :src="product.images[0]"
            alt="Product Image"
            @click="showImage(product.images, 0)"
          />
          <span
            @click="toggleFavorite(product.id)"
            class="favorite active"
          >♥</span>
        </div>
        <div class="product-info">
          <h3>{{ product.title }}</h3>
          <p class="price">Price: $ {{ product.price }}</p>
          <button @click="addToCart(product)">Add to Cart</button>
        </div>
      </div>
    </div>

    <div v-if="activeImageIndex !== null" class="modal" @click.self="closeModal">
      <div class="modal-content">
        <img :src="currentImages[activeImageIndex]" alt="Active Image" />
        <button class="close-button" @click="closeModal">✕</button>
        <button class="arrow left" @click="prevImage">❮</button>
        <button class="arrow right" @click="nextImage">❯</button>
      </div>
    </div>
  </div>
</template>

