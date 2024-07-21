<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useCartStore } from "@/app/providers/stores/cart";
import { useAuthStore } from "@/app/providers/stores/auth";
import { useRouter } from "vue-router";
import { useHomeStore } from "@/app/providers/stores/home";
import { onBeforeMount, ref } from "vue";

const cartStore = useCartStore();
const userStore = useAuthStore();
const homeStore = useHomeStore();

const { cartCount } = storeToRefs(cartStore);
const { isAuthenticated, loginError } = storeToRefs(userStore);
const { categories } = storeToRefs(homeStore);

const router = useRouter();

const logout = () => {
  userStore.logout();
  router.push("/");
};

const goHome = () => {
  homeStore.currentPage = 1;
  homeStore.fetchProducts();
  window.scrollTo({ top: 0, behavior: "smooth" });
  isNavigationOpen.value = false;
};

onBeforeMount(() => {
  homeStore.fetchCategories();
});

const isNavigationOpen = ref(false);

const toggleNavigation = () => {
  isNavigationOpen.value = !isNavigationOpen.value;
};
</script>

<template>
  <header class="header">
    <button class="toggle-button" @click="toggleNavigation">
      <span class="icon">&#9776;</span> Menu
    </button>
    <nav class="navigation" :class="{ 'open': isNavigationOpen }">
      <ul class="navigation__items">
        <li class="navigation__item">
          <router-link to="/" @click.native="goHome">Home</router-link>
        </li>
        <li
          class="navigation__item"
          v-for="category in categories"
          :key="category.id"
        >
          <router-link :to="'/category/' + category.id">{{
            category.name
          }}</router-link>
        </li>
        <li class="navigation__item">
          <router-link to="/favorites">Favorites</router-link>
        </li>
        <li class="navigation__item cart-item">
          <router-link to="/cart" class="cart-link">
            <img src="/src/icons/cart.svg" alt="cart" /> ({{ cartCount }})
          </router-link>
        </li>
        <li class="navigation__item login-item" v-if="!isAuthenticated">
          <router-link to="/login">Login</router-link>
        </li>
        <li class="navigation__item" v-if="loginError && !isAuthenticated">
          <router-link to="/register">Registration</router-link>
        </li>
        <li class="navigation__item profile-item" v-if="isAuthenticated">
          <router-link to="/profile">Profile</router-link>
        </li>
        <li class="navigation__item logout-item" v-if="isAuthenticated">
          <button @click="logout" class="logout-button">Logout</button>
        </li>
      </ul>
    </nav>

  </header>
</template>
