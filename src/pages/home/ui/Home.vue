<script setup lang="ts">
import { useFavoriteStore } from "@/app/providers/stores/favorite";
import { useHomeStore } from "@/app/providers/stores/home";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
// import Pagination from "@/pages/Pagination/ui/Pagination.vue";

const homeStore = useHomeStore();
const favoriteStore = useFavoriteStore();
const { featuredProducts } = storeToRefs(homeStore);
const activeImageIndex = ref<number | null>(null);
const currentImages = ref<string[]>([]);

onBeforeMount(() => {
  homeStore.fetchProducts();
  console.log(featuredProducts.value);
});

const addToCart = (product: any) => {
  homeStore.addToCart(product);
};

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

const toggleFavorite = (productId: number) => {
  if (favoriteStore.isFavorite(productId)) {
    favoriteStore.removeFromFavorites(productId);
  } else {
    favoriteStore.addToFavorites(productId);
  }
};

const nextPage = () => {
  homeStore.currentPage++;
  homeStore.fetchProducts();
  scrollToTop();
};

const prevPage = () => {
  homeStore.currentPage--;
  homeStore.fetchProducts();
  scrollToTop();
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const getShortDescription = (description: string) => {
  return description.split(" ").slice(0, 10).join(" ");
};

const toggleDescription = (product: any) => {
  product.showFullDescription = !product.showFullDescription;
};
</script>

<template>
  <div class="featured-products">
    <h2>Featured Products</h2>
    <div class="product-list">
      <div
        class="product-card"
        v-for="product in homeStore.featuredProducts"
        :key="product.id"
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
          <h4>{{ product.category.name }}</h4>
          <p>
            <span
              v-if="!product.showFullDescription"
              class="short-description"
              >{{ getShortDescription(product.description) }}</span
            >
            <span v-else>{{ product.description }}</span>
            <span
              v-if="product.description.split(' ').length > 10"
              @click="toggleDescription(product)"
              class="show-more"
            >
              {{ product.showFullDescription ? "Hide" : "..." }}
            </span>
          </p>
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
    <div class="pagination">
      <button @click="prevPage" :disabled="homeStore.currentPage === 1">
        Previous
      </button>
      <span>{{ homeStore.currentPage }}</span>
      <button @click="nextPage" :disabled="currentPage">Next</button>
    </div>
  </div>
</template>

<!-- <style scoped>
.featured-products h2 {
  text-align: center;
}

.product-list {
  display: flex;
  flex-wrap: wrap;
  /* gap: 15px; */
  justify-content: space-around;
}

.product-card {
  width: calc(20% - 0px); 
  border: 1px solid #ccc;
  padding: 15px;
  display: flex;
  flex-direction: column;
}

.product-image {
  position: relative;
  height: 300px; 
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  cursor: pointer;
}

.product-info {
  padding: 10px;
  background-color: #f9f9f9; 
}

.product-info h3 {
  font-size: 20px;
  margin-bottom: 5px;
}

.product-info p span.short-description {
  color: rgb(20, 19, 19); 
}

.product-info p span.show-more {
  color: blue; 
  cursor: pointer;
}

.price {
  font-size: 20px;
  font-weight: 600;
  color: rgb(36, 125, 24);
}

.product-info button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.product-info button:hover {
  background-color: #0056b3;
}

.favorite {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 40px;
  color: red; 
  cursor: pointer;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  position: relative;
  text-align: center;
}

.modal-content img {
  max-width: 80vw;
  max-height: 80vh;
  object-fit: contain;
}

.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  font-size: 24px;
}

.arrow.left {
  left: 0px;
}

.arrow.right {
  right: 0px;
}

.close-button {
  position: absolute;
  top: 0px;
  right: 0px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 18px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination button {
  margin: 0 5px;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pagination button[disabled] {
  background-color: #ccc;
  cursor: not-allowed;
}

@media (max-width: 1024px) {
  .product-card {
    width: calc(50% - 20px);
  }
}

@media (max-width: 768px) {
  .product-card {
    width: calc(100% - 20px);
  }
}
</style> -->
