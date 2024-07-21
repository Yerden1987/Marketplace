import type { UserRegistration } from "@/shared/types/UserCredentials";
import axios from "axios";
import { defineStore } from "pinia";

export const useRegisterStore = defineStore("register", () => {
  const registerUser = async (user: UserRegistration) => {
    try {
      const response = await axios.post(
        "https://api.escuelajs.co/api/v1/users/",
        user
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to register user");
    }
  };

  return {
    registerUser,
  };
});
