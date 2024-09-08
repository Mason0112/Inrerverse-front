<template>
      <div class="mt-4">
    <h3 class="text-lg font-semibold mb-2">新增工作坊</h3>
    <form @submit.prevent="submitWorkshop" class="space-y-4">
      <div>
        <label for="eventName" class="block text-sm font-medium text-gray-700">工作坊名稱</label>
        <input type="text" id="eventName" v-model="eventData.eventName" required
               class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
      </div>
        <!-- 新增封面照片上傳 -->
      <div>
        <label for="coverPhoto" class="block text-sm font-medium text-gray-700">封面照片</label>
        <input type="file" id="coverPhoto" @change="handleFileChange" accept="image/*"
               class="mt-1 block w-full">
      </div>
        <div>
          <label for="location" class="block text-sm font-medium text-gray-700">地點</label>
          <input type="text" id="location" v-model="eventDetailData.location" required
                 class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
        </div>
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">描述</label>
          <textarea id="description" v-model="eventDetailData.description" rows="3"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
        </div>
        <div>
          <label for="startTime" class="block text-sm font-medium text-gray-700">開始時間</label>
          <input type="datetime-local" id="startTime" v-model="eventDetailData.startTime" required
                 class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
        </div>
        <div>
          <label for="endTime" class="block text-sm font-medium text-gray-700">結束時間</label>
          <input type="datetime-local" id="endTime" v-model="eventDetailData.endTime" required
                 class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
        </div>
        <div>
          <label for="fee" class="block text-sm font-medium text-gray-700">費用</label>
          <input type="number" id="fee" v-model="eventDetailData.fee" min="0" required
                 class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
        </div>
        <div>
          <label for="participantMin" class="block text-sm font-medium text-gray-700">最少人數</label>
          <input type="number" id="participantMin" v-model="eventDetailData.participantMin" min="1" required
                 class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
        </div>
        <div>
          <label for="participantMax" class="block text-sm font-medium text-gray-700">人數上限</label>
          <input type="number" id="participantMax" v-model="eventDetailData.participantMax" min="1" required
                 class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
        </div>
        <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded">
          新增工作坊
        </button>
      </form>
    </div>
  </template>
  
  <script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/plugins/axios';
import useUserStore from '@/stores/userstore'
import { useMessage } from 'naive-ui';

const router = useRouter();
const userStore = useUserStore();
let userId = userStore.userId;

const message = useMessage();
const emit = defineEmits(['workshopAdded']);

const eventData = ref({
  eventName: '',
  source: 2, // 表示這是一個工作坊活動
  eventCreator: { id: userId }
});

const eventDetailData = ref({
  location: '',
  description: '',
  startTime: '',
  endTime: '',
  fee: 0,
  participantMin: 1,
  participantMax: 1
});

const coverPhoto = ref(null);

const handleFileChange = (event) => {
  coverPhoto.value = event.target.files[0];
};

const formatDateTime = (dateTimeString) => {
  return new Date(dateTimeString).toISOString().slice(0, 19).replace('T', ' ');
};

const submitWorkshop = async () => {
  try {
    // 步驟 1: 創建 Event
    const eventResponse = await axios.post('/events/new/Workshop', eventData.value);
    console.log('Event created:', eventResponse.data);

    // 步驟 2: 創建 EventDetail
    const eventDetailRequestData = {
      ...eventDetailData.value,
      startTime: formatDateTime(eventDetailData.value.startTime),
      endTime: formatDateTime(eventDetailData.value.endTime),
      event: { id: eventResponse.data.id }
    };
    const eventDetailResponse = await axios.post(`/eventDetail/${eventResponse.data.id}/new`, eventDetailRequestData);
    console.log('EventDetail created:', eventDetailResponse.data);

    // 步驟 3: 上傳封面照片
    if (coverPhoto.value) {
      const formData = new FormData();
      formData.append('file', coverPhoto.value);
      formData.append('eventId', eventResponse.data.id);
      formData.append('uploaderId', userId);

      const photoResponse = await axios.post('/eventPhoto/new', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Cover photo uploaded:', photoResponse.data);
    }

    // 合併 Event 和 EventDetail 數據
    const combinedEventData = {
      ...eventResponse.data,
      eventDetail: eventDetailResponse.data,
      coverPhotoUrl: coverPhoto.value ? URL.createObjectURL(coverPhoto.value) : null
    };

    emit('workshopAdded', combinedEventData);
    
    // 重置表單
    eventData.value = { eventName: '', source: 2 };
    eventDetailData.value = {
      location: '',
      description: '',
      startTime: '',
      endTime: '',
      fee: 0,
      participantMin: 1,
      participantMax: 1
    };
    coverPhoto.value = null;

    message.success('工作坊新增成功');
setTimeout(() => {
  router.go(-1);
}, 1500); // 延遲 1.5 秒後返回,讓用戶有時間看到成功消息

  } catch (error) {
    console.error('添加工作坊失敗:', error);
    // 這裡可以添加錯誤處理，比如顯示一個錯誤消息
  }
  
};
</script>