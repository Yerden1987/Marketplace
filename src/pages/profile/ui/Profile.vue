<script setup lang="ts">
import { useAuthStore } from "@/app/providers/stores/auth";
import { storeToRefs } from "pinia";
import { onBeforeMount } from "vue";

// const { user, getUserDetails } = useAuthStore();
const userStore = useAuthStore();
const { user } = storeToRefs(userStore);

onBeforeMount(() => {
  userStore.getUserDetails();
});
</script>
<template>
  <div class="profile-container">
    <div class="profile-header">
      <img :src="user.avatar" alt="User Avatar" class="profile-avatar" />
      <h1 class="profile-name">{{ user.name }}</h1>
      <p class="profile-email">{{ user.email }}</p>
    </div>
  </div>
</template>
