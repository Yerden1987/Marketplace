<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useRegisterStore } from "@/app/providers/stores/register";

const registerStore = useRegisterStore();
const router = useRouter();

const username = ref("");
const email = ref("");
const password = ref("");
const avatar = ref("https://picsum.photos/800");
const errorMessage = ref("");

const handleRegister = async () => {
  try {
    await registerStore.registerUser({
      name: username.value,
      email: email.value,
      password: password.value,
      avatar: avatar.value,
    });
    console.log("User registered successfully");
    router.push("/profile");
  } catch (error) {
    errorMessage.value = "Registration failed";
    console.error("Registration failed", error);
  }
};

const $emit = defineEmits(['close']);

const closeModal = () => {
  $emit('close');
};
</script>

<template>
  <div class="modal">
    <div class="modal-content">
      <h1>Register</h1>
      <button class="close-button" @click="closeModal">✕</button>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="username">Username:</label>
          <input id="username" v-model="username" required />
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input id="email" type="email" v-model="email" required />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input id="password" type="password" v-model="password" required />
        </div>
        <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
        <div class="button-group">
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  </div>
</template>
