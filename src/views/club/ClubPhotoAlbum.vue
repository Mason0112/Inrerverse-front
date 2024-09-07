<template>
  <div class="ts-container">
    <div class="ts-header is-huge is-center-aligned">俱樂部相簿</div>
    <div class="ts-space"></div>
    
    <!-- 上傳照片表單，只有成員可見 -->
    <div v-if="isMember" class="ts-space">
      <div class="ts-header is-large">上傳新照片</div>
      <div class="ts-space"></div>
      <div class="ts-input is-fluid">
        <input 
          type="file" 
          @change="handleFileChange" 
          accept="image/*"
        >
      </div>
      <div class="ts-space"></div>
      <button 
        @click="uploadPhoto" 
        class="ts-button is-primary text-black"
        :disabled="!selectedFile"
      >
        上傳照片
      </button>
    </div>

    <!-- 照片輪播圖 -->
    <div v-if="photos.length > 0" class="carousel-container">
      <transition-group name="fade" tag="div" class="carousel-slides">
        <div v-for="(photo, index) in photos" :key="photo.id" v-show="index === currentIndex" class="carousel-slide">
          <img 
            :src="getPhotoUrl(clubId, photo.id)"
            :alt="'俱樂部照片'"
            @error="handleImageError"
            :data-retries="0"
          >
          <div class="carousel-caption">
            <p>上傳者: {{ photo.userName }}</p>
            <button 
              v-if="isMember && photo.uploaderId === userStore.userId" 
              @click.stop="deletePhoto(photo.id)" 
              class="ts-button is-negative is-small"
            >
              刪除
            </button>
          </div>
        </div>
      </transition-group>
      
      <!-- 輪播圖控制按鈕 -->
      <button @click="prevSlide" class="carousel-control left">&lt;</button>
      <button @click="nextSlide" class="carousel-control right">&gt;</button>
    </div>

    <div v-else-if="!loading" class="ts-center">
      尚無相片
    </div>

    <!-- 錯誤訊息 -->
    <div v-if="error" class="ts-notice is-negative">
      <div class="content">
        <div class="header">錯誤</div>
        <p>{{ error }}</p>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
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
const currentIndex = ref(0);
let autoPlayInterval = null;

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
    
    const newPhoto = {
      ...response.data,
      uploaderId: userStore.userId,
      userName: userStore.nickname,
      url: getPhotoUrl(props.clubId, response.data.id)
    };
    
    photos.value.unshift(newPhoto);
    selectedFile.value = null;
  } catch (err) {
    handleApiError(err, '上傳照片失敗');
  }
};

const loadNewPhoto = async (photo) => {
  try {
    const img = new Image();
    img.onload = () => {
      photo.loading = false;
      photo.url = img.src;
    };
    img.onerror = () => {
      photo.loading = false;
      photo.error = true;
    };
    img.src = getPhotoUrl(props.clubId, photo.id, true);
  } catch (err) {
    console.error('Error loading new photo:', err);
    photo.loading = false;
    photo.error = true;
  }
};

const getPhotoUrl = (clubId, photoId, noCache = false) => {
  let url = `${import.meta.env.VITE_API_URL}/clubPhoto/${clubId}/${photoId}`;
  if (noCache) {
    url += `?t=${new Date().getTime()}`;
  }
  return url;
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
    if (currentIndex.value >= photos.value.length) {
      currentIndex.value = photos.value.length - 1;
    }
  } catch (err) {
    handleApiError(err, '刪除照片失敗');
  }
};

const handleImageError = (event, photo) => {
  const img = event.target;
  const retries = parseInt(img.dataset.retries || '0');
  if (retries < 3) {
    setTimeout(() => {
      img.dataset.retries = retries + 1;
      img.src = getPhotoUrl(props.clubId, photo.id, true);
    }, 1000);
  } else {
    photo.error = true;
  }
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

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % photos.value.length;
};

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + photos.value.length) % photos.value.length;
};

const startAutoPlay = () => {
  autoPlayInterval = setInterval(() => {
    nextSlide();
  }, 3000);
};

const stopAutoPlay = () => {
  clearInterval(autoPlayInterval);
};

onMounted(() => {
  fetchPhotos();
  startAutoPlay();
});

onUnmounted(() => {
  stopAutoPlay();
});

</script>

<style scoped>
.carousel-container {
  position: relative;
  width: 250px;
  height: 250px;
  margin: 0 auto;
  overflow: hidden;
}

.carousel-slides {
  width: 100%;
  height: 100%;
}

.carousel-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.carousel-slide img {
  width: 250px;
  height: 250px;
  object-fit: cover;
}

.carousel-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 5px;
  font-size: 0.8em;
}

.carousel-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 1.2em;
}

.carousel-control.left {
  left: 5px;
}

.carousel-control.right {
  right: 5px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

:root {
  --primary-pink: #FFD1DC;
  --secondary-pink: #FFC0CB;
  --primary-purple: #E6E6FA;
  --secondary-purple: #D8BFD8;
  --text-color: #4A4A4A;
  --button-hover: #FFB6C1;
}

/* 全局樣式 */
body {
  background-color: var(--primary-pink);
  color: var(--text-color);
  font-family: 'Arial', sans-serif;
}

.ts-container {
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 20px auto;
  max-width: 800px;
}

/* 標題樣式 */
.ts-header.is-huge {
  color: var(--secondary-purple);
  font-size: 2.5em;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

/* 按鈕樣式 */
.ts-button {
  background-color: var(--primary-purple);
  border: none;
  color: var(--text-color);
  padding: 10px 20px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.ts-button:hover {
  background-color: var(--button-hover);
}

.ts-button.is-primary {
  background-color: var(--secondary-purple);
  color: white;
}

.ts-button.is-negative {
  background-color: #FF69B4;
  color: white;
}

/* 輸入框樣式 */
.ts-input input {
  border: 2px solid var(--secondary-pink);
  border-radius: 5px;
  padding: 8px;
}

/* 輪播圖樣式 */
.carousel-container {
  background-color: var(--primary-purple);
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.carousel-slide img {
  border-radius: 8px;
}

.carousel-caption {
  background-color: rgba(216, 191, 216, 0.7);
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.carousel-control {
  background-color: rgba(255, 192, 203, 0.7);
  color: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
}

/* 錯誤訊息樣式 */
.ts-notice.is-negative {
  background-color: #FFB6C1;
  border-left: 4px solid #FF69B4;
  color: #8B0000;
}

/* 動畫效果 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-enter-active {
  animation: fadeIn 0.5s ease-out;
}

.fade-leave-active {
  animation: fadeIn 0.5s ease-in reverse;
}
</style>