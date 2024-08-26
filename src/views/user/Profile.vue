<template>
    <div class="container mt-4">
        <div class="main-content">
            <div class="row gutters">
                <div class="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
                    <div class="profile-section">
                        <div class="user-avatar">
                            <img :src="`${photo}`" alt="User Photo">
                        </div>
                        <h5 class="user-name">{{ nickname }}</h5>
                        <h6 class="user-email">{{ email }}</h6>
                    </div>
                    <div class="about-section">
                        <h5>About</h5>
                        <p>I'm Yuki. Full Stack Designer I enjoy creating user-centric, delightful and human
                            experiences.</p>
                    </div>
                </div>
                <div class="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
                    <div class="details-section">
                        <div class="container mt-4">
                            <!-- Tabs Navigation -->
                            <ul class="nav nav-tabs" id="myTab" role="tablist">
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" :class="{ active: activeTab === 'profile' }"
                                        @click="activeTab = 'profile'">
                                        Profile
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" :class="{ active: activeTab === 'friends' }"
                                        @click="activeTab = 'friends'">
                                        Friends
                                    </button>
                                </li>
                            </ul>
    
                            <!-- Tabs Content -->
                            <div class="tab-content mt-3">
                                <div v-if="activeTab === 'profile'" class="tab-pane active">
                                    <h3>個人資料</h3>
                                    <!-- Profile Section -->
                                    <ProfileForm></ProfileForm>
                                </div>
                                <div v-if="activeTab === 'friends'" class="tab-pane active">
                                    <h3>好友列表</h3>
                                    <!-- Friends Section -->
                                    <p>Here is the friends content.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import ProfileForm from '@/components/user/ProfileForm.vue';

import { ref, onMounted } from "vue";
import axios from "@/plugins/axios";
import useUserStore from "@/stores/userstore";

const activeTab = ref('profile')

const userStore = useUserStore();
let userId = userStore.userId;

let accountNumber = ref("");
let email = ref("");
let nickname = ref("");
let phoneNumber = ref("");
let country = ref("");
let city = ref("");
let birthday = ref("");
let gender = ref("");
let photo = ref("");

onMounted(function () {
  callFind();
});

function callFind() {
axios.get(`/user/secure/${userId}`)
    .then(function (response) {
      console.log("response", response);
      accountNumber.value = response.data.accountNumber;
      email.value = response.data.email;
      nickname.value = response.data.nickname;
    })
    .catch(function (error) {
      console.log("error", error);
    });

  axios.get(`/user/secure/profile-photo/${userId}`)
    .then(function (response) {
      console.log("response", response);
      photo.value = response.data;
    })
    .catch(function (error) {
      console.log("error", error);
    });
}


const selectedFile = ref(null);
function handleChange({ file }) {
  // 当选择文件时触发
  selectedFile.value = file;

  // 用户选择文件并点击“确定”后立即上传
  uploadPhoto();
}

async function uploadPhoto() {

  const formData = new FormData();
  formData.append('file', selectedFile.value.file); // `file` 属性包含实际文件

  try {
    const response = await axios.post(`/user/secure/profile-photo/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('更新成功', response.data);
    photo.value = response.data;
  } catch (error) {
    console.error('更新失敗', error);
  }

  axios.post(`/user/secure/profile-photo/${userId}`, formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  }
})
  .then(function(response){
    console.log(response.data);

  }).catch(function(error){
    console.log('error', error);
  })
}
</script>

<style scoped>
.main-content {
    margin-top: 20px;
}

.profile-section,
.details-section {
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 5px;
    margin-bottom: 20px;
    text-align: center;
    align-items: center;
}

.user-avatar img {
    width: 90px;
    height: 90px;
    border-radius: 50%;
}

.user-name {
    margin: 10px 0 5px;
    font-weight: bold;
}

.user-email {
    font-size: 0.9rem;
    color: #6c757d;
}

.about-section {
    text-align: center;
    margin-top: 20px;
}

.section-title {
    font-weight: bold;
    color: #007bff;
}

.form-control {
    margin-bottom: 15px;
}

.actions .btn {
    margin-left: 10px;
}

.gutters {
    margin-left: -15px;
    margin-right: -15px;
}

.gutters>.col-md-6 {
    padding-left: 15px;
    padding-right: 15px;
}
</style>