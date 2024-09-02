<template>
  <n-config-provider>
    <n-dialog-provider>
      <n-message-provider>
        <div>
          <AdminNavbar v-if="isAdmin"></AdminNavbar>
          <UserNavbar v-else></UserNavbar>
        </div>
        <div>
          <RouterView></RouterView>
        </div>
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<script setup>
import UserNavbar from './views/UserNavbar.vue';
import AdminNavbar from './views/AdminNavbar.vue';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'tocas/dist/tocas.min.css'
import { NConfigProvider, NMessageProvider, NDialogProvider } from 'naive-ui'

import { computed } from 'vue'
import axios from '@/plugins/axios';
import useUserStore from '@/stores/userstore';
import useAdminStore  from '@/stores/adminStore'

// 初始化應用時設置 axios headers，這是用來在重新整理f5的時候，不會丟失token的方法
const adminStore = useAdminStore();

if (adminStore.token) {
  axios.defaults.headers.authorization = `Bearer ${adminStore.token}`;
}

if (adminStore.adminId) {
  axios.defaults.headers.common['X-User-ID'] = adminStore.adminId;
}

const isAdmin = computed(() => {
  return adminStore.adminId !== ''
})

// 初始化應用時設置 axios headers，這是用來在重新整理f5的時候，不會丟失token的方法
const userStore = useUserStore();

if (userStore.token) {
  axios.defaults.headers.authorization = `Bearer ${userStore.token}`;
}

if (userStore.userId) {
  axios.defaults.headers.common['X-User-ID'] = userStore.userId;
}

</script>

<style>
body {
  margin-top: 20px;
  background: #FAFAFA;
}
</style>