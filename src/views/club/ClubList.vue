<template>
    <div class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">社團列表</h1>
        <router-link 
          :to="{ name: 'club-form-link' }" 
          class="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded"
        >
          新增俱樂部
        </router-link>
      </div>
      <div v-if="loading" class="text-center py-4">
        <p class="text-xl">加載中...</p>
      </div>
      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong class="font-bold">錯誤：</strong>
        <span class="block sm:inline">{{ error }}</span>
      </div>
      <div v-else>
        <table class="min-w-full bg-white">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-2 text-left">ID</th>
              <th class="px-4 py-2 text-left">社團名稱</th>
              <th class="px-4 py-2 text-left">公開</th>
              <th class="px-4 py-2 text-left">允許</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="club in clubs" :key="club.id" class="border-b hover:bg-gray-50">
              <td class="px-4 py-2">{{ club.id }}</td>
              <td class="px-4 py-2">
                <router-link 
                  :to="{ name: 'club-detail-link', params: { id: club.id } }" 
                  class="text-blue-500 hover:underline cursor-pointer"
                >
                  {{ club.clubName }}
                </router-link>
              </td>
              <td class="px-4 py-2">{{ club.isPublic ? '是' : '否' }}</td>
              <td class="px-4 py-2">{{ club.isAllowed ? '是' : '否' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from "@/plugins/axios";
  
  const clubs = ref([]);
  const loading = ref(true);
  const error = ref(null);
  
  const fetchClubs = async () => {
    try {
      const response = await axios.get('/clubs/all');
      clubs.value = response.data;
      loading.value = false;
    } catch (err) {
      console.error('Error fetching clubs:', err);
      error.value = err.message;
      loading.value = false;
    }
  };
  
  onMounted(fetchClubs);
  </script>