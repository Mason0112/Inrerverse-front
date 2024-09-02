<template>
    <div class="container mx-auto p-4 flex justify-center">
      <div class="w-full max-w-4xl">
        <div class="flex justify-between items-center mb-4">
          <h1 class="text-2xl font-bold">我加入的俱樂部</h1>
        </div>
        <div v-if="loading" class="text-center py-4">
          <p class="text-xl">加載中...</p>
        </div>
        <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong class="font-bold">錯誤：</strong>
          <span class="block sm:inline">{{ error }}</span>
        </div>
        <div v-else-if="clubs.length === 0" class="text-center py-4">
          <p class="text-xl">您還沒有加入任何俱樂部。</p>
        </div>
        <div v-else>
          <table class="min-w-full bg-white">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-2 text-center">照片</th>
                <th class="px-4 py-2 text-center">ID</th>
                <th class="px-4 py-2 text-center">社團名稱</th>
                <th class="px-4 py-2 text-center">公開</th>
                <!-- <th class="px-4 py-2 text-center">狀態</th> -->
                <th class="px-4 py-2 text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="club in clubs" :key="club.id" class="border-b hover:bg-gray-50">
                <td class="px-4 py-2 text-center">
                  <div class="w-16 h-16 overflow-hidden rounded-md flex justify-center">
                    <img 
                      v-if="club.photo && getPhotoUrl(club.photo)"
                      :src="getPhotoUrl(club.photo)"
                      :alt="club.clubName"
                      class="object-cover w-full h-full"
                      style="width: 64px; height: 64px;"
                      @error="handleImageError"
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
                <!-- <td class="px-4 py-2 text-center">{{ club.status === 1 ? '已加入' : '待審核' }}</td> -->
                <td class="px-4 py-2 text-center">
                    <button
                @click="quitClub(club.id)"
                class="bg-red-500 hover:bg-red-700 text-black font-bold py-2 px-4 rounded"
              >
                退出社團
              </button>
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
      const response = await axios.get(`/clubMember/user/${userStore.userId}/clubs`);
      clubs.value = response.data;
      console.log('Fetched clubs:', clubs.value);
      loading.value = false;
    } catch (err) {
      console.error('Error fetching my clubs:', err);
      error.value = err.response?.data?.message || '獲取俱樂部列表時出錯';
      loading.value = false;
    }
  };
  
  const getPhotoUrl = (photoName) => {
    if (!photoName) return null;
    const url = `${import.meta.env.VITE_API_URL}/clubs/photo/${photoName}`;
    return url;
  };
  
  const handleImageError = (event) => {
    console.error('Image failed to load:', event.target.src);
    event.target.src = ''; // 設置為空字符串以顯示替代內容
  };
  
  const quitClub = async (clubId) => {
    console.log('Sending quit request for clubId:', clubId);
    if (!confirm('確定要退出這個社團嗎？')) {
      return;
    }
    try {
      await axios.delete(`/clubMember/user/${userStore.userId}/delete/${clubId}`);
      alert('您已成功退出社團');
      // 從列表中移除該俱樂部
      clubs.value = clubs.value.filter(club => club.id !== clubId);
    } catch (err) {
      console.error('Error quitting club:', err);
      alert(err.response?.data?.message || '退出社團時出錯，請稍後再試');
    }
  };
  
  onMounted(() => {
  console.log('Component mounted, fetching clubs...');
  fetchMyClubs();
});  </script>