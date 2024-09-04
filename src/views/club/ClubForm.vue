<template>
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4 text-black">新增俱樂部</h1>
      <div v-if="loading">加載中...</div>
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
  
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="photo">
            照片
          </label>
          <input type="file" @change="handleFileUpload" accept="image/*" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="photo">
        </div>
  
        <div v-if="photoPreview" class="mb-4 flex justify-center">
          <div class="w-12 h-12 overflow-hidden rounded-md">
            <img :src="photoPreview" alt="照片預覽" class="object-cover w-full h-full">
          </div>
        </div>
        
        <div class="flex items-center justify-between">
          <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            新增俱樂部
          </button>
          <router-link :to="{ name: 'club-all-link' }" class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
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
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from "@/plugins/axios";
  import useUserStore from "@/stores/userstore";
  
  const router = useRouter();
  const userStore = useUserStore();
  
  const loading = ref(false); // 新增時不需要加載狀態
  const errorMessage = ref('');
  const photoFile = ref(null);
  const photoPreview = ref(null);
  
  const club = ref({
    clubName: '',
    description: '',
    isPublic: 1,
    isAllowed: 1,
    clubCreator: { id: userStore.userId },
    photo: null
  });
  
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // 檢查文件大小（例如，限制為 5MB）
      if (file.size > 5 * 1024 * 1024) {
        errorMessage.value = '文件大小不能超過 5MB';
        return;
      }
      // 檢查文件類型
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        errorMessage.value = '只允許上傳 JPG、PNG 或 GIF 格式的圖片';
        return;
      }
      photoFile.value = file;
      photoPreview.value = URL.createObjectURL(file);
    }
  };
  
  const submitForm = async () => {
    const formData = new FormData();
  
    const clubData = {
      ...club.value,
      clubCreator: { id: club.value.clubCreator.id }
    };
  
    formData.append('club', new Blob([JSON.stringify(clubData)], {
      type: 'application/json'
    }));
  
    if (photoFile.value) {
      formData.append('photo', photoFile.value);
    }
  
    try {
      const response = await axios.post('/clubs/new', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Club created:', response.data);
      alert('俱樂部創建成功，您已自動加入該俱樂部！');
      router.push({ name: 'club-all-link' });
    } catch (error) {
      console.error('Error creating club:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        errorMessage.value = `創建失敗: ${JSON.stringify(error.response.data)}`;
      } else if (error.request) {
        errorMessage.value = '無法連接到伺服器，請檢查網絡連接';
      } else {
        errorMessage.value = `請求設置錯誤: ${error.message}`;
      }
    }
  };
  </script>
  