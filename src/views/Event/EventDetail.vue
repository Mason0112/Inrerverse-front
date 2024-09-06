<template>
  <n-card class="container">
    <template #header>
      <n-h1>活動詳情</n-h1>
    </template>
    
    <n-spin :show="loading">
      <n-space v-if="eventDetail && event" vertical size="large">
        <n-h2>{{ event.eventName }}</n-h2>
        <n-descriptions bordered>
          <n-descriptions-item label="地點">
            {{ eventDetail.location }}
          </n-descriptions-item>
          <n-descriptions-item label="開始時間">
            {{ formatDateTime(eventDetail.startTime) }}
          </n-descriptions-item>
          <n-descriptions-item label="結束時間">
            {{ formatDateTime(eventDetail.endTime) }}
          </n-descriptions-item>
          <n-descriptions-item label="描述">
            {{ eventDetail.description }}
          </n-descriptions-item>
          <n-descriptions-item label="人數上限">
            {{ eventDetail.participantMax }}
          </n-descriptions-item>
          <n-descriptions-item label="成團人數">
            {{ eventDetail.participantMin }}
          </n-descriptions-item>
          <n-descriptions-item label="費用">
            ${{ eventDetail.fee }}
          </n-descriptions-item>
        </n-descriptions>
      </n-space>
      <n-result v-else-if="error" status="error" :title="error" />
    </n-spin>

    <template #footer>
      <n-button @click="back" type="primary">
        返回列表
      </n-button>
    </template>
  </n-card>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '@/plugins/axios';
import useUserStore from "@/stores/userstore";
import { 
  NCard, NSpin, NSpace, NH1, NH2, NDescriptions, 
  NDescriptionsItem, NButton, NResult 
} from 'naive-ui';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const event = ref({});
const eventDetail = ref(null);
const loading = ref(true);
const error = ref(null);

const fetchEventDetail = async () => {
  try {
    const response = await axios.get(`/eventDetail/${route.params.id}/show`);
    eventDetail.value = response.data;
    loading.value = false;
  } catch (error) {
    console.error('獲取活動詳情失敗:', error);
    error.value = '獲取活動詳情失敗';
    loading.value = false;
  }
};

const fetchEvent = async () => {
  try {
    const response = await axios.get(`/events/${route.params.id}`);
    event.value = response.data;
  } catch (error) {
    console.error('獲取活動名稱失敗:', error);
    error.value = '獲取活動名稱失敗';
  }
};

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '未設置';
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateTimeString).toLocaleString('zh-TW', options);
};

const canUserEdit = computed(() => {
  return userStore.userId === eventDetail.value?.event?.eventCreatorId;
});

const back = () => {
  router.go(-1);
};

onMounted(() => {
  fetchEventDetail();
  fetchEvent();
});
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}
</style>