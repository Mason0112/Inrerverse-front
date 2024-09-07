<template>
  <div class="ts-container">
    <div class="ts-space"></div>
    <div class="custom-container">
      <div class="ts-content">
        <div class="ts-header is-huge is-center-aligned">工作坊活動列表</div>
        <div class="ts-space"></div>
        <div class="ts-grid">
          <div class="column is-14-wide is-centered">
            <div class="ts-space"></div>
            <div class="ts-row is-end-aligned">
              <router-link 
                :to="{ name: 'event-addWorkshop-link' }" 
                class="ts-button custom-button"
                style="margin: 0px 0px 10px 0px ;"
              >
                新增工作坊
              </router-link>
            </div>
            <div class="ts-space"></div>
            
            <!-- 搜索和排序控件 -->
            <div class="search-sort-container">
              <div class="ts-input is-end-icon custom-input search-input">
                <input 
                  v-model="searchQuery" 
                  type="text"
                  placeholder="搜索工作坊..."
                  @input="filterEvents"
                >
                <i class="search icon"></i>
              </div>
              <div class="ts-select custom-select sort-select">
                <select 
                  v-model="sortOption" 
                  @change="sortEvents"
                >
                  <option value="dateDesc">日期 (新到舊)</option>
                  <option value="dateAsc">日期 (舊到新)</option>
                  <option value="nameAsc">名稱 (A-Z)</option>
                  <option value="nameDesc">名稱 (Z-A)</option>
                </select>
              </div>
            </div>
            
            <div class="ts-space"></div>

            <!-- 工作坊列表 -->
            <div v-if="loading" class="ts-center">
              <n-spin size="large" />
            </div>
            <div v-else-if="filteredEvents.length === 0" class="ts-center">
              沒有找到工作坊活動
            </div>
            <div v-else>
              <div 
                v-for="event in filteredEvents" 
                :key="event.id" 
                class="custom-event-box"
              >
                <div class="ts-content">
                  <div class="ts-row">
                    <div class="column is-4-wide">
                      <div class="event-cover-container" @click="goToEventDetail(event.id)">
                        <img 
                          v-if="event.coverPhotoUrl"
                          :src="event.coverPhotoUrl" 
                          :alt="event.eventName"
                          class="event-cover-photo"
                        >
                        <div v-else class="no-photo">無照片</div>
                      </div>
                    </div>
                    <div class="column is-6-wide">
                      <div class="ts-header" @click="goToEventDetail(event.id)">{{ event.eventName }}</div>
                      <div class="ts-text is-secondary">
                        <p>創建者: {{ event.creatorName }}</p>
                        <p>開始時間: {{ formatDate(event.startTime) }}</p>
                      </div>
                    </div>
                    <div class="column is-4-wide is-right-aligned">
                      <div v-if="canUserEdit(event)" class="action-buttons">
                        <n-button size="small" @click.stop="editEvent(event)" class="custom-button">編輯</n-button>
                        <n-button size="small" @click.stop="confirmDelete(event)" type="error">刪除</n-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 編輯模態框 -->
    <n-modal v-model:show="showEditModal">
      <n-card
        style="width: 600px"
        title="編輯工作坊"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <n-form>
          <n-form-item label="活動名稱">
            <n-input v-model:value="editingEvent.eventName" placeholder="活動名稱" />
          </n-form-item>
          <n-form-item label="活動詳情">
            <n-input
              v-model:value="editingEvent.description"
              type="textarea"
              placeholder="活動詳情"
            />
          </n-form-item>
        </n-form>
        
        <template #footer>
          <n-button @click="updateEvent" type="primary">保存</n-button>
          <n-button @click="showEditModal = false">取消</n-button>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/plugins/axios';
import useUserStore from "@/stores/userstore";
import { useRouter } from 'vue-router';
import { useDialog, useMessage } from 'naive-ui';
import { NButton, NModal, NCard, NForm, NFormItem, NInput, NSpin } from 'naive-ui';

const router = useRouter();
const userStore = useUserStore();
const dialog = useDialog();
const message = useMessage();

const events = ref([]);
const filteredEvents = ref([]);
const searchQuery = ref('');
const sortOption = ref('dateDesc');
const loading = ref(true);
const showEditModal = ref(false);
const editingEvent = ref({});

