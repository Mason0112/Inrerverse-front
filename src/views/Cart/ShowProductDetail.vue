<template>
<div class="ts-container product-details" v-if="product">
    <div class="ts-grid">
      <div class="column is-7-wide">
        <div class="carousel-container">
          <transition name="fade" mode="out-in">
            <div class="ts-image main-image" :key="currentImageIndex">
              <img :src="currentImageUrl" :alt="product.name"/>
            </div>
          </transition>
          <button class="carousel-button prev" @click="prevImage">&lt;</button>
          <button class="carousel-button next" @click="nextImage">&gt;</button>
        </div>
        <div class="ts-grid thumbnail-grid">
          <div class="column" v-for="(photo, index) in productPhotos" :key="photo.id">
            <div class="ts-image thumbnail" @click="setCurrentImage(index)" :class="{ active: currentImageIndex === index }">
              <img :src="getPhotoUrl(photo)" :alt="product.name"/>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-9-wide product-info">
        <h1 class="ts-header is-huge">{{ product.name }}</h1>
        <p class="ts-text is-large price">NT$ {{ product.price }}</p>
        <p class="ts-text">顏色：{{ product.color }}</p>
        <div class="ts-divider"></div>
        <div class="ts-grid">
          <div class="column is-8-wide">
            <div class="ts-input is-fluid">
              <input type="number" v-model.number="vol" min="1" :max="100">
            </div>
          </div>
        </div>
        <div class="ts-grid has-top-spaced">
          <div class="column is-16-wide">
            <button class="ts-button is-fluid is-positive" @click="addToCart" :disabled="!isValidInput">
              加入購物車
            </button>
          </div>
        </div>
        <div class="ts-box is-segment has-top-spaced-large">
          <div class="ts-content">
            <h3 class="ts-header">商品說明</h3>
            <p class="ts-text">{{ product.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted, computed } from 'vue'
import axiosapi from '@/plugins/axios';
import useUserStore from '@/stores/userstore';

const route = useRoute();
const product = ref(null);
const vol = ref(1);
const currentImageIndex = ref(0);
const productPhotos = ref([]);

const currentImageUrl = computed(() => {
  if (productPhotos.value.length > 0) {
    return getPhotoUrl(productPhotos.value[currentImageIndex.value]);
  }
  return '';
});

const isValidInput = computed(() => {
  return product.value && vol.value > 0;
});

onMounted(() => {
  const productId = route.params.id;
  getProductById(productId);
  getProductPhotos(productId);
});

function getProductById(id) {
  axiosapi.get(`/products/${id}`).then(function (response) {
    product.value = response.data;
  }).catch(error => {
    console.error("Error fetching product:", error);
  });
}

function getProductPhotos(productId) {
  axiosapi.get(`/api/product-photos/product/${productId}`).then(function (response) {
    productPhotos.value = response.data;
  }).catch(error => {
    console.error("Error fetching product photos:", error);
  });
}

function getPhotoUrl(photo) {
  return `/interverse/products/${product.value.id}/photos/${photo.id}`;
}

function addToCart() {
  if (!isValidInput.value) return;

  const request = {
    "usersId": userStore.userId,
    "productsId": product.value.id,
    "vol": vol.value
  };

  axiosapi.post("/cart/add", request).then(function (productResponse) {
    console.log("加入購物車成功", productResponse);
    // 這裡可以添加成功提示
  }).catch(error => {
    console.error("加入購物車失敗", error);
    // 這裡可以添加錯誤提示
  });
}

function prevImage() {
  currentImageIndex.value = (currentImageIndex.value - 1 + productPhotos.value.length) % productPhotos.value.length;
}

function nextImage() {
  currentImageIndex.value = (currentImageIndex.value + 1) % productPhotos.value.length;
}

function setCurrentImage(index) {
  currentImageIndex.value = index;
}
</script>

<style scoped>
/* 樣式保持不變 */
</style>