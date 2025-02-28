<template>
  <div class="ts-container">
    <div class="ts-header is-huge is-center-aligned">工作坊相簿</div>
    <div class="ts-space"></div>
    
    <!-- 上傳照片表單，只有創建者可見 -->
    <div v-if="isCreator" class="ts-space">
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

    <!-- 顯示照片 -->
    <div v-if="photos.length > 0">
      <div class="photo-grid">
        <div 
          v-for="(photo, index) in displayPhotos" 
          :key="photo.id" 
          class="photo-item"
          @click="showPhotoModal = true"
        >
          <img 
            :src="getPhotoUrl(workshopId, photo.id)"
            :alt="'工作坊照片'"
            class="photo"
          >
          <!-- 顯示更多圖片提示 -->
          <div v-if="index === 2 && photos.length > 3" class="more-photos">
            <span>+{{ photos.length - 3 }}</span>
          </div>
        </div>
      </div>
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

    <!-- 照片模態框 -->
    <div v-if="showPhotoModal" class="modal-overlay" @click.self="showPhotoModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2 style="color: #e3bdbd;">所有工作坊照片</h2>
          <button @click="showPhotoModal = false" class="modal-close">✕</button>
        </div>
        <div class="photo-grid-modal">
          <div v-for="photo in photos" :key="photo.id" class="photo-item-modal">
            <img 
              :src="getPhotoUrl(workshopId, photo.id)"
              :alt="'工作坊照片'"
              class="photo"
            >
            <div class="photo-caption">
              <p>上傳者: {{ photo.userName }}</p>
              <button 
                v-if="isCreator" 
                @click.stop="deletePhoto(photo.id)" 
                class="ts-button is-negative is-small"
              >
                刪除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from "@/plugins/axios";
import useUserStore from "@/stores/userstore";

const props = defineProps({
  workshopId: {
    type: String,
    required: true
  },
  eventCreatorId: {
    type: [String, Number],
    required: true
  }
});

const userStore = useUserStore();

const photos = ref([]);
const displayPhotos = ref([]);
const selectedFile = ref(null);
const error = ref(null);
const loading = ref(true);
const showPhotoModal = ref(false);

const isCreator = computed(() => {
  return props.eventCreatorId != null && String(userStore.userId) === String(props.eventCreatorId);
});

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0];
};

const uploadPhoto = async () => {
  if (!selectedFile.value || !isCreator.value) return;

  const formData = new FormData();
  formData.append('file', selectedFile.value);
  formData.append('eventId', props.workshopId);
  formData.append('uploaderId', userStore.userId);

  try {
    const response = await axios.post('/eventPhoto/new', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    const newPhoto = {
      ...response.data,
      uploaderId: userStore.userId,
      userName: userStore.nickname,
      url: getPhotoUrl(props.workshopId, response.data.id)
    };
    
    photos.value.unshift(newPhoto);
    updateDisplayPhotos();
    selectedFile.value = null;
  } catch (err) {
    handleApiError(err, '上傳照片失敗');
  }
};

const getPhotoUrl = (workshopId, photoId, noCache = false) => {
  let url = `${import.meta.env.VITE_API_URL}/eventPhoto/${workshopId}/${photoId}`;
  if (noCache) {
    url += `?t=${new Date().getTime()}`;
  }
  return url;
};

const fetchPhotos = async () => {
  try {
    loading.value = true;
    const response = await axios.get(`/eventPhoto/event/${props.workshopId}`);
    if (response.data && Array.isArray(response.data)) {
      photos.value = response.data.map(photo => ({
        ...photo,
        url: getPhotoUrl(props.workshopId, photo.id)
      }));
      updateDisplayPhotos();
    } else {
      error.value = '獲取照片失敗：伺服器回應格式不正確';
    }
  } catch (err) {
    handleApiError(err, '獲取照片失敗');
  } finally {
    loading.value = false;
  }
};

const updateDisplayPhotos = () => {
  displayPhotos.value = photos.value.slice(0, 3);
};

const deletePhoto = async (photoId) => {
  if (!isCreator.value) return;

  // 使用 window.confirm 進行刪除確認
  const confirmed = window.confirm("您確定要刪除這張照片嗎？");
  if (!confirmed) return; // 如果用戶選擇取消，則不進行刪除操作
  
  try {
    await axios.delete(`/eventPhoto/delete/${photoId}`, {
      params: { uploaderId: userStore.userId }
    });
    photos.value = photos.value.filter(photo => photo.id !== photoId);
    updateDisplayPhotos();
  } catch (err) {
    handleApiError(err, '刪除照片失敗');
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

onMounted(() => {
  fetchPhotos();
});

</script>

<style scoped>
.photo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.photo-item {
  position: relative;
  width: 100%;
  padding-top: 100%;
  overflow: hidden;
  background-color: #f3f3f3;
}

.photo {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.more-photos {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 24px;
  border-radius: 8px;
}

/* 模態框樣式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 80%;
  max-height: 80%;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
}

.modal-close {
  background-color: transparent;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
}

.photo-grid-modal {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.photo-item-modal {
  position: relative;
  width: 100%;
  padding-top: 100%;
  overflow: hidden;
}

.photo-item-modal img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 5px;
  font-size: 0.8em;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 按鈕樣式沿用原有的設計 */
</style>