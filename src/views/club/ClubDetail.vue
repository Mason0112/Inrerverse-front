<template>
  <div class="container">
    <h1>俱樂部詳情</h1>

    <!-- 標籤導航 -->
    <ul class="nav nav-tabs" id="clubDetailTabs" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="club-info-tab" data-bs-toggle="tab" data-bs-target="#club-info" type="button" role="tab" aria-controls="club-info" aria-selected="true">俱樂部詳情</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="club-activity-tab" data-bs-toggle="tab" data-bs-target="#club-activity" type="button" role="tab" aria-controls="club-activity" aria-selected="false">俱樂部活動</button>
      </li>
    </ul>
    <div style="height: 25px;"></div>

    <div class="tab-content" id="clubDetailTabContent">
      <!-- 第一個標籤：俱樂部照片、詳情、成員、相簿 -->
      <div class="tab-pane fade show active" id="club-info" role="tabpanel" aria-labelledby="club-info-tab">
        <div v-if="loading" class="loading">加載中...</div>
        <div v-else-if="error" class="error-message">{{ error }}</div>
        <div v-else-if="club" class="club-detail-layout">
          <!-- 左側：俱樂部照片與成員 -->
          <div class="club-left-section">
            <div v-if="club.photo" class="club-photo-container">
              <img :src="getPhotoUrl(club.photo)" alt="俱樂部照片" class="club-photo">
            </div>
          </div>

          <!-- 右側：俱樂部詳情與相簿 -->
          <div class="club-right-section">
            <h2 class="club-name">{{ club.clubName }}</h2>
            <p class="club-info"><strong>描述：</strong> {{ club.description }}</p>
            <p class="club-info"><strong>公開：</strong> {{ club.isPublic ? '是' : '否' }}</p>
            <p class="club-info"><strong>創建者：</strong> {{ club.userName }}</p>

            <p v-if="isMember" class="member-status">歡迎來到俱樂部</p>
            <p v-else-if="isPending" class="member-status pending">您的申請正在審核中</p>

            <ClubPhotoAlbum v-if="club" :clubId="clubId" :isMember="isMember" />
          </div>
        </div>
        <ClubMembersList :clubId="clubId" />
      </div>

      <!-- 第二個標籤：俱樂部活動 -->
      <div class="tab-pane fade" id="club-activity" role="tabpanel" aria-labelledby="club-activity-tab">
        <ClubEvent :clubId="clubId" :isMember="isMember" @event-added="handleEventAdded" />

        <!-- 添加活動按鈕，只有成員可以看到 -->
        <div v-if="isMember" class="mt-4">
          <button @click="openModal" class="styled-button">
            辦活動!
          </button>
        </div>

        <!-- 使用 teleport 將彈跳式視窗傳送到 body 元素中 -->
        <teleport to="body">
          <div v-if="showModal" class="modal-overlay" @click="closeModal">
            <div class="modal-content" @click.stop>
              <button @click="closeModal" class="close-button">&times;</button>
              <AddClubEventForm :clubId="clubId" @eventAdded="onEventAdded" />
            </div>
          </div>
        </teleport>
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
import AddClubEventForm from '../Event/AddClubEventForm.vue';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const club = ref(null);
const loading = ref(true);
const error = ref(null);
const errorMessage = ref('');
const successMessage = ref('');
const isMember = ref(false);
const isPending = ref(false);

const clubId = route.params.id;

// 用於控制彈跳式視窗顯示/隱藏的布爾值
const showModal = ref(false);

// 打開彈跳式視窗
const openModal = () => {
  showModal.value = true;
};

// 關閉彈跳式視窗
const closeModal = () => {
  showModal.value = false;
};

// 處理活動添加後的邏輯
const handleEventAdded = (newEvent) => {
  // 在這裡可以添加更新活動列表的邏輯
};

const getPhotoUrl = (photoName) => {
  if (!photoName) return null;
  return `${import.meta.env.VITE_API_URL}/clubs/photo/${photoName}`;
};

const fetchClubDetails = async () => {
  try {
    const response = await axios.get(`/clubs/${clubId}`);
    club.value = response.data;

    // 確認當前用戶是否為俱樂部成員
    const memberResponse = await axios.get(`/clubMember/club/${clubId}/approved-members`);
    isMember.value = memberResponse.data.some(member => member.userId === userStore.userId);

    // 檢查是否有待審核的申請
    const pendingResponse = await axios.get(`/clubMember/club/${clubId}/pending-members`);
    isPending.value = pendingResponse.data.some(member => member.userId === userStore.userId);

    loading.value = false;
  } catch (err) {
    console.error('Error fetching club details:', err);
    error.value = '獲取俱樂部詳情時出錯';
    loading.value = false;
  }
};

const onEventAdded = (newEvent) => {
  console.log("New event added:", newEvent);
  closeModal(); // 關閉彈跳式視窗
  handleEventAdded(newEvent); // 更新活動列表
};

onMounted(() => {
  console.log("isMember:", isMember.value);
  fetchClubDetails();
});
</script>

<style scoped>
/* 主題顏色 */
:root {
  --primary-pink: #FFD1DC;
  --secondary-pink: #FFC0CB;
  --primary-purple: #E6E6FA;
  --secondary-purple: #D8BFD8;
  --text-color: #4A4A4A;
}

/* 標題樣式 */
h1 {
  color: var(--secondary-purple);
  font-size: 2rem;
  text-align: center;
  margin-bottom: 1.5rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

/* 布局樣式 */
.club-detail-layout {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

/* 左側：俱樂部照片與成員 */
.club-left-section {
  width: 45%;
  padding-right: 1rem;
  box-sizing: border-box;
}

.club-photo-container {
  width: 100%;
  height: auto;
  margin-bottom: 1.5rem;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.club-photo {
  width: 100%;
  height: auto;
  object-fit: cover;
}

/* 右側：俱樂部詳情與相簿 */
.club-right-section {
  width: 50%;
  box-sizing: border-box;
  padding-left: 1rem;
}

.club-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--secondary-purple);
  margin-bottom: 1rem;
}

.club-info {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.club-info strong {
  color: var(--secondary-purple);
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

/* 新增活動按鈕樣式 */
.styled-button {
  color: white;
  font-size: 16px;
  font-weight: bold;
  padding: 12px 24px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #e387c4;
}

.styled-button:hover {
  background: linear-gradient(90deg, #e143a1, #e387c4);
  transform: translateY(-2px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
}

.styled-button:active {
  background: linear-gradient(90deg, #a84aa4, #ea9de1);
  transform: translateY(0);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 彈跳式視窗樣式 */
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
  position: relative;
  width: 80%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
  background: none;
  border: none;
  color: #888;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .club-detail-layout {
    flex-direction: column;
  }

  .club-left-section, .club-right-section {
    width: 100%;
    padding: 0;
  }

  .club-right-section {
    margin-top: 1.5rem;
  }

  .modal-content {
    width: 95%;
  }
}
</style>