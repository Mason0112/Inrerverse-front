<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold text-center">工作坊活動列表</h1>
      <router-link 
        :to="{ name: 'event-addWorkshop-link' }" 
        class="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded"
      >
        新增工作坊
      </router-link>
    </div>

    <!-- 搜索和排序控件 -->
    <div class="mb-4 flex justify-between items-center">
      <input 
        v-model="searchQuery" 
        class="border p-2 rounded" 
        placeholder="搜索工作坊..."
        @input="filterEvents"
      >
      <select 
        v-model="sortOption" 
        class="border p-2 rounded"
        @change="sortEvents"
      >
        <option value="dateDesc">日期 (新到舊)</option>
        <option value="dateAsc">日期 (舊到新)</option>
        <option value="nameAsc">名稱 (A-Z)</option>
        <option value="nameDesc">名稱 (Z-A)</option>
      </select>
    </div>

    <!-- 工作坊列表 -->
    <div v-if="filteredEvents.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="event in filteredEvents" :key="event.id" class="border rounded p-4 shadow">
        <h2 class="text-xl font-semibold mb-2">{{ event.eventName }}</h2>
        <p class="text-gray-600 mb-2">創建者: {{ event.creatorName }}</p>
        <p class="text-gray-600 mb-2">日期: {{ formatDate(event.added) }}</p>
        <router-link 
          :to="{ name: 'event-detail-link', params: { id: event.id } }" 
          class="text-blue-500 hover:underline"
        >
          查看詳情
        </router-link>
        <div v-if="canUserEdit(event)" class="mt-2">
          <button @click="editEvent(event)" class="bg-green-500 hover:bg-green-700 text-black font-bold py-1 px-2 rounded mr-2">
            編輯
          </button>
        </div>
      </div>
    </div>
    <div v-else-if="loading" class="text-center text-gray-600">
      加載中...
    </div>
    <div v-else class="text-center text-gray-600">
      沒有找到工作坊活動
    </div>

    <!-- 編輯模態框 -->
    <div v-if="showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 class="text-lg font-bold mb-4">編輯工作坊</h3>
        <input v-model="editingEvent.eventName" class="w-full p-2 mb-4 border rounded" placeholder="活動名稱">
        <textarea v-model="editingEvent.description" class="w-full p-2 mb-4 border rounded" placeholder="活動詳情"></textarea>
        <div class="flex justify-end">
          <button @click="updateEvent" class="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded mr-2">
            保存
          </button>
          <button @click="showEditModal = false" class="bg-gray-500 hover:bg-gray-700 text-black font-bold py-2 px-4 rounded">
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from '@/plugins/axios';
import useUserStore from "@/stores/userstore";

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
      source:2,
      eventName: editingEvent.value.eventName,
      eventCreator:{ id:userStore.userId },
      description: editingEvent.value.description
    });
    // console.log(response.data);
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

onMounted(() => {
  fetchEvents();
});
</script>