<template>
    <div class="container mx-auto p-4 flex justify-center">
      <div class="w-full max-w-4xl">
        <h1 class="text-2xl font-bold mb-4">社團成員審核</h1>
        <div v-if="loading" class="text-center py-4">
          <p class="text-xl">加載中...</p>
        </div>
        <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong class="font-bold">錯誤：</strong>
          <span class="block sm:inline">{{ error }}</span>
        </div>
        <div v-else>
          <h2 class="text-xl font-semibold mb-2">待審核成員</h2>
          <table v-if="pendingMembers.length > 0" class="min-w-full bg-white mb-4">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-2 text-left">用戶 ID</th>
                <th class="px-4 py-2 text-left">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="member in pendingMembers" :key="member.userId" class="border-b">
                <td class="px-4 py-2">{{ member.userId }}</td>
                <td class="px-4 py-2">
                  <button @click="approveMember(member.userId)" class="bg-green-500 hover:bg-green-700 text-black font-bold py-1 px-2 rounded mr-2">
                    審核通過
                  </button>
                  <button @click="removeMember(member.userId)" class="bg-red-500 hover:bg-red-700 text-black font-bold py-1 px-2 rounded">
                    刪除
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <p v-else class="text-gray-500">目前沒有待審核的成員。</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from "@/plugins/axios";
  import { useRoute } from 'vue-router';
  
  const route = useRoute();
  const clubId = route.params.id;  // 使用 'id' 而不是 'clubId'
  
  const pendingMembers = ref([]);
  const loading = ref(true);
  const error = ref(null);
  
  const fetchPendingMembers = async () => {
    try {
      const response = await axios.get(`/clubMember/club/${clubId}/pending-members`);
      pendingMembers.value = response.data;
      loading.value = false;
    } catch (err) {
      console.error('Error fetching pending members:', err);
      error.value = '獲取待審核成員時出錯';
      loading.value = false;
    }
  };
  
  const approveMember = async (userId) => {
    try {
      await axios.put(`/clubMember/approve/${clubId}/${userId}`);
      // 從待審核列表中移除該成員
      pendingMembers.value = pendingMembers.value.filter(member => member.userId !== userId);
    } catch (err) {
      console.error('Error approving member:', err);
      error.value = '審核成員時出錯';
    }
  };
  
  const removeMember = async (userId) => {
    try {
      await axios.delete(`/clubMember/club/${clubId}/user/${userId}`);
      // 從待審核列表中移除該成員
      pendingMembers.value = pendingMembers.value.filter(member => member.userId !== userId);
    } catch (err) {
      console.error('Error removing member:', err);
      error.value = '刪除成員時出錯';
    }
  };
  
  onMounted(fetchPendingMembers);
  </script>