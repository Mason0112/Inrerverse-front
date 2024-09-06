<template>
  <div class="ts-container is-fluid">
    <div class="ts-space is-large"></div>
    <div class="ts-container">
      <div class="ts-header is-huge is-center-aligned">我加入的俱樂部</div>
      <div class="ts-space"></div>
      <div class="ts-grid">
        <div class="column is-1-wide"></div>
        <div class="column is-14-wide">
          <div v-if="loading" class="ts-loader is-large"></div>
          <div v-else-if="error" class="ts-box is-negative">
            <div class="ts-content">
              <strong>錯誤：</strong>{{ error }}
            </div>
          </div>
          <div v-else-if="clubs.length === 0" class="ts-header is-center-aligned">
            您還沒有加入任何俱樂部。
          </div>
          <table v-else class="ts-table">
            <thead>
              <tr>
                <th class="is-center-aligned">照片</th>
                <th class="is-center-aligned">社團名稱</th>
                <th class="is-center-aligned">公開</th>
                <th class="is-center-aligned">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="club in clubs" :key="club.id">
                <td class="is-center-aligned">
                  <router-link :to="{ name: 'club-detail-link', params: { id: club.id } }">
                    <div class="ts-image is-rounded club-photo">
                      <img 
                        v-if="club.photo && getPhotoUrl(club.photo)"
                        :src="getPhotoUrl(club.photo)"
                        :alt="club.clubName"
                        @error="handleImageError"
                      >
                      <div v-else class="ts-icon is-photo-icon"></div>
                    </div>
                  </router-link>
                </td>
                <td class="is-center-aligned">
                  <span class="club-name">{{ club.clubName }}</span>
                </td>
                <td class="is-center-aligned">{{ club.isPublic === 1 ? '是' : '否' }}</td>
                <td class="is-center-aligned">
                  <button
                    @click="quitClub(club.id)"
                    class="ts-button is-negative is-mini"
                  >
                    退出社團
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="column is-1-wide"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from "@/plugins/axios";
import useUserStore from "@/stores/userstore";

const clubs = ref([]);
const loading = ref(true);
const error = ref(null);
const userStore = useUserStore();

const fetchMyClubs = async () => {
  try {
    const response = await axios.get(`/clubMember/user/${userStore.userId}/clubs`);
    clubs.value = response.data;
    loading.value = false;
  } catch (err) {
    console.error('Error fetching my clubs:', err);
    error.value = err.response?.data?.message || '獲取俱樂部列表時出錯';
    loading.value = false;
  }
};

const getPhotoUrl = (photoName) => {
  if (!photoName) return null;
  return `${import.meta.env.VITE_API_URL}/clubs/photo/${photoName}`;
};

const handleImageError = (event) => {
  event.target.style.display = 'none';
  event.target.nextElementSibling.style.display = 'flex';
};

const quitClub = async (clubId) => {
  if (!confirm('確定要退出這個社團嗎？')) {
    return;
  }
  try {
    await axios.delete(`/clubMember/user/${userStore.userId}/delete/${clubId}`);
    alert('您已成功退出社團');
    clubs.value = clubs.value.filter(club => club.id !== clubId);
  } catch (err) {
    console.error('Error quitting club:', err);
    alert(err.response?.data?.message || '退出社團時出錯，請稍後再試');
  }
};

onMounted(fetchMyClubs);
</script>

<style scoped>
/* 自定义粉藕色样式 */
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

.club-name {
  color: #e3bdbd;
  font-weight: bold;
}

:deep(.ts-button.is-negative) {
  background-color: #e3bdbd;
  color: white;
}

:deep(.ts-button.is-negative:hover) {
  background-color: #d3a9a9;
}

:deep(.ts-image.is-rounded) {
  width: 64px;
  height: 64px;
  overflow: hidden;
  cursor: pointer;
  margin: 0 auto;
}

:deep(.ts-image.is-rounded img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

:deep(.ts-icon.is-photo-icon) {
  width: 64px;
  height: 64px;
  background-color: #f5e0e0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: #c48888;
  margin: 0 auto;
}

:deep(.ts-icon.is-photo-icon::before) {
  content: "📷";
}

.club-photo {
  transition: transform 0.3s ease;
}

.club-photo:hover {
  transform: scale(1.1);
}
</style>