<template>
    <!-- <img :src="`${photo}`" alt="Profile Photo" />

    <Vueform ref="form$">
        <ButtonElement name="editProfile" button-label="編輯個人資料" :full="true" size="lg" @click="editProfile"/>
    </Vueform> -->
  <div class="profile-page">
    <!-- 侧边栏导航 -->
    <aside class="sidebar">
      <ul>
        <li>Events</li>
        <li>News</li>
        <li>Chats</li>
        <li class="active">Profile</li>
        <li>Settings</li>
      </ul>
    </aside>

    <!-- 主要内容部分 -->
    <section class="profile-content">
      <!-- 用户信息卡片 -->
      <div class="user-card">
        <img :src="`${photo}`" alt="User Photo" class="user-photo" />
        <h3>{{ nickname }}</h3>
        <p>{{ accountNumber }}</p>
        <p>{{ email }}</p>
        <!-- <div class="stats">
          <span>{{ user.following }} Following</span>
          <span>{{ user.followers }} Followers</span>
          <span>{{ user.events }} Events</span>
        </div> -->
      </div>

      <!-- 用户资料编辑表单 -->
      <div class="edit-profile">
        <h4>修改資料</h4>

      </div>
    </section>
  </div>

</template>
    
<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/plugins/axios';
import useUserStore from '@/stores/userstore';

const userStore = useUserStore();
let accountNumber=ref("");
let email=ref("");
let nickname=ref("");
let phoneNumber=ref("");
let country=ref("");
let city=ref("");
let birthday=ref("");
let gender=ref("");
let photo=ref("");

onMounted(function(){
    callFind();
})

let userId = userStore.userId;

function callFind() {

    Promise.all([
        axios.get(`/user/secure/${userId}`),
        axios.get(`/user/secure/profile-photo/${userId}`)
    ])
    .then(function([response1, response2]){
        console.log("response1",response1);
        console.log("response2", response2);

        accountNumber.value= response1.data.accountNumber;
        email.value= response1.data.email;
        nickname.value = response1.data.nickname;

        photo.value = response2.data;

    })
    .catch(function(error){
        console.log("error", error);

    })
}
</script>
    
<style scoped>
    .profile-page {
  display: flex;
}

.sidebar {
  width: 200px;
  background-color: #f0f0f0;
  padding: 20px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  margin: 15px 0;
  cursor: pointer;
}

.sidebar .active {
  font-weight: bold;
  color: #00416a;
}

.profile-content {
  flex: 1;
  padding: 40px;
  background-color: #fff;
}

.user-card {
  background: #f9f9f9;
  padding: 20px;
  margin-bottom: 40px;
  text-align: center;
}

.user-photo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 20px;
}

.stats {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.edit-profile {
  background: #f9f9f9;
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.save-button {
  background-color: #00416a;
  color: #fff;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
}
</style>