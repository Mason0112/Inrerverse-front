<template>
  <div class="card">
    <div class="input-box">
      <input type="text" class="form-control" v-model="searchTerm" @input="filterFriends" placeholder="搜尋好友" />
      <font-awesome-icon :icon="['fas', 'magnifying-glass']" class="input-icon" />
    </div>
    
    <div v-if="loading" class="text-center my-3">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">加載中…</span>
      </div>
    </div>

    <div v-else-if="filteredFriends.length === 0" class="text-center my-3">
      朋友列表是空的。
    </div>

    <template v-else>
  <div class="list border-bottom d-flex justify-content-between align-items-center" v-for="friend in filteredFriends" :key="friend.user2Id">
    <div class="d-flex align-items-center">
      <!-- <img :src="friend.photo" alt="Friend's photo" class="friend-photo mr-3" /> -->
      <div class="d-flex flex-column">
        <span>{{ friend.accountNumber }}</span>
        <small>{{ friend.age }} 歲</small>
      </div>
    </div>
    <button class="btn btn-danger btn-sm" @click="deleteFriend(friend.user2Id)">刪除好友</button>
  </div>
</template>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "@/plugins/axios";
import useUserStore from "@/stores/userstore";

const userStore = useUserStore();
const userId = userStore.userId;

const friends = ref([]);
const loading = ref(true);
const searchTerm = ref('');

const filteredFriends = computed(() => {
  return friends.value.filter(friend => 
    friend.accountNumber.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    friend.age.toString().includes(searchTerm.value)
  );
});

onMounted(async () => {
  await fetchFriends();
});

async function fetchFriends() {
  try {
    const response = await axios.get(`/friend/${userId}/list`);
    const friendsData = response.data;
    await fetchUserDetails(friendsData);
  } catch (error) {
    console.error("Error fetching friends:", error);
  } finally {
    loading.value = false;
  }
}

async function fetchUserDetails(friendsData) {
  try {
    const userRequests = friendsData.map(friend => axios.get(`/user/secure/${friend.user2Id}`));
    // const photoRequests = friendsData.map(friend => axios.get(`/user/secure/profile-photo/${friend.user2Id}`));
    
    const [userResponses, photoResponses] = await Promise.all([
      Promise.all(userRequests),
      // Promise.all(photoRequests)
    ]);
    
    friends.value = friendsData.map((friend, index) => ({
      ...friend,
      accountNumber: userResponses[index].data.accountNumber,
      age: userResponses[index].data.age,
      // photo: photoResponses[index].data
    }));
  } catch (error) {
    console.error('Error fetching user details:', error);
  }
}

function filterFriends() {
  // 這個函數可以留空，因為我們使用了計算屬性 filteredFriends
}

async function deleteFriend(friendId) {
  if (confirm('確定要刪除這個好友嗎？')) {
    try {
      await axios.get(`/friend/switch-status/${userId}/${friendId}`);
      // 從列表中移除該好友
      friends.value = friends.value.filter(friend => friend.user2Id !== friendId);
      alert('好友已成功刪除');
    } catch (error) {
      console.error('刪除好友時發生錯誤:', error);
      alert('刪除好友失敗，請稍後再試');
    }
  }
}
</script>

<style scoped>
.input-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  pointer-events: none; /* 防止圖標阻礙用戶點擊輸入框 */
}

.card {
  background-color: #fff;
  padding: 15px;
  border: none;
}

.input-box {
  position: relative;
}

.input-box i {
  position: absolute;
  right: 13px;
  top: 15px;
  color: #ced4da;
}

.form-control {
  height: 50px;
  background-color: #eeeeee69;
}

.form-control:focus {
  background-color: #eeeeee69;
  box-shadow: none;
  border-color: #eee;
}

.list {
  padding-top: 20px;
  padding-bottom: 10px;
  display: flex;
  align-items: center;
}

.border-bottom {
  border-bottom: 2px solid #eee;
}

.list i {
  font-size: 19px;
  color: red;
}

.list small {
  color: #dedddd;
}

.friend-photo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}
</style>
