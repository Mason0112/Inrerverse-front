<template>
  <div class="ts-container is-fluid">
    <div class="ts-space is-large"></div>
    <div class="ts-container">
      <div class="ts-header is-huge is-center-aligned">我創建的俱樂部</div>
      <div class="ts-space"></div>
      <div class="ts-grid">
        <div class="column is-1-wide"></div>
        <div class="column is-14-wide">
          <div class="ts-space"></div>
          <div class="ts-flex is-justified-between is-aligned-center">
            <div></div>
            <router-link 
              :to="{ name: 'club-form-link' }"
              class="ts-button is-pink"
              style="margin: 0px 0px 10px 0px ;"
            >
              新增俱樂部
            </router-link>
          </div>
          <div class="ts-space"></div>
          <div v-if="loading" class="ts-loader is-large"></div>
          <div v-else-if="error" class="ts-box is-negative">
            <div class="ts-content">
              <strong>錯誤：</strong>{{ error }}
            </div>
          </div>
          <table v-else class="ts-table">
            <thead>
              <tr>
                <th class="is-center-aligned">照片</th>
                <th class="is-center-aligned">活動名稱</th>
                <th class="is-center-aligned">公開</th>
                <th class="is-center-aligned">編輯</th>
                <th class="is-center-aligned">審核</th>
                <th class="is-center-aligned">成員列表</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="club in clubs" :key="club.id">
                <td class="is-center-aligned">
                  <router-link 
                    :to="{ name: 'club-detail-link', params: { id: club.id } }"
                    class="club-photo-link"
                  >
                    <div class="ts-image is-rounded">
                      <img 
                        v-if="club.photo" 
                        :src="getPhotoUrl(club.photo)" 
                        :alt="club.clubName" 
                      >
                      <div v-else class="ts-icon is-photo-icon"></div>
                    </div>
                  </router-link>
                </td>
                <td class="is-center-aligned">
                  {{ club.clubName }}
                </td>
                <td class="is-center-aligned">{{ club.isPublic === 1 ? '是' : '否' }}</td>
                <td class="is-center-aligned">
                  <router-link 
                    :to="{ name: 'club-edit-link', params: { id: club.id } }"
                    class="ts-button is-mini is-pink"
                  >
                    編輯
                  </router-link>
                </td>
                <td class="is-center-aligned">
                  <router-link 
                    :to="{ name: 'club-approve2-link', params: { id: club.id } }" 
                    class="ts-button is-mini is-pink"
                  >
                    管理成員
                  </router-link>
                </td>
                <td class="is-center-aligned">
                  <button
                    @click="handleShowMembers(club.id, club.clubName)"
                    class="ts-button is-mini is-pink"
                  >
                    查看成員
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="column is-1-wide"></div>
      </div>
    </div>

    <!-- 成員列表模態框 -->
    <div v-if="showModal" class="ts-modal is-visible">
      <div class="ts-box">
        <div class="ts-content">
          <h3 class="ts-header">{{ selectedClubName }} 成員列表</h3>
          <ClubMembersList
            :key="selectedClubId"
            :clubId="selectedClubId"
            @close="handleCloseMembersList"
          />
        </div>
        <div class="ts-actions">
          <button class="ts-button is-secondary" @click="handleCloseMembersList">關閉</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from "@/plugins/axios";
import useUserStore from "@/stores/userstore";
import ClubMembersList from '@/views/club/ClubMembersList.vue';

const clubs = ref([]);
const loading = ref(true);
const error = ref(null);
const selectedClubId = ref(null);
const selectedClubName = ref('');
const showModal = ref(false);
const userStore = useUserStore();

const fetchMyClubs = async () => {
  try {
    const response = await axios.get(`/clubs/my-clubs?userId=${userStore.userId}`);
    clubs.value = response.data;
    loading.value = false;
  } catch (err) {
    console.error('Error fetching my clubs:', err);
    error.value = err.message;
    loading.value = false;
  }
};

const getPhotoUrl = (photoName) => {
  if (!photoName) return null;
  return `${import.meta.env.VITE_API_URL}/clubs/photo/${photoName}`;
};

const handleShowMembers = (clubId, clubName) => {
  selectedClubId.value = clubId;
  selectedClubName.value = clubName;
  showModal.value = true;
};

const handleCloseMembersList = () => {
  showModal.value = false;
  selectedClubId.value = null;
  selectedClubName.value = '';
};

onMounted(fetchMyClubs);
</script>

<style scoped>
/* 自定义粉藕色样式 */
:deep(.ts-button.is-pink) {
  background-color: #e3bdbd;
  color: white;
}

:deep(.ts-button.is-pink:hover) {
  background-color: #d3a9a9;
}

:deep(.ts-table) {
  border-color: #e3bdbd;
}

:deep(.ts-table thead) {
  background-color: #f5e0e0;
}

:deep(.ts-table tbody tr:hover) {
  background-color: #faf0f0;
}

:deep(.ts-table th),
:deep(.ts-table td) {
  text-align: center;
  vertical-align: middle;
}

:deep(.ts-image.is-rounded) {
  width: 100px;
  height: 100px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

:deep(.ts-image.is-rounded img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

:deep(.ts-icon.is-photo-icon) {
  width: 100px;
  height: 100px;
  background-color: #f5e0e0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: #c48888;
}

:deep(.ts-icon.is-photo-icon::before) {
  content: "📷";
}

.club-photo-link {
  display: inline-block;
  cursor: pointer;
}

.club-photo-link:hover :deep(.ts-image.is-rounded) {
  transform: scale(1.1);
}
</style>