<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4 text-black text-center">俱樂部詳情</h1>
    <div v-if="loading" class="text-center">加載中...</div>
    <div v-else-if="error" class="text-red-500 text-center">{{ error }}</div>
    <div v-else-if="club" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 text-center">
      <!-- 添加照片顯示 -->
      <div v-if="club.photo" class="mb-4 flex justify-center">
        <div class="w-48 h-48 overflow-hidden rounded-lg">
          <img 
            :src="getPhotoUrl(club.photo)" 
            alt="俱樂部照片" 
            class="object-cover w-full h-full"
          >
        </div>
      </div>
      <h2 class="text-xl font-bold mb-4 text-black">{{ club.clubName }}</h2>
      <p class="mb-2 text-black"><strong>描述：</strong> {{ club.description }}</p>
      <p class="mb-2 text-black"><strong>公開：</strong> {{ club.isPublic ? '是' : '否' }}</p>
      <!-- <p class="mb-2 text-black"><strong>允許：</strong> {{ club.isAllowed ? '是' : '否' }}</p> -->
      <p class="mb-2 text-black"><strong>創建者：</strong> {{ club.userName }}</p>
      
      <ClubPhotoAlbum v-if="club" :clubId="clubId" :isMember="isMember" />
       <!-- 添加 ClubEvent 組件 -->
       <ClubEvent :clubId="clubId"  :isMember="isMember"/>
       
      <div class="mt-4">
        <div class="mt-8">
        <!-- <h3 class="text-lg font-bold mb-4 text-black">俱樂部成員</h3> -->
        <ClubMembersList :clubId="clubId" />
        </div>
        <router-link 
          v-if="isCreator"
          :to="{ name: 'club-edit-link', params: { id: club.id } }"
          class="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded mr-2"
        >
          編輯俱樂部
        </router-link>
        <button 
          v-if="isCreator"
          @click="confirmDelete"
          class="bg-red-500 hover:bg-red-700 text-black font-bold py-2 px-4 rounded mr-2"
        >
          刪除俱樂部
        </button>
        <router-link 
          :to="{ name: 'club-all-link' }" 
          class="bg-gray-500 hover:bg-gray-700 text-black font-bold py-2 px-4 rounded"
        >
          返回列表
        </router-link>
      </div>
    </div>

    <!-- 確認刪除的對話框 -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div class="bg-white p-5 rounded-lg shadow-xl">
        <h3 class="text-lg font-bold mb-4">確認刪除</h3>
        <p class="mb-4">您確定要刪除這個俱樂部嗎？此操作不可撤銷。</p>
        <div class="flex justify-end">
          <button @click="deleteClub" class="bg-red-500 hover:bg-red-700 text-black font-bold py-2 px-4 rounded mr-2">
            確認刪除
          </button>
          <button @click="showDeleteConfirm = false" class="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded">
            取消
          </button>
        </div>
      </div>
    </div>

    <!-- 成功消息 -->
    <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4" role="alert">
      <strong class="font-bold">成功：</strong>
      <span class="block sm:inline">{{ successMessage }}</span>
    </div>

    <!-- 錯誤消息 -->
    <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
      <strong class="font-bold">錯誤：</strong>
      <span class="block sm:inline">{{ errorMessage }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from "@/plugins/axios";
import useUserStore from "@/stores/userstore";
import ClubMembersList from '@/views/club/ClubMembersList.vue';
import ClubPhotoAlbum from './ClubPhotoAlbum.vue';
import ClubEvent from '../Event/ClubEvent.vue';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const club = ref(null);
const loading = ref(true);
const error = ref(null);
const errorMessage = ref('');
const successMessage = ref('');
const showDeleteConfirm = ref(false);
const isMember = ref(false);

const clubId = route.params.id;

const isCreator = computed(() => {
  return club.value && Number(club.value.clubCreator) === Number(userStore.userId);
});

const getPhotoUrl = (photoName) => {
  if (!photoName) return null;
  return `${import.meta.env.VITE_API_URL}/clubs/photo/${photoName}`;
};

const fetchClubDetails = async () => {
  try {
    const response = await axios.get(`/clubs/${clubId}`);
    club.value = response.data;
    await checkMembership();
    loading.value = false;
  } catch (err) {
    console.error('Error fetching club details:', err);
    error.value = '獲取俱樂部詳情時出錯';
    loading.value = false;
  }
};

const confirmDelete = () => {
  showDeleteConfirm.value = true;
};

const deleteClub = async () => {
  try {
    await axios.delete(`/clubs/${clubId}`);
    successMessage.value = '俱樂部已成功刪除';
    setTimeout(() => {
      router.push({ name: 'club-all-link' });
    }, 2000);
  } catch (err) {
    console.error('Error deleting club:', err);
    errorMessage.value = '刪除俱樂部時出錯';
    showDeleteConfirm.value = false;
  }
};

const checkMembership = async () => {
  try {
    const response = await axios.get(`/clubMember/club/${clubId}/approved-members`);
    if (response.status === 200) {
      isMember.value = response.data.some(member => member.userId === userStore.userId);
    } else {
      isMember.value = false;
    }
  } catch (err) {
    console.error('Error checking membership:', err);
    errorMessage.value = '檢查會員資格時出錯';
    isMember.value = false;
  }
};

onMounted(fetchClubDetails);
</script>
