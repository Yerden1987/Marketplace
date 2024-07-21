import { type Category, type Product } from "@/shared/types/UserCredentials";
import axios from "axios";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useCartStore } from "@/app/providers/stores/cart";
import { useFavoriteStore } from "@/app/providers/stores/favorite";

const UrlApi = "https://api.escuelajs.co/api/v1/products";

export const useHomeStore = defineStore("featuredProducts", () => {
  const featuredProducts = ref<Product[]>([]);
  const featuredProduct = ref<Product | null>(null);
  const cartStore = useCartStore();
  const favoriteStore = useFavoriteStore();
  const currentPage = ref(1);
  const itemsPerPage = 10;
  const categories = ref<Category[]>([]);
  const allProducts = ref<Product[]>([]);

  // const allProducts = computed(() => featuredProducts.value);

  const fetchProducts = async () => {
    const offset = (currentPage.value - 1) * itemsPerPage;
    try {
      const { data } = await axios.get(
        `${UrlApi}?limit=${itemsPerPage}&offset=${offset}`
      );
      const temp = data.map((product: Product) => {
        const images = product.images
          .join()
          .replace(/^\[\"|\"\]$/g, '')
          .split('","');

        return { ...product, images };
      });
      console.log("Fetched products:", temp);
      featuredProducts.value = temp;
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const { data } = await axios.get(UrlApi);
      const temp = data.map((product: Product) => {
        const images = product.images
          .join()
          .replace(/^\[\"|\"\]$/g, '')
          .split('","');

        return { ...product, images };
      });
      console.log("Fetched all products:", temp);
      allProducts.value = temp;
    } catch (error) {
      console.error("Error fetching all products:", error);
    }
  };

  const fetchProductsByCategory = async (categoryId: number) => {
    try {
      const { data } = await axios.get(`${UrlApi}?category=${categoryId}`);
      const temp = data.map((product: Product) => {
        const images = product.images.join().replace(/^\[\"|\"\]$/g, '').split('","');
        return { ...product, images };
      });
      featuredProducts.value = temp;
    } catch (error) {
      console.error("Error fetching products by category:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("https://api.escuelajs.co/api/v1/categories");
      categories.value = data.filter((category: { id: number }) => category.id >= 1 && category.id <= 5);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const addToCart = (product: Product) => {
    cartStore.addToCart(product);
  };


  return {
    featuredProduct,
    featuredProducts,
    allProducts,
    fetchProducts,
    fetchAllProducts,
    addToCart,
    currentPage,
    itemsPerPage,
    favoriteStore,
    categories,
    fetchCategories,
    fetchProductsByCategory,
  };
});
