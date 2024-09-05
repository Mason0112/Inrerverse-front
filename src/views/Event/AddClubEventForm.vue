<template>
    <div class="mt-4">
      <h3 class="text-lg font-semibold mb-2">新增活動</h3>
      <form @submit.prevent="submitEvent" class="space-y-4">
        <div>
          <label for="eventName" class="block text-sm font-medium text-gray-700">活動名稱</label>
          <input type="text" id="eventName" v-model="eventData.eventName" required
                 class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
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
        <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          新增活動
        </button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from '@/plugins/axios';
  import useUserStore from '@/stores/userstore'
  
  const userStore = useUserStore();
let userId = userStore.userId;

  const props = defineProps({
    clubId: {
      type: Number,
      required: true
    }
  });
  
  const emit = defineEmits(['eventAdded']);
  
  const eventData = ref({
    eventName: '',
    source: 1, // 表示這是一個社團活動
    club:{id: props.clubId},
    eventCreator:{id:userId}

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
  
  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toISOString().slice(0, 19).replace('T', ' ');
  };
  
  const submitEvent = async () => {
  try {
    // 步驟 1: 創建 Event
    const eventRequestData = {
      ...eventData.value,
      clubId: props.clubId
    };
    console.log('Event 請求數據:', eventRequestData);

    const eventResponse = await axios.post('/events/new/Event', eventRequestData);
    
    console.log('Event created:', eventResponse.data);

    // 步驟 2: 創建 EventDetail
    const eventDetailRequestData = {
      ...eventDetailData.value,
      startTime: formatDateTime(eventDetailData.value.startTime),
      endTime: formatDateTime(eventDetailData.value.endTime),
      event: { id: eventResponse.data.id }
    };
    console.log('EventDetail 請求數據:', eventDetailRequestData);

    const eventDetailResponse = await axios.post(`/eventDetail/${eventResponse.data.id}/new`, eventDetailRequestData);
    
    console.log('EventDetail created:', eventDetailResponse.data);
  
      // 合併 Event 和 EventDetail 數據
      const combinedEventData = {
        ...eventResponse.data,
        eventDetail: eventDetailResponse.data
      };
  
      emit('eventAdded', combinedEventData);
      
      // 重置表單
      eventData.value = { eventName: '', source: 1 };
      eventDetailData.value = {
        location: '',
        description: '',
        startTime: '',
        endTime: '',
        fee: 0,
        participantMin: 1,
        participantMax: 1
      };
    } catch (error) {
      console.error('添加活動失敗:', error);
      // 這裡可以添加錯誤處理，比如顯示一個錯誤消息
    }
  };
  </script>