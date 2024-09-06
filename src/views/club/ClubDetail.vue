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
      <button v-if="!isMember && !isCreator" @click="joinClub" class="button join-button">
        {{ club.isPublic ? '加入俱樂部' : '申請加入' }}
      </button>
      <p v-else-if="isMember" class="member-status">您已是該俱樂部成員</p>
      <div v-if="errorMessage" class="error-message">
        <!-- 成功消息 -->
        <div v-if="successMessage" class="message success-message">
          <strong>成功：</strong>
          <span>{{ successMessage }}</span>
        </div>

        <!-- 錯誤消息 -->
        <div v-if="errorMessage" class="message error-message">
          <strong>錯誤：</strong>
          <span>{{ errorMessage }}</span>
        </div>
      </div>
      <ClubPhotoAlbum v-if="club" :clubId="clubId" :isMember="isMember" />
      <ClubEvent :clubId="clubId" :isMember="isMember" />

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
    const response = await axios.get(`/clubMember/club/${clubId}/approved-members`);
    if (response.status === 200) {
      isMember.value = response.data.some(member => member.userId === userStore.userId);
    } else {
      isMember.value = false;
    }
  } catch (err) {
    console.error('Error checking membership:', err);
    errorMessage.value = '檢查會員資格時出錯';
    isMember.value = false;
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
      }
    } else {
      throw new Error('未預期的響應狀態：' + response.status);
    }
  } catch (error) {
    console.error('Error joining club:', error);
    if (error.response) {
      // 服务器响应了，但状态码不在 2xx 范围内
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
      // 请求已经发出，但没有收到响应
      errorMessage.value = '無法加入俱樂部：未收到服務器響應。請檢查您的網絡連接。';
    } else {
      // 在设置请求时发生了一些事情，触发了错误
      errorMessage.value = '無法加入俱樂部：' + error.message;
    }
  }
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

/* 更新加入按钮样式 */
.join-button {
  display: block;
  width: 100%;
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  font-weight: bold;
  text-align: center;
  color: #ffffff;
  background-color: #ff69b4;
  /* 粉红色 */
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(255, 105, 180, 0.3);
}

.join-button:hover {
  background-color: #ff1493;
  /* 深粉红色 */
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(255, 105, 180, 0.5);
}

.join-button:active {
  transform: translateY(1px);
  box-shadow: 0 2px 4px rgba(255, 105, 180, 0.5);
}

.member-status {
  text-align: center;
  color: #8a2be2;
  /* 紫罗兰色 */
  font-weight: bold;
  font-size: 1.1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: #e6e6fa;
  /* 淡紫色背景 */
  border-radius: 30px;
  box-shadow: 0 2px 4px rgba(138, 43, 226, 0.2);
}

/* 如果需要，可以调整其他按钮的样式以保持一致性 */
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

.button-blue {
  background-color: #1e90ff;
  /* 道奇蓝 */
  color: white;
}

.button-blue:hover {
  background-color: #4169e1;
  /* 皇家蓝 */
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(30, 144, 255, 0.3);
}

.button-red {
  background-color: #ff6347;
  /* 番茄红 */
  color: white;
}

.button-red:hover {
  background-color: #dc143c;
  /* 猩红 */
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(255, 99, 71, 0.3);
}

.button-gray {
  background-color: #a9a9a9;
  /* 深灰色 */
  color: white;
}

.button-gray:hover {
  background-color: #808080;
  /* 灰色 */
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(169, 169, 169, 0.3);
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
}

.delete-confirm-dialog {
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  max-width: 400px;
  text-align: center;
}

/* 成功和錯誤消息 */
.message {
  padding: 1rem;
  border-radius: 0.25rem;
  margin-top: 1rem;
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

/* 響應式設計 */
@media (max-width: 640px) {
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

.loading {
  text-align: center;
  font-size: 1.2rem;
  color: var(--secondary-purple);
  margin-top: 2rem;
}

.button-group {
  margin-top: 1rem;
}

.join-button {
  display: block;
  width: 100%;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.member-status {
  text-align: center;
  color: var(--secondary-purple);
  font-weight: bold;
  margin-top: 1rem;
  margin-bottom: 1rem;
}
</style>