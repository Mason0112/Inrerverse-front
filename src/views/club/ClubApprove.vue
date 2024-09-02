<template>
    <div class="container mx-auto p-4 flex justify-center">
      <div class="w-full max-w-4xl">
        <div class="flex justify-between items-center mb-4">
          <h1 class="text-2xl font-bold">我創建的俱樂部</h1>
          <router-link 
            :to="{ name: 'club-form-link' }"
            class="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded"
          >
            新增俱樂部
          </router-link>
        </div>
        <div v-if="loading" class="text-center py-4">
          <p class="text-xl">加載中...</p>
        </div>
        <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong class="font-bold">錯誤：</strong>
          <span class="block sm:inline">{{ error }}</span>
        </div>
        <div v-else>
          <table class="min-w-full bg-white">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-2 text-center">照片</th>
                <th class="px-4 py-2 text-center">ID</th>
                <th class="px-4 py-2 text-center">社團名稱</th>
                <th class="px-4 py-2 text-center">公開</th>
                <th class="px-4 py-2 text-center">允許</th>
                <th class="px-4 py-2 text-center">編輯</th>
                <th class="px-4 py-2 text-center">審核</th>
                <th class="px-4 py-2 text-center">成員列表</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="club in clubs" :key="club.id" class="border-b hover:bg-gray-50">
                <td class="px-4 py-2 text-center">
                  <div class="w-16 h-16 overflow-hidden rounded-md flex justify-center">
                    <img 
                      v-if="club.photo" 
                      :src="getPhotoUrl(club.photo)" 
                      :alt="club.clubName" 
                      class="object-cover w-full h-full"
                      style="width: 64px; height: 64px;"
                    >
                    <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500" style="width: 64px; height: 64px;">
                      無照片
                    </div>
                  </div>
                </td>
                <td class="px-4 py-2 text-center">{{ club.id }}</td>
                <td class="px-4 py-2 text-center">
                  <router-link 
                    :to="{ name: 'club-detail-link', params: { id: club.id } }"
                    class="text-blue-500 hover:underline cursor-pointer"
                  >
                    {{ club.clubName }}
                  </router-link>
                </td>
                <td class="px-4 py-2 text-center">{{ club.isPublic === 1 ? '是' : '否' }}</td>
                <td class="px-4 py-2 text-center">{{ club.isAllowed === 1 ? '是' : '否' }}</td>
                <td class="px-4 py-2 text-center">
                  <router-link 
                    :to="{ name: 'club-edit-link', params: { id: club.id } }"
                    class="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded"
                  >
                    編輯
                  </router-link>
                </td>
                <td class="px-4 py-2 text-center">
                  <router-link 
                    :to="{ name: 'club-approve2-link', params: { id: club.id } }" 
                    class="bg-yellow-500 hover:bg-yellow-700 text-black font-bold py-2 px-4 rounded"
                  >
                    管理成員
                  </router-link>
                </td>
                <td class="px-4 py-2 text-center">
                  <button
                    @click="handleShowMembers(club.id, club.clubName)"
                    class="bg-green-500 hover:bg-green-700 text-black font-bold py-2 px-4 rounded"
                  >
                    查看成員
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  
      <!-- 成員列表模態框 -->
      <Teleport to="body">
        <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="handleCloseMembersList"></div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      {{ selectedClubName }} 成員列表
                    </h3>
                    <div class="mt-2">
                      <ClubMembersList
                        :key="selectedClubId"
                        :clubId="selectedClubId"
                        @close="handleCloseMembersList"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" @click="handleCloseMembersList">
                  關閉
                </button>
              </div>
            </div>
          </div>
        </div>
      </Teleport>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from "@/plugins/axios";
  import useUserStore from "@/stores/userstore";
  import ClubMembersList from '@/views/club/ClubMembersList.vue';
  
  const clubs = ref([]);
  const loading = ref(true);
  const error = ref(null);
  const selectedClubId = ref(null);
  const selectedClubName = ref('');
  const showModal = ref(false);
  const userStore = useUserStore();
  
  const fetchMyClubs = async () => {
    try {
      const response = await axios.get(`/clubs/my-clubs?userId=${userStore.userId}`);
      clubs.value = response.data;
      loading.value = false;
    } catch (err) {
      console.error('Error fetching my clubs:', err);
      error.value = err.message;
      loading.value = false;
    }
  };
  
  const getPhotoUrl = (photoName) => {
    if (!photoName) return null;
    return `${import.meta.env.VITE_API_URL}/clubs/photo/${photoName}`;
  };
  
  const handleShowMembers = (clubId, clubName) => {
    selectedClubId.value = clubId;
    selectedClubName.value = clubName;
    showModal.value = true;
  };
  
  const handleCloseMembersList = () => {
    showModal.value = false;
    selectedClubId.value = null;
    selectedClubName.value = '';
  };
  
  onMounted(fetchMyClubs);
  </script>