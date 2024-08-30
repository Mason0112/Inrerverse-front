<template>
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">社團詳情</h1>
      <div v-if="loading" class="text-center">
        <p class="text-xl">加載中...</p>
      </div>
      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong class="font-bold">錯誤：</strong>
        <span class="block sm:inline">{{ error }}</span>
      </div>
      <div v-else-if="club" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 class="text-xl font-bold mb-4">{{ club.clubName }}</h2>
        <div class="mb-4">
          <p class="text-gray-700 text-sm font-bold mb-2">ID：</p>
          <p class="text-gray-700">{{ club.id }}</p>
        </div>
        <div class="mb-4">
          <p class="text-gray-700 text-sm font-bold mb-2">描述：</p>
          <p class="text-gray-700">{{ club.description }}</p>
        </div>
        <div class="mb-4">
          <p class="text-gray-700 text-sm font-bold mb-2">公開：</p>
          <p class="text-gray-700">{{ club.isPublic ? '是' : '否' }}</p>
        </div>
        <div class="mb-4">
          <p class="text-gray-700 text-sm font-bold mb-2">允許：</p>
          <p class="text-gray-700">{{ club.isAllowed ? '是' : '否' }}</p>
        </div>
        <router-link :to="{ name: 'club-all-link' }" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          返回列表
        </router-link>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import axios from "@/plugins/axios";
  
  const route = useRoute();
  const router = useRouter();
  const club = ref(null);
  const loading = ref(true);
  const error = ref(null);
  
  const fetchClubDetails = async () => {
    const id = route.params.id;
    try {
      const response = await axios.get(`/clubs/${id}`);
      club.value = response.data;
      loading.value = false;
    } catch (err) {
      console.error('Error fetching club details:', err);
      error.value = err.message;
      loading.value = false;
    }
  };
  
  onMounted(fetchClubDetails);
  </script>