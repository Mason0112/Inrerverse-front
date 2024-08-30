<template>
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4 text-black">新增俱樂部</h1>
      <form @submit.prevent="submitForm" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="clubName">
            社團名稱
          </label>
          <input v-model="club.clubName" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="clubName" type="text" placeholder="輸入社團名稱" required>
        </div>
        
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="description">
            描述
          </label>
          <textarea v-model="club.description" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="description" placeholder="輸入社團描述" rows="3"></textarea>
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
            創建俱樂部
          </button>
          <router-link :to="{ name: 'club-all-link' }" class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
            返回列表
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
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from "@/plugins/axios";
  import useUserStore from "@/stores/userstore";
  
  const router = useRouter();
  const userStore = useUserStore();
  const errorMessage = ref('');
  
  const userId = userStore.userId;
  
  const club = ref({
    clubName: '',
    description: '',
    isPublic: 1,
    isAllowed: 1,
    clubCreator: {
      id: userId
    }
  });
  
  const submitForm = async () => {
    try {
      console.log('Submitting club data:', JSON.stringify(club.value));
      const response = await axios.post('/clubs/new', club.value, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Club created:', response.data);
      router.push({ name: 'club-all-link' });
    } catch (error) {
      console.error('Error creating club:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        errorMessage.value = `服務器錯誤: ${error.response.status} - ${JSON.stringify(error.response.data)}`;
      } else if (error.request) {
        console.error('No response received:', error.request);
        errorMessage.value = '無法連接到服務器，請檢查網絡連接。';
      } else {
        console.error('Error setting up request:', error.message);
        errorMessage.value = `請求錯誤: ${error.message}`;
      }
    }
  };
  </script>