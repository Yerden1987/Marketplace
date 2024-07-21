import { createRouter, createWebHistory } from "vue-router";
import { HomePage } from "@/pages/home";
import { ProfilePage } from "@/pages/profile";
import { LoginPage } from "@/pages/login";
import { FavoritesPage } from "@/pages/Favorites";
import { RegisterPage } from "@/pages/Register";
import { CartPage } from "@/pages/Cart";
import { AdminPage } from "@/pages/Admin";
import {CategoriesPage} from "@/pages/Category"


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "home", component: HomePage },
    { path: "/favorites", name: "favorites", component: FavoritesPage },
    { path: "/cart", name: "cart", component: CartPage },
    {
      path: "/profile",
      name: "profile",
      component: ProfilePage,
      meta: { requiresAuth: true },
    },
    { path: "/login", name: "login", component: LoginPage },
    { path: "/register", name: "register", component: RegisterPage },
    {
      path: "/admin",
      name: "admin",
      component: AdminPage,
      meta: { requiresAuth: true, isAdmin: true },
    },
    {
      path: "/category/:id",
      name: "category",
      component: CategoriesPage,
      props: true
    },
  ],
});

export default router;
