<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold mb-4 text-black text-center">俱樂部相簿</h2>
    
    <!-- 上傳照片表單 -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-2">上傳新照片</h3>
      <input 
        type="file" 
        @change="handleFileChange" 
        accept="image/*" 
        class="mb-2"
      >
      <button 
        @click="uploadPhoto" 
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        :disabled="!selectedFile"
      >
        上傳照片
      </button>
    </div>

    <!-- 照片網格或無照片訊息 -->
    <div v-if="photos.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div v-for="photo in photos" :key="photo.id" class="relative">
        <img 
          :src="getPhotoUrl(photo.photoName)" 
          :alt="photo.description || '俱樂部照片'" 
          class="w-full h-48 object-cover rounded-lg shadow-md"
          @error="handleImageError"
        >
        <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg">
          <p class="text-sm">上傳者: {{ photo.uploaderName }}</p>
          <p class="text-xs">{{ formatDate(photo.uploadTime) }}</p>
        </div>
      </div>
    </div>
    <div v-else-if="!loading" class="text-center text-gray-500 my-8">
      尚無相片
    </div>

    <!-- 載入更多按鈕 -->
    <div v-if="hasMorePhotos" class="text-center mt-4">
      <button 
        @click="loadMorePhotos" 
        class="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
      >
        載入更多
      </button>
    </div>

    <!-- 錯誤訊息 -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
      <strong class="font-bold">錯誤：</strong>
      <span class="block sm:inline">{{ error }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from "@/plugins/axios";
import useUserStore from "@/stores/userstore";

const route = useRoute();
const userStore = useUserStore();

const clubId = route.params.id;
const photos = ref([]);
const selectedFile = ref(null);
const error = ref(null);
const page = ref(1);
const hasMorePhotos = ref(true);
const loading = ref(true);

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0];
};

const uploadPhoto = async () => {
  if (!selectedFile.value) return;

  const formData = new FormData();
  formData.append('file', selectedFile.value);
  formData.append('clubId', clubId);
  formData.append('uploaderId', userStore.userId);

  try {
    const response = await axios.post('/club-photos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    photos.value.unshift(response.data);
    selectedFile.value = null;
  } catch (err) {
    error.value = '上傳照片失敗：' + (err.response?.data || err.message);
  }
};

const getPhotoUrl = (photoName) => {
  return `${import.meta.env.VITE_API_URL}/club-photos/${photoName}`;
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString();
};

const fetchPhotos = async () => {
  try {
    loading.value = true;
    const response = await axios.get(`/club-photos/${clubId}?page=${page.value}`);
    photos.value = [...photos.value, ...response.data];
    hasMorePhotos.value = response.data.length === 10; // 假設每頁 10 張照片
    page.value++;
  } catch (err) {
    error.value = '獲取照片失敗：' + (err.response?.data || err.message);
  } finally {
    loading.value = false;
  }
};

const loadMorePhotos = () => {
  fetchPhotos();
};

const handleImageError = (event) => {
  event.target.src = '/path/to/placeholder-image.jpg'; // 替換為實際的佔位圖片路徑
  event.target.alt = '照片無法載入';
};

onMounted(() => {
  fetchPhotos();
});
</script>