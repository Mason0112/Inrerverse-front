<template>
  <n-message-provider>
    <n-notification-provider>
      <n-dialog-provider>
        <div>
          <navbar></navbar>
          <navbarTest></navbarTest>
          </div>
          <div>
            <RouterView></RouterView>
          </div>
          </n-dialog-provider>
        </n-notification-provider>
      </n-message-provider>
</template>

<script setup>
import navbar from './views/navbar.vue';
import navbarTest from './views/navbarTest.vue';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'tocas/dist/tocas.min.css'
import { NMessageProvider, NNotificationProvider, NDialogProvider } from 'naive-ui'
import axios from '@/plugins/axios';
import useUserStore from '@/stores/userstore';

// 初始化應用時設置 axios headers，這是用來在重新整理f5的時候，不會丟失token的方法
const userStore = useUserStore();

if (userStore.token) {
  axios.defaults.headers.authorization = `Bearer ${userStore.token}`;
}

</script>

<style>
body {
  margin-top: 20px;
  background: #FAFAFA;
}
</style>