<template>
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4 text-center">工作坊活動列表</h1>
  
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
      <!-- <AddClubEventForm  @eventAdded="onEventAdded" /> -->

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
        </div>
      </div>
      <div v-else-if="loading" class="text-center text-gray-600">
        加載中...
      </div>
      <div v-else class="text-center text-gray-600">
        沒有找到工作坊活動
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import axios from '@/plugins/axios';
  import AddClubEventForm from './AddClubEventForm.vue';
  
  const events = ref([]);
  const filteredEvents = ref([]);
  const searchQuery = ref('');
  const sortOption = ref('dateDesc');
  const loading = ref(true);
  
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
  
  const onEventAdded = (newEvent) => {
  events.value.unshift(newEvent);
};

  onMounted(() => {
    fetchEvents();
  });
  </script>