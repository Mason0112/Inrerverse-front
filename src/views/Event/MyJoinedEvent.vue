<template>
    <n-card class="my-joined-events-container">
      <template #header>
        <n-h1>我參加的活動/工作坊</n-h1>
      </template>
      <n-spin :show="loading">
        <n-result v-if="error" status="error" :title="error" />
        <div v-else>
          <n-empty v-if="events.length === 0" description="您還沒有參加任何活動" />
          <n-list v-else>
            <n-list-item v-for="event in events" :key="event.id" class="event-item">
              <n-thing>
                <template #header>
                  {{ event.eventName }}
                </template>
                <template #description>
                  <n-space vertical>
                    <span>隸屬於：{{ event.clubName || '工作坊' }}</span>
                    <span>創建者：{{ event.creatorName }}</span>
                    <!-- 可以根據需要添加更多活動詳情 -->
                  </n-space>
                </template>
              </n-thing>
              <template #suffix>
                <n-button @click="viewEventDetails(event.id)">查看詳情</n-button>
              </template>
            </n-list-item>
          </n-list>
        </div>
      </n-spin>
    </n-card>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from '@/plugins/axios';
  import useUserStore from "@/stores/userstore";
  import { 
    NCard, NSpin, NResult, NH1, NEmpty, NList, NListItem, 
    NButton, NSpace, NThing, useMessage
  } from 'naive-ui';
  
  const router = useRouter();
  const userStore = useUserStore();
  const message = useMessage();
  
  const events = ref([]);
  const loading = ref(true);
  const error = ref(null);
  
  const fetchJoinedEvents = async () => {
    try {
      const response = await axios.get(`/eventParticipant/user/${userStore.userId}/events`);
      events.value = response.data || [];
      loading.value = false;
    } catch (err) {
      console.error('Error fetching joined events:', err);
      error.value = '獲取已參加活動列表時出錯';
      loading.value = false;
      message.error('獲取已參加活動列表失敗');
    }
  };
  
  const viewEventDetails = (eventId) => {
    router.push({ name: 'event-detail-link', params: { id: eventId } });
  };
  
  onMounted(() => {
    fetchJoinedEvents();
  });
  </script>
  
  <style scoped>
  .my-joined-events-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .event-item {
    margin-bottom: 16px;
    transition: background-color 0.3s;
  }
  
  .event-item:hover {
    background-color: #FFF0F5;
  }
  </style>