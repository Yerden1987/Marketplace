<script setup lang="ts">
import { useAuthStore } from "@/app/providers/stores/auth";
import { ref } from "vue";
import { useRouter } from "vue-router";
import RegisterModal from '@/pages/Register/ui/Register.vue';

const router = useRouter();
const authStore = useAuthStore();
// const { login } = useAuthStore();
const email = ref<string | null>(null);
const password = ref<string | null>(null);
const showRegisterModal = ref(false);

const handleLogin = async () => {
  try {
    await authStore.login({ email: email.value, password: password.value });
    if (authStore.isAuthenticated) {
      router.push("/");
    } else {
      showRegisterModal.value = true;
    }
  } catch (error) {
    console.error("Login failed", error);
    showRegisterModal.value = true;
  }
};

const toggleRegisterModal = () => {
  showRegisterModal.value = !showRegisterModal.value;
};

</script>

<template>
  <div class="login-page">
    <h1 class="login-title">Login</h1>
    <form @submit.prevent="handleLogin" class="login-form">
      <div class="form-group">
        <label for="email">Email*</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="password">Password*</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit" class="btn btn-primary">Log in</button>
      <button type="button" class="btn btn-secondary" @click="toggleRegisterModal">Register</button>
    </form>
    <RegisterModal v-if="showRegisterModal" @close="toggleRegisterModal" />
  </div>
</template>

