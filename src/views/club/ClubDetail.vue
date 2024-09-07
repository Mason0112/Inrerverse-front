<template>
  <div class="container">
    <h1>俱樂部詳情</h1>
    <div v-if="loading" class="loading">加載中...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="club" class="club-detail-card">
      <div v-if="club.photo" class="club-photo-container">
        <img :src="getPhotoUrl(club.photo)" alt="俱樂部照片" class="club-photo">
      </div>
      <h2 class="club-name">{{ club.clubName }}</h2>
      <p class="club-info"><strong>描述：</strong> {{ club.description }}</p>
      <p class="club-info"><strong>公開：</strong> {{ club.isPublic ? '是' : '否' }}</p>
      <p class="club-info"><strong>創建者：</strong> {{ club.userName }}</p>

      <!-- 加入俱樂部按鈕 -->
      <button v-if="!isMember && !isPending && !isCreator" @click="joinClub" class="button join-button">
        {{ club.isPublic ? '加入俱樂部' : '申請加入' }}
      </button>
      <p v-else-if="isMember" class="member-status">您已是該俱樂部成員</p>
      <p v-else-if="isPending" class="member-status pending">您的申請正在審核中</p>

      <div v-if="errorMessage" class="error-message">
        <strong>錯誤：</strong>
        <span>{{ errorMessage }}</span>
      </div>
      <div v-if="successMessage" class="success-message">
        <strong>成功：</strong>
        <span>{{ successMessage }}</span>
      </div>

      <ClubPhotoAlbum v-if="club" :clubId="clubId" :isMember="isMember" />

      <!-- 新增活動按鈕和可折疊表單 -->
      <div class="event-form-container">
        <button @click="toggleEventForm" class="button event-button">
          {{ showEventForm ? '收起表單' : '新增活動' }}
        </button>
        <transition name="slide-fade">
          <div v-if="showEventForm" class="event-form">
            <ClubEvent :clubId="clubId" :isMember="isMember" @event-added="handleEventAdded" />
          </div>
        </transition>
      </div>

      <!-- 活動列表 -->
      <div class="event-list">
        <!-- 這裡可以添加活動列表的展示邏輯 -->
      </div>

      <div class="mt-8">
        <ClubMembersList :clubId="clubId" />
      </div>
      
      <div class="button-group">
        <router-link v-if="isCreator" :to="{ name: 'club-edit-link', params: { id: club.id } }"
          class="button button-blue">
          編輯俱樂部
        </router-link>
        <button v-if="isCreator" @click="confirmDelete" class="button button-red">
          刪除俱樂部
        </button>
        <router-link :to="{ name: 'club-all-link' }" class="button button-gray">
          返回列表
        </router-link>
      </div>
    </div>

    <!-- 確認刪除的對話框 -->
    <div v-if="showDeleteConfirm" class="delete-confirm-overlay">
      <div class="delete-confirm-dialog">
        <h3>確認刪除</h3>
        <p>您確定要刪除這個俱樂部嗎？此操作不可撤銷。</p>
        <div class="button-group">
          <button @click="deleteClub" class="button button-red">
            確認刪除
          </button>
          <button @click="showDeleteConfirm = false" class="button button-gray">
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from "@/plugins/axios";
import useUserStore from "@/stores/userstore";
import ClubMembersList from '@/views/club/ClubMembersList.vue';
import ClubPhotoAlbum from './ClubPhotoAlbum.vue';
import ClubEvent from '../Event/ClubEvent.vue';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const club = ref(null);
const loading = ref(true);
const error = ref(null);
const errorMessage = ref('');
const successMessage = ref('');
const showDeleteConfirm = ref(false);
const isMember = ref(false);
const isPending = ref(false);
const showEventForm = ref(false);

const clubId = route.params.id;

const isCreator = computed(() => {
  return club.value && Number(club.value.clubCreator) === Number(userStore.userId);
});

const getPhotoUrl = (photoName) => {
  if (!photoName) return null;
  return `${import.meta.env.VITE_API_URL}/clubs/photo/${photoName}`;
};

const fetchClubDetails = async () => {
  try {
    const response = await axios.get(`/clubs/${clubId}`);
    club.value = response.data;
    await checkMembership();
    loading.value = false;
  } catch (err) {
    console.error('Error fetching club details:', err);
    error.value = '獲取俱樂部詳情時出錯';
    loading.value = false;
  }
};

const confirmDelete = () => {
  showDeleteConfirm.value = true;
};

const deleteClub = async () => {
  try {
    await axios.delete(`/clubs/${clubId}`);
    successMessage.value = '俱樂部已成功刪除';
    setTimeout(() => {
      router.push({ name: 'club-all-link' });
    }, 2000);
  } catch (err) {
    console.error('Error deleting club:', err);
    errorMessage.value = '刪除俱樂部時出錯';
    showDeleteConfirm.value = false;
  }
};

const checkMembership = async () => {
  try {
    const approvedResponse = await axios.get(`/clubMember/club/${clubId}/approved-members`);
    const pendingResponse = await axios.get(`/clubMember/club/${clubId}/pending-members`);
    
    if (approvedResponse.status === 200) {
      isMember.value = approvedResponse.data.some(member => member.userId === userStore.userId);
    }
    
    if (pendingResponse.status === 200) {
      isPending.value = pendingResponse.data.some(member => member.userId === userStore.userId);
    }

    if (!isMember.value && !isPending.value) {
      isMember.value = false;
      isPending.value = false;
    }
  } catch (err) {
    console.error('Error checking membership:', err);
    errorMessage.value = '檢查會員資格時出錯';
    isMember.value = false;
    isPending.value = false;
  }
};

