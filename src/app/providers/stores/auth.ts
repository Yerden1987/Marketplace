import { defineStore } from "pinia";
import axios from "axios";
import { ref, computed } from "vue";
import type { UserCredentials } from "@/shared/types/UserCredentials";

const API_URL = "https://api.escuelajs.co/api/v1/auth";

export const useAuthStore = defineStore("auth", () => {
  const accessToken = ref<string | null>(localStorage.getItem("access_token"));
  const refreshToken = ref<string | null>(
    localStorage.getItem("refresh_token")
  );
  const user = ref<any>(null);
  const loginError = ref<boolean>(false);

  async function login(userCredentials: UserCredentials) {
    try {
      const { data } = await axios.post(`${API_URL}/login`, userCredentials);
      accessToken.value = data.access_token;
      refreshToken.value = data.refresh_token;
      localStorage.setItem("access_token", accessToken.value);
      localStorage.setItem("refresh_token", refreshToken.value);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${accessToken.value}`;
      console.log(accessToken.value, refreshToken.value);

      await getUserDetails();
      loginError.value = false;
    } catch (err) {
      console.log("Login failed", err);
      loginError.value = true;
      throw err;
    }
  }

  async function register(userCredentials: UserCredentials) {
    try {
      await axios.post(`${API_URL}/register`, userCredentials);
      return true;
    } catch (err) {
      console.log("Registration failed", err);
      throw err;
    }
  }

  async function getUserDetails() {
    try {
      const { data } = await axios.get(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
      });
      console.log(data);

      user.value = data;
    } catch (err) {
      console.log("Failed to get user details!");
    }
  }

  async function logout() {
    accessToken.value = null;
    refreshToken.value = null;
    user.value = null;
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    delete axios.defaults.headers.common["Authorization"];
  }

  async function createUser(userData: { name: string; email: string; password: string; avatar: string }) {
    try {
      await axios.post('https://api.escuelajs.co/api/v1/users/', userData);
      return true;
    } catch (err) {
      console.log("User creation failed", err);
      throw err;
    }
  }

  const isAuthenticated = computed(() => !!accessToken.value);

  return {
   accessToken,
    refreshToken,
    user,
    login,
    register,
    logout,
    getUserDetails,
    isAuthenticated,
    loginError,
    createUser,
  };
});
