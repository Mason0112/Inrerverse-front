<template>
    <div class="container mx-auto p-4 flex justify-center">
      <div class="w-full max-w-4xl">
        <div class="flex justify-between items-center mb-4">
          <h1 class="text-2xl font-bold">我創建的俱樂部</h1>
          <router-link 
            :to="{ name: 'club-approve-link' }"
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
                <th class="px-4 py-2 text-center">照片</th>
                <th class="px-4 py-2 text-center">ID</th>
                <th class="px-4 py-2 text-center">社團名稱</th>
                <th class="px-4 py-2 text-center">公開</th>
                <th class="px-4 py-2 text-center">允許</th>
                <th class="px-4 py-2 text-center">編輯</th>
                <th class="px-4 py-2 text-center">審核</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="club in clubs" :key="club.id" class="border-b hover:bg-gray-50">
                <td class="px-4 py-2 text-center">
                  <div class="w-16 h-16 overflow-hidden rounded-md flex justify-center">
                    <img 
                      v-if="club.photo" 
                      :src="getPhotoUrl(club.photo)" 
                      :alt="club.clubName" 
                      class="object-cover w-full h-full"
                      style="width: 64px; height: 64px;"
                    >
                    <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500" style="width: 64px; height: 64px;">
                      無照片
                    </div>
                  </div>
                </td>
                <td class="px-4 py-2 text-center">{{ club.id }}</td>
                <td class="px-4 py-2 text-center">
                  <router-link 
                    :to="{ name: 'club-detail-link', params: { id: club.id } }"
                    class="text-blue-500 hover:underline cursor-pointer"
                  >
                    {{ club.clubName }}
                  </router-link>
                </td>
                <td class="px-4 py-2 text-center">{{ club.isPublic === 1 ? '是' : '否' }}</td>
                <td class="px-4 py-2 text-center">{{ club.isAllowed === 1 ? '是' : '否' }}</td>
                <td class="px-4 py-2 text-center">
                  <router-link 
                    :to="{ name: 'club-edit-link', params: { id: club.id } }"
                    class="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded"
                  >
                    編輯
                  </router-link>
                </td>
               
                <td>
                    <router-link 
                    :to="{ name: 'club-approve2-link', params: { id: club.id } }" 
                    class="btn">管理成員</router-link>
                  </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from "@/plugins/axios";
  import useUserStore from "@/stores/userstore";
  
  const clubs = ref([]);
  const loading = ref(true);
  const error = ref(null);
  const userStore = useUserStore();
  
  const fetchMyClubs = async () => {
    try {
      const response = await axios.get(`/clubs/my-clubs?userId=${userStore.userId}`);
      clubs.value = response.data;
      loading.value = false;
    } catch (err) {
      console.error('Error fetching my clubs:', err);
      error.value = err.message;
      loading.value = false;
    }
  };
  
  const getPhotoUrl = (photoName) => {
    if (!photoName) return null;
    return `${import.meta.env.VITE_API_URL}/clubs/photo/${photoName}`;
  };
  
  onMounted(fetchMyClubs);
  </script>