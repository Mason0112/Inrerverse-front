<template>
    <div>
      <navbar></navbar>

    </div>
    <RouterView></RouterView>
</template>
  
<script setup>
  import navbar from './views/navbar.vue';


  import 'bootstrap/dist/css/bootstrap.min.css';
  import 'bootstrap/dist/js/bootstrap.bundle.min.js';

  import axios from '@/plugins/axios';
  import useUserStore from '@/stores/userstore';

  // 初始化應用時設置 axios headers，這是用來在重新整理f5的時候，不會丟失token的方法
  const userStore = useUserStore();

  if (userStore.token) {
    axios.defaults.headers.authorization = `Bearer ${userStore.token}`;
  }

</script>
  
<style>
  
</style>