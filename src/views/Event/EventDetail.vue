<template>
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">事件詳情</h1>
      <div v-if="event">
        <h2 class="text-xl mb-2">{{ event.eventName }}</h2>
        <p>創建者: {{ event.creatorName }}</p>
        <p>日期: {{ formatDate(event.added) }}</p>
        <!-- 添加更多事件詳情 -->
      </div>
      <div v-else-if="loading">加載中...</div>
      <div v-else>無法找到該事件</div>
      <router-link to="/workshops" class="text-blue-500 hover:underline mt-4 inline-block">
        返回工作坊列表
      </router-link>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from '@/plugins/axios';
  
  const props = defineProps({
    id: {
      type: String,
      required: true
    }
  });
  
  const event = ref(null);
  const loading = ref(true);
  
  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(`/events/${props.id}`);
      event.value = response.data;
    } catch (error) {
      console.error('獲取事件詳情失敗:', error);
    } finally {
      loading.value = false;
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('zh-TW', options);
  };
  
  onMounted(fetchEventDetails);
  </script>