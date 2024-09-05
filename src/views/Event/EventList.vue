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
              <div class="ts-loading"></div>
            </div>
            <div v-else-if="filteredEvents.length === 0" class="ts-center">
              沒有找到工作坊活動
            </div>
            <div v-else>
              <div 
                v-for="event in filteredEvents" 
                :key="event.id" 
                class="custom-event-box"
                @click="goToEventDetail(event.id)"
              >
                <div class="ts-content">
                  <div class="ts-row">
                    <div class="column is-7-wide is-center-aligned">
                      <div class="ts-header">{{ event.eventName }}</div>
                    </div>
                    <div class="column is-5-wide is-right-aligned">
                      <div class="ts-text is-secondary">
                        <p>創建者: {{ event.creatorName }}</p>
                        <p>日期: {{ formatDate(event.added) }}</p>
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
    <div v-if="showEditModal" class="ts-modal is-visible">
      <div class="ts-box">
        <div class="ts-content">
          <div class="ts-header">編輯工作坊</div>
          <div class="ts-space"></div>
          <div class="ts-input is-fluid custom-input">
            <input v-model="editingEvent.eventName" type="text" placeholder="活動名稱">
          </div>
          <div class="ts-space"></div>
          <div class="ts-textarea custom-textarea">
            <textarea v-model="editingEvent.description" placeholder="活動詳情"></textarea>
          </div>
          <div class="ts-space"></div>
          <button @click="updateEvent" class="ts-button custom-button">保存</button>
          <button @click="showEditModal = false" class="ts-button">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/plugins/axios';
import useUserStore from "@/stores/userstore";
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();
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
    events.value = response.data.filter(event => event.source === 2); // 只保留工作坊 (source = 2)
    filterEvents();
  } catch (error) {
    console.error('獲取工作坊列表失敗:', error);
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
        return new Date(a.added) - new Date(b.added);
      case 'dateDesc':
        return new Date(b.added) - new Date(a.added);
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
    }
  } catch (error) {
    console.error('更新工作坊失敗:', error);
  }
};

const goToEventDetail = (eventId) => {
  router.push({ name: 'event-detail-link', params: { id: eventId } });
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
  width: 78%; /* 給間距留一些空間 */
}

.sort-select {
  width: 20%;
}

.custom-event-box {
  background-color: #FFF;
  border: 1px solid #FFB6C1;  /* 淺粉紅色邊框 */
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.custom-event-box:hover {
  background-color: #FFE4E1;  /* 更深的粉色背景 */
  border-color: #DB7093;  /* 更深的邊框顏色 */
  box-shadow: 0 2px 4px rgba(219, 112, 147, 0.3);  /* 更明顯的陰影 */
}

.custom-event-box:hover .ts-header {
  color: #C71585;  /* 懸停時更深的標題顏色 */
}

.custom-event-box:hover .ts-text.is-secondary {
  color: #8B0000;  /* 懸停時更深的次要文字顏色 */
}

.custom-button {
  background-color: #FFB6C1 !important;  /* 粉藕色按鈕 */
  color: #FFF !important;
}

.custom-button:hover {
  background-color: #FFA07A !important;  /* 深一點的粉藕色 */
}

.custom-input input,
.custom-select select,
.custom-textarea textarea {
  border-color: #FFB6C1 !important;
}

.custom-input input:focus,
.custom-select select:focus,
.custom-textarea textarea:focus {
  border-color: #FFA07A !important;
}

.ts-header {
  color: #DB7093;  /* 深粉藕色標題 */
  transition: color 0.3s ease;  /* 添加顏色過渡效果 */
}

.ts-text.is-secondary {
  color: #CD5C5C;  /* 深紅色次要文字 */
  transition: color 0.3s ease;  /* 添加顏色過渡效果 */
}
</style>
  