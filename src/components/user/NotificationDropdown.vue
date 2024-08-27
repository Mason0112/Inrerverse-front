<template>
    <li class="nav-item dropdown" @click="fetchNotifications">
      <n-badge :value="notifications.length" :max="15">
        <a class="nav-link dropdown-toggle" href="#" id="notificationDropdown" role="button"
           @click="toggleDropdown" aria-expanded="dropdownVisible">
          <font-awesome-icon :icon="['far', 'bell']" />
        </a>
      </n-badge>
      <ul class="dropdown-menu" :class="{ 'show': dropdownVisible }" aria-labelledby="notificationDropdown">
        <li v-if="notifications.length === 0" class="dropdown-item text-muted">沒有新通知</li>
        <li v-for="(notification, index) in notifications" :key="index" class="dropdown-item">
          {{ notification.message }}
        </li>
      </ul>
    </li>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  
  const notifications = ref([]);
  const dropdownVisible = ref(false);
  
  // 模拟 API 调用
  async function fetchNotifications() {
    try {
      const response = await axios.get('/api/notifications'); // 调用你的 API
      notifications.value = response.data; // 假设返回的数组格式为 [{ message: '...' }, ...]
    } catch (error) {
      console.error('获取通知失败:', error);
    }
  }
  
  function toggleDropdown(event) {
    event.stopPropagation(); // 阻止事件冒泡以避免意外关闭
    dropdownVisible.value = !dropdownVisible.value;
  }
  
  // 关闭下拉菜单的监听
  document.addEventListener('click', () => {
    dropdownVisible.value = false;
  });
  </script>
  
  <style scoped>
  .dropdown-menu {
    max-height: 300px;
    overflow-y: auto;
  }
  
  .dropdown-menu.show {
    display: block;
  }
  
  .nav-link {
    cursor: pointer;
  }

  .navbar .dropdown-toggle::after {
  display: none; /* 隱藏 Bootstrap 生成的下拉箭頭 */
}
  </style>
  