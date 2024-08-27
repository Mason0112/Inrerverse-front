<template>
  <h1>我的好友們</h1>
  <div class="container mt-5">
    <div class="row d-flex justify-content-center">
      <div class="col-md-10">
        <div class="card">
          <div class="input-box">
            <input type="text" class="form-control" v-model="searchTerm" @input="filterFriends" />
            <font-awesome-icon :icon="['fas', 'magnifying-glass']" class="input-icon" />
          </div>
          
          <div v-if="loading" class="text-center my-3">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <div v-else-if="filteredFriends.length === 0" class="text-center my-3">
            No friends found.
          </div>

          <template v-else>
            <div class="list border-bottom" v-for="friend in filteredFriends" :key="friend.user2Id">
              <div class="d-flex flex-column ml-3">
                <span>{{ friend.accountNumber }}</span>
                <small>{{ friend.age }} 歲</small>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
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
    const requests = friendsData.map(friend => axios.get(`/user/secure/${friend.user2Id}`));
    const responses = await Promise.all(requests);
    
    friends.value = friendsData.map((friend, index) => ({
      ...friend,
      accountNumber: responses[index].data.accountNumber,
      age: responses[index].data.age
    }));
  } catch (error) {
    console.error('Error fetching user details:', error);
  }
}

function filterFriends() {
  // 這個函數可以留空，因為我們使用了計算屬性 filteredFriends
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
</style>