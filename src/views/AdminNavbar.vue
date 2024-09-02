<template>
  <nav>
    <ul>
      <li><a href="/">首页</a></li>
      <li><a href="/profile">个人资料</a></li>
      <li><a href="/settings">设置</a></li>
      <li><a class="nav-link" @click="logoutAdmin()">後台登出(暫放)</a></li>
    </ul>
  </nav>
</template>

<script setup>
import useAdminStore from '@/stores/adminStore'
import axios from '@/plugins/axios';

    const adminStore = useAdminStore();
function logoutAdmin() {
  adminStore.resetStore();
  axios.defaults.headers.authorization = '';
  axios.defaults.headers.common['X-User-ID'] = '';
}
</script>
    
<style>
    
</style>