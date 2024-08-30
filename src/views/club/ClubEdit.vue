<template>
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4 text-black">編輯俱樂部</h1>
      <div v-if="loading">加載中...</div>
      <div v-else-if="!hasPermission" class="text-red-500">
        您沒有權限編輯此俱樂部。
      </div>
      <form v-else @submit.prevent="submitForm" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="clubName">
            社團名稱
          </label>
          <input v-model="club.clubName" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="clubName" type="text" required>
        </div>
        
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="description">
            描述
          </label>
          <textarea v-model="club.description" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="description" rows="3"></textarea>
        </div>
        
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="isPublic">
            公開
          </label>
          <select v-model="club.isPublic" id="isPublic" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option :value="1">是</option>
            <option :value="0">否</option>
          </select>
        </div>
        
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="isAllowed">
            允許
          </label>
          <select v-model="club.isAllowed" id="isAllowed" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option :value="1">是</option>
            <option :value="0">否</option>
          </select>
        </div>
        
        <div class="flex items-center justify-between">
          <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            更新俱樂部
          </button>
          <router-link :to="{ name: 'club-detail-link', params: { id: clubId } }" class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
            取消
          </router-link>
        </div>
      </form>
      <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong class="font-bold">錯誤：</strong>
        <span class="block sm:inline">{{ errorMessage }}</span>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import axios from "@/plugins/axios";
  import useUserStore from "@/stores/userstore";
  
  const router = useRouter();
  const route = useRoute();
  const userStore = useUserStore();
  
  const loading = ref(true);
  const hasPermission = ref(false);
  const errorMessage = ref('');
  
  const clubId = route.params.id;
  
  const club = ref({
    clubName: '',
    description: '',
    isPublic: 1,
    isAllowed: 1, // 添加 isAllowed 字段並設置默認值
    clubCreator: null
  });
  
  const fetchClubDetails = async () => {
    try {
      const response = await axios.get(`/clubs/${clubId}`);
      club.value = {
        ...response.data,
        isPublic: response.data.isPublic ? 1 : 0,
        isAllowed: response.data.isAllowed ? 1 : 0
      };
      console.log('Club data:', JSON.stringify(club.value, null, 2));
      
      const creatorId = Number(club.value.clubCreator);
      const userId = Number(userStore.userId);
      
      console.log('Creator ID:', creatorId, 'Type:', typeof creatorId);
      console.log('User ID:', userId, 'Type:', typeof userId);
      
      hasPermission.value = !isNaN(creatorId) && !isNaN(userId) && creatorId === userId;
      console.log('Has Permission:', hasPermission.value);
      
      loading.value = false;
    } catch (error) {
      console.error('Error fetching club details:', error);
      errorMessage.value = '獲取俱樂部詳情時出錯';
      loading.value = false;
    }
  };
  
  const submitForm = async () => {
    if (!hasPermission.value) {
      errorMessage.value = '您沒有權限編輯此俱樂部';
      return;
    }
  
    const updateData = {
      clubName: club.value.clubName,
      description: club.value.description,
      isPublic: club.value.isPublic,
      isAllowed: club.value.isAllowed, // 添加 isAllowed 到更新數據中
      clubCreator: { id: club.value.clubCreator }
    };
    console.log('Updating club with data:', JSON.stringify(updateData, null, 2));
  
    try {
      const response = await axios.put(`/clubs/${clubId}/edit`, updateData);
      console.log('Club updated:', response.data);
      router.push({ name: 'club-detail-link', params: { id: clubId } });
    } catch (error) {
      console.error('Error updating club:', error);
      errorMessage.value = error.response?.data?.message || '更新俱樂部時出錯';
    }
  };
  
  onMounted(fetchClubDetails);
  </script>