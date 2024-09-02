<template>
  <div class="club-members-list">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">俱樂部成員</h2>
      <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
        <span class="sr-only">關閉</span>
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <div v-if="loading" class="text-center py-4">
      <p class="text-xl">加載中...</p>
    </div>
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">錯誤：</strong>
      <span class="block sm:inline">{{ error }}</span>
    </div>
    <div v-else-if="members.length === 0" class="text-center py-4">
      <p class="text-xl">該俱樂部目前沒有成員。</p>
    </div>
    <div v-else>
      <ul class="divide-y divide-gray-200">
        <li v-for="member in members" :key="member.userId" class="py-4 flex justify-between items-center">
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-900">用戶 ID: {{ member.userId }}</p>
            <p class="text-sm text-gray-500">加入時間: {{ formatDate(member.added) }}</p>
          </div>
          <button
            v-if="isCreator"
            @click="handleRemoveMember(member.userId)"
            class="bg-red-500 hover:bg-red-700 text-black font-bold py-1 px-2 rounded"
          >
            刪除
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits } from 'vue';
import axios from "@/plugins/axios";
import useUserStore from '@/stores/userstore';

const props = defineProps({
  clubId: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['close']);

const members = ref([]);
const loading = ref(true);
const error = ref(null);
const isCreator = ref(false);
const userStore = useUserStore();

const fetchMembers = async () => {
  try {
    const response = await axios.get(`/clubMember/club/${props.clubId}/approved-members`);
    members.value = response.data;

    // 確認當前用戶是否為俱樂部創建者
    const clubResponse = await axios.get(`/clubs/${props.clubId}`);
    isCreator.value = clubResponse.data.clubCreator === userStore.userId;

    loading.value = false;
  } catch (err) {
    console.error('Error fetching club members or club info:', err);
   // 处理404错误, 显示无成员的消息而不是跳转404页面
   if (err.response && err.response.status === 404) {
      members.value = []; // 确保成员列表为空以显示"没有成員"的消息
    } else {
      error.value = err.response?.data || '获取俱乐部成员时出错';
    }
    
    loading.value = false;
  }
};

const handleRemoveMember = async (userId) => {
  try {
    const response = await axios.delete(`/clubMember/club/${props.clubId}/user/${userId}`);
    alert(response.data); // 顯示成功消息
    fetchMembers(); // 刷新成員列表
  } catch (err) {
    console.error('Error removing member:', err);
    alert(err.response.data); // 顯示錯誤消息
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString();
};

onMounted(fetchMembers);
</script>
