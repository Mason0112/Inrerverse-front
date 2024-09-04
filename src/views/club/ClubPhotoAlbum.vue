<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold mb-4 text-black text-center">俱樂部相簿</h2>
    
    <!-- 上傳照片表單，只有成員可見 -->
    <div v-if="isMember" class="mb-6">
      <h3 class="text-lg font-semibold mb-2">上傳新照片</h3>
      <input 
        type="file" 
        @change="handleFileChange" 
        accept="image/*" 
        class="mb-2"
      >
      <button 
        @click="uploadPhoto" 
        class="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded"
        :disabled="!selectedFile"
      >
        上傳照片
      </button>
    </div>

    <!-- 照片網格或無照片訊息 -->
    <div v-if="photos.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div v-for="photo in photos" :key="photo.id" class="relative">
        <img 
          :src="getPhotoUrl(clubId, photo.id)"
          :alt="'俱樂部照片'"
          class="w-full h-48 object-cover rounded-lg shadow-md"
          @error="handleImageError"
        >
        <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg">
          <p class="text-sm">上傳者 ID: {{ photo.userName }}</p>
          <button 
            v-if="isMember && photo.uploaderId === userStore.userId" 
            @click="deletePhoto(photo.id)" 
            class="bg-red-500 hover:bg-red-700 text-black text-xs py-1 px-2 rounded mt-1"
          >
            刪除
          </button>
        </div>
      </div>
    </div>
    <div v-else-if="!loading" class="text-center text-gray-500 my-8">
      尚無相片
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

const props = defineProps({
  clubId: {
    type: String,
    required: true
  },
  isMember: {
    type: Boolean,
    required: true
  }
});

const route = useRoute();
const userStore = useUserStore();

const photos = ref([]);
const selectedFile = ref(null);
const error = ref(null);
const loading = ref(true);

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0];
};

const uploadPhoto = async () => {
  if (!selectedFile.value || !props.isMember) return;

  const formData = new FormData();
  formData.append('file', selectedFile.value);
  formData.append('clubId', props.clubId);
  formData.append('uploaderId', userStore.userId);

  try {
    const response = await axios.post('/clubPhoto/new', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    // 確保新照片對象包含所有必要的信息
    const newPhoto = {
      ...response.data,
      uploaderId: userStore.userId, // 確保 uploaderId 存在
      url: getPhotoUrl(props.clubId, response.data.id)
    };
    
    photos.value.unshift(newPhoto);
    selectedFile.value = null;
  } catch (err) {
    handleApiError(err, '上傳照片失敗');
  }
};

const getPhotoUrl = (clubId, photoId) => {
  return `${import.meta.env.VITE_API_URL}/clubPhoto/${clubId}/${photoId}`;
};

const fetchPhotos = async () => {
  try {
    loading.value = true;
    const response = await axios.get(`/clubPhoto/club/${props.clubId}`);
    if (response.data && Array.isArray(response.data)) {
      photos.value = response.data.map(photo => ({
        ...photo,
        url: getPhotoUrl(props.clubId, photo.id)
      }));
    } else {
      error.value = '獲取照片失敗：伺服器回應格式不正確';
    }
  } catch (err) {
    handleApiError(err, '獲取照片失敗');
  } finally {
    loading.value = false;
  }
};
const deletePhoto = async (photoId) => {
  if (!props.isMember) return;
  
  try {
    await axios.delete(`/clubPhoto/delete/${photoId}`, {
      params: { uploaderId: userStore.userId }
    });
    photos.value = photos.value.filter(photo => photo.id !== photoId);
  } catch (err) {
    handleApiError(err, '刪除照片失敗');
  }
};

const handleImageError = (event) => {
  event.target.src = '/path/to/placeholder-image.jpg';
  event.target.alt = '照片無法載入';
};

const handleApiError = (err, defaultMessage) => {
  if (err.response) {
    if (err.response.status === 404) {
      error.value = '找不到請求的資源，請聯繫管理員';
    } else if (err.response.status === 500) {
      error.value = '伺服器內部錯誤，請稍後再試或聯繫管理員';
    } else {
      error.value = `${defaultMessage}：${err.response.data || err.message}`;
    }
  } else if (err.request) {
    error.value = '無法連接到伺服器，請檢查您的網絡連接';
  } else {
    error.value = `${defaultMessage}：${err.message}`;
  }
  console.error('API 錯誤:', err);
};

onMounted(() => {
  fetchPhotos();
});
</script>