const joinClub = async () => {
  const clubMemberDTO = {
    clubId: clubId,
    userId: userStore.userId,
    status: club.value.isPublic ? 1 : 0
  };
  try {
    const response = await axios.post('/clubMember', clubMemberDTO);
    if (response.status === 200 || response.status === 201) {
      if (club.value.isPublic) {
        successMessage.value = '已成功加入俱樂部！';
        isMember.value = true;
      } else {
        successMessage.value = '已成功提交申請！等待審核中。';
        isPending.value = true;
      }
    } else {
      throw new Error('未預期的響應狀態：' + response.status);
    }
  } catch (error) {
    console.error('Error joining club:', error);
    if (error.response) {
      if (error.response.status === 400) {
        errorMessage.value = '無法加入俱樂部：請求無效。可能您已經是成員或已申請加入。';
      } else if (error.response.status === 403) {
        errorMessage.value = '無法加入俱樂部：您沒有權限執行此操作。';
      } else if (error.response.status === 500) {
        errorMessage.value = '無法加入俱樂部：服務器內部錯誤。請稍後再試。';
      } else {
        errorMessage.value = `無法加入俱樂部：${error.response.data.message || '未知錯誤'}`;
      }
    } else if (error.request) {
      errorMessage.value = '無法加入俱樂部：未收到服務器響應。請檢查您的網絡連接。';
    } else {
      errorMessage.value = '無法加入俱樂部：' + error.message;
    }
  }
};

const toggleEventForm = () => {
  showEventForm.value = !showEventForm.value;
};

const handleEventAdded = () => {
  showEventForm.value = false;
  successMessage.value = '活動新增成功！';
  // 這裡可以添加重新獲取活動列表的邏輯
};

onMounted(fetchClubDetails);
</script>

<style scoped>
/* 主題顏色 */
:root {
  --primary-pink: #FFD1DC;
  --secondary-pink: #FFC0CB;
  --primary-purple: #E6E6FA;
  --secondary-purple: #D8BFD8;
  --text-color: #4A4A4A;
  --button-blue: #87CEFA;
  --button-blue-hover: #5F9EA0;
  --button-red: #FFB6C1;
  --button-red-hover: #FF69B4;
  --button-gray: #D3D3D3;
  --button-gray-hover: #A9A9A9;
}

/* 全局樣式 */
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: var(--primary-pink);
  color: var(--text-color);
  font-family: 'Arial', sans-serif;
}

/* 標題樣式 */
h1 {
  color: var(--secondary-purple);
  font-size: 2rem;
  text-align: center;
  margin-bottom: 1.5rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

/* 俱樂部詳情卡片 */
.club-detail-card {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
}

/* 俱樂部照片 */
.club-photo-container {
  width: 200px;
  height: 200px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.club-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 俱樂部名稱 */
.club-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--secondary-purple);
  margin-bottom: 1rem;
}

/* 俱樂部信息 */
.club-info {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.club-info strong {
  color: var(--secondary-purple);
}

/* 按鈕樣式 */
.button {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 30px;
  font-weight: bold;
  text-decoration: none;
  transition: all 0.3s ease;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.join-button {
  display: block;
  width: 100%;
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  text-align: center;
  color: #ffffff;
  background-color: #ff69b4;
  border-radius: 30px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(255, 105, 180, 0.3);
}

.join-button:hover {
  background-color: #ff1493;
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(255, 105, 180, 0.5);
}

.button-blue {
  background-color: var(--button-blue);
  color: pink;
}

.button-blue:hover {
  background-color: var(--button-blue-hover);
}

.button-red {
  background-color: var(--button-red);
  color: pink;
}

.button-red:hover {
  background-color: var(--button-red-hover);
}

.button-gray {
  background-color: var(--button-gray);
  color: var(--text-color);
}

.button-gray:hover {
  background-color: var(--button-gray-hover);
}

/* 成員狀態 */
.member-status {
  text-align: center;
  color: var(--secondary-purple);
  font-weight: bold;
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: #e6e6fa;
  border-radius: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 消息樣式 */
.success-message, .error-message {
  padding: 1rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.success-message {
  background-color: #E0FFF0;
  border: 1px solid #98FB98;
  color: #228B22;
}

.error-message {
  background-color: #FFF0F5;
  border: 1px solid #FFC0CB;
  color: #FF69B4;
}

/* 刪除確認對話框 */
.delete-confirm-overlay {
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

.delete-confirm-dialog {
  background-color: white;
  border-radius: 1rem;
  padding: 2rem;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 新增活動表單樣式 */
.event-form-container {
  margin-top: 2rem;
}

.event-button {
  width: 100%;
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  font-weight: bold;
  text-align: center;
  color: #ffffff;
  background-color: #4CAF50;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(76, 175, 80, 0.3);
}

.event-button:hover {
  background-color: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(76, 175, 80, 0.5);
}

.event-form {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 過渡動畫 */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

/* 響應式設計 */
@media (max-width: 640px) {
  .container {
    padding: 1rem;
  }

  .club-photo-container {
    width: 150px;
    height: 150px;
  }

  .button {
    display: block;
    width: 100%;
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
}
</style>