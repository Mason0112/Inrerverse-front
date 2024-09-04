<template>
    <div class="container mx-auto p-4 flex justify-center">
      <div class="w-full max-w-4xl">
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
                <th class="px-4 py-2 text-center">照片</th>
                <th class="px-4 py-2 text-center">ID</th>
                <th class="px-4 py-2 text-center">社團名稱</th>
                <th class="px-4 py-2 text-center">公開</th>
                <th class="px-4 py-2 text-center">參加</th>
                <!-- <th class="px-4 py-2 text-center">操作</th> -->
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
                <!-- <td class="px-4 py-2 text-center">{{ club.isAllowed === 1 ? '是' : '否' }}</td> -->
                <td class="px-4 py-2 text-center">
            <button @click="joinClub(club)" class="bg-green-500 hover:bg-green-700 text-black font-bold py-2 px-4 rounded">
              加入
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
  
  const fetchClubs = async () => {
    try {
        console.log( userStore.userId);
      const response = await axios.get('/clubs/all');
      clubs.value = response.data;
      loading.value = false;
    } catch (err) {
      console.error('Error fetching clubs:', err);
      error.value = err.message;
      loading.value = false;
    }
  };
  
  const getPhotoUrl = (photoName) => {
    if (!photoName) return null;
    return `${import.meta.env.VITE_API_URL}/clubs/photo/${photoName}`;
  };
  
  const joinClub = async (club) => {
  const clubMemberDTO = {
    clubId: club.id,
    userId: userStore.userId,
    status: club.isPublic === 1 ? 1 : 0  // 如果 isPublic 為 1，status 設為 1，否則為 0
  };
  console.log(clubMemberDTO);
  try {
    const response = await axios.post('/clubMember', clubMemberDTO);
    if (club.isPublic === 1) {
      alert('已成功加入俱樂部！');
    } else {
      alert('已成功提交申請！等待審核中。');
    }
  } catch (error) {
    console.error('Error joining club:', error);
    alert('無法加入俱樂部，請稍後再試。');
  }
};

  onMounted(fetchClubs);

  </script>
  