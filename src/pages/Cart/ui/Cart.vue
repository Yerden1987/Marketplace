<script setup lang="ts">
import { useCartStore } from "@/app/providers/stores/cart";
import { storeToRefs } from "pinia";
import { ref } from "vue";
// import FavoritesList from "@/pages/Favorites/ui/Favorites.vue";

const cartStore = useCartStore();
const { cartItems, cartCount, totalSum } = storeToRefs(cartStore);

const removeFromCart = (productId: number) => {
  cartStore.removeFromCart(productId);
};

const updateQuantity = (productId: number, quantity: number) => {
  cartStore.updateQuantity(productId, quantity);
};

const showModal = ref(false);

const openModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const handleCheckout = () => {
  openModal();
};
</script>

<template>
  <div class="cart-container">
    <h2 v-if="cartItems.length > 0">Shopping Cart</h2>
    <h2 v-else>Your cart is empty</h2>
    <table v-if="cartItems.length > 0" class="cart-table">
      <thead>
        <tr>
          <th>Product Image</th>
          <th>Product Title</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Total</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in cartItems" :key="product.id">
          <td>
            <img :src="product.images[0]" :alt="product.title" class="product-image" />
          </td>
          <td>{{ product.title }}</td>
          <td>$ {{ product.price }}</td>
          <td>
            <input
              type="number"
              v-model.number="product.quantity"
              @input="updateQuantity(product.id, product.quantity)"
              min="1"
              class="quantity-input"
            />
          </td>
          <td>$ {{ product.price * product.quantity }}</td>
          <td>
            <button @click="removeFromCart(product.id)" class="remove-button">Remove</button>
          </td>
        </tr>
      </tbody>
    </table>
    
    <div v-if="cartItems.length > 0" class="cart-summary">
      <h3>Total: $ {{ totalSum }}</h3>
      <button @click="handleCheckout" class="checkout-button">Checkout</button>
    </div>

    <div v-if="showModal" class="modal" @click.self="closeModal">
      <div class="modal-content">
        <p>You can send your money to my Kaspi number +7(707) 321 95 55</p>
        <button class="close-button" @click="closeModal">Close</button>
      </div>
    </div>

    <FavoritesList />
  </div>
</template>