const fetchEvents = async () => {
  try {
    const response = await axios.get('/events');
    const workshopEvents = response.data.filter(event => event.source === 2);
    
    // 获取每个事件的 EventDetail 和照片
    const eventsWithDetails = await Promise.all(workshopEvents.map(async (event) => {
      try {
        const [detailResponse, photosResponse] = await Promise.all([
          axios.get(`/eventDetail/${event.id}/show`),
          axios.get(`/eventPhoto/event/${event.id}`)
        ]);
        const firstPhoto = photosResponse.data && photosResponse.data.length > 0 ? photosResponse.data[0] : null;
        return {
          ...event,
          startTime: detailResponse.data.startTime,
          coverPhotoUrl: firstPhoto ? `${import.meta.env.VITE_API_URL}/eventPhoto/${event.id}/${firstPhoto.id}` : null
        };
      } catch (error) {
        console.error(`獲取事件 ${event.id} 的詳情或照片失敗:`, error);
        return event;
      }
    }));
    events.value = eventsWithDetails;
    filterEvents();
  } catch (error) {
    console.error('獲取工作坊列表失敗:', error);
    message.error('獲取工作坊列表失敗');
  } finally {
    loading.value = false;
  }
};

const filterEvents = () => {
  filteredEvents.value = events.value.filter(event => 
    event.eventName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    event.creatorName.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
  sortEvents();
};

const sortEvents = () => {
  filteredEvents.value.sort((a, b) => {
    switch (sortOption.value) {
      case 'dateAsc':
        return new Date(a.startTime || 0) - new Date(b.startTime || 0);
      case 'dateDesc':
        return new Date(b.startTime || 0) - new Date(a.startTime || 0);
      case 'nameAsc':
        return a.eventName.localeCompare(b.eventName);
      case 'nameDesc':
        return b.eventName.localeCompare(a.eventName);
      default:
        return 0;
    }
  });
};

const formatDate = (dateString) => {
  if (!dateString) return '未設置時間';
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('zh-TW', options);
};

const canUserEdit = (event) => {
  return userStore.userId === event.eventCreatorId;
};

const editEvent = (event) => {
  editingEvent.value = { ...event };
  showEditModal.value = true;
};

const updateEvent = async () => {
  try {
    const response = await axios.put(`/events/${editingEvent.value.id}/edit`, {
      source: 2,
      eventName: editingEvent.value.eventName,
      eventCreator: { id: userStore.userId },
      description: editingEvent.value.description
    });
    if (response.status === 200) {
      const index = events.value.findIndex(e => e.id === editingEvent.value.id);
      if (index !== -1) {
        events.value[index] = { ...events.value[index], ...editingEvent.value };
      }
      showEditModal.value = false;
      filterEvents(); // 重新過濾和排序事件
      message.success('更新工作坊成功');
    }
  } catch (error) {
    console.error('更新工作坊失敗:', error);
    message.error('更新工作坊失敗');
  }
};

const goToEventDetail = (eventId) => {
  router.push({ name: 'event-detail-link', params: { id: eventId } });
};

const confirmDelete = (event) => {
  dialog.warning({
    title: '確認刪除',
    content: '您確定要刪除這個工作坊嗎？此操作不可撤銷。',
    positiveText: '確認刪除',
    negativeText: '取消',
    onPositiveClick: () => deleteEvent(event),
    onNegativeClick: () => {}
  });
};

const deleteEvent = async (event) => {
  try {
    const response = await axios.delete(`/events/${event.id}`);
    if (response.status === 200) {
      events.value = events.value.filter(e => e.id !== event.id);
      filteredEvents.value = filteredEvents.value.filter(e => e.id !== event.id);
      message.success('工作坊已成功刪除');
    }
  } catch (error) {
    console.error('刪除工作坊失敗:', error);
    message.error('刪除工作坊失敗，請稍後再試');
  }
};

onMounted(() => {
  fetchEvents();
});
</script>

<style scoped>
.custom-container {
  width: 80%;
  margin: 0 auto;
}

.search-sort-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.search-input {
  width: 78%;
}

.sort-select {
  width: 20%;
}

.custom-event-box {
  background-color: #FFF;
  border: 1px solid #FFB6C1;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.custom-event-box:hover {
  background-color: #FFE4E1;
  border-color: #DB7093;
  box-shadow: 0 2px 4px rgba(219, 112, 147, 0.3);
}

.event-cover-container {
  width: 200px;
  height: 150px;
  overflow: hidden;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
}

.event-cover-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.event-cover-container:hover .event-cover-photo {
  transform: scale(1.05);
}

.no-photo {
  font-size: 1rem;
  color: #999;
}

.ts-header {
  color: #DB7093;
  transition: color 0.3s ease;
}

.ts-text.is-secondary {
  color: #CD5C5C;
  transition: color 0.3s ease;
}

.action-buttons {
  margin-top: 0.5rem;
}

.action-buttons .n-button {
  margin-left: 0.5rem;
}

.custom-button {
  background-color: #FFB6C1 !important;
  color: #FFF !important;
}

.custom-button:hover {
  background-color: #FFA07A !important;
}
</style>