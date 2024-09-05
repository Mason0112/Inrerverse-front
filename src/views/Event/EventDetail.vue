<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">活動詳情</h1>
    
    <div v-if="eventDetail" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div v-if="!isEditing">
        <h2 class="text-2xl font-semibold mb-2">{{event.eventName }}</h2>
        <p><strong>地點:</strong> {{ eventDetail.location }}</p>
        <p><strong>開始時間:</strong> {{ formatDateTime(eventDetail.startTime) }}</p>
        <p><strong>結束時間:</strong> {{ formatDateTime(eventDetail.endTime) }}</p>
        <p><strong>描述:</strong> {{ eventDetail.description }}</p>
        <p><strong>最大參與人數:</strong> {{ eventDetail.participantMax }}</p>
        <p><strong>最小參與人數:</strong> {{ eventDetail.participantMin }}</p>
        <p><strong>費用:</strong> ${{ eventDetail.fee }}</p>

      </div>
      
 
    </div>
    
    <div v-else class="text-center text-gray-600">
      加載中...
    </div>

    <router-link 
          :to="{ name: 'event-all-link' }" 
          class="bg-gray-500 hover:bg-gray-700 text-black font-bold py-2 px-4 rounded"
        >
          返回列表
        </router-link>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '@/plugins/axios';
import useUserStore from "@/stores/userstore";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const event = ref({});
const eventDetail = ref(null);
const isEditing = ref(false);
const editedEventDetail = ref({});

const fetchEventDetail = async () => {
  try {
    const response = await axios.get(`/eventDetail/${route.params.id}/show`);
    eventDetail.value = response.data;
    console.log(eventDetail.value)
  } catch (error) {
    console.error('獲取活動詳情失敗:', error);
  }
};

const fetchEvent = async () => {
  try {
    const response = await axios.get(`/events/${route.params.id}`);
    event.value = response.data;
    console.log(event.value)
  } catch (error) {
    console.error('獲取活動名稱失敗:', error);
  }
};

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateTimeString).toLocaleString('zh-TW', options);
};

const canUserEdit = computed(() => {
  return userStore.userId === eventDetail.value?.event?.eventCreatorId;
});




onMounted(()=>{
  fetchEventDetail();
  fetchEvent();
}
);
</script>
