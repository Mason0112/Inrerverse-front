<template>
  <div class="ts-container is-fluid">
    <div class="ts-space is-large"></div>
    <div class="ts-container">
      <h1>我創建的俱樂部</h1>
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
                <th class="is-center-aligned">刪除俱樂部</th>
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
                    審核
                  </router-link>
                </td>
                <td class="is-center-aligned">
                  <button
                    @click="handleDeleteClub(club.id, club.clubName)"
                    class="ts-button is-mini is-negative" style="background-color: pink;"
                  >
                    刪除俱樂部
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
import Swal from 'sweetalert2';

const clubs = ref([]);
const loading = ref(true);
const error = ref(null);
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

const handleDeleteClub = (clubId, clubName) => {
  Swal.fire({
    title: '確認刪除',
    text: `您確定真的要刪除俱樂部 "${clubName}" 嗎？`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: '確定刪除',
    cancelButtonText: '取消'
  }).then((result) => {
    if (result.isConfirmed) {
      confirmDelete(clubId);
    }
  });
};

const confirmDelete = async (clubId) => {
  try {
    await axios.delete(`/clubs/${clubId}`);
    clubs.value = clubs.value.filter(club => club.id !== clubId);
    Swal.fire(
      '刪除成功',
      '俱樂部已被刪除。',
      'success'
    );
  } catch (err) {
    console.error('Error deleting club:', err);
    Swal.fire(
      '刪除失敗',
      '刪除俱樂部時發生錯誤。',
      'error'
    );
  }
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

h1 {
  color: var(--accent-color);
  margin-bottom: 25px;
  font-weight: 700;
  font-size: 2.2rem;
  text-align: center;
}
</style>