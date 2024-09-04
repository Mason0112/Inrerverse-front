<template>
  <li v-if="isLoggedIn" class="nav-item dropdown">
    <n-badge :value="displayCount" :max="99">
      <a class="nav-link dropdown-toggle" href="#" id="notificationDropdown" role="button"
         @click="handleBellClick" aria-expanded="dropdownVisible">
        <font-awesome-icon :icon="['far', 'bell']" />
      </a>
    </n-badge>
    <ul class="dropdown-menu" :class="{ 'show': dropdownVisible }" aria-labelledby="notificationDropdown">
      <li v-if="isLoading" class="dropdown-item text-muted">加載中...</li>
      <li v-else-if="error" class="dropdown-item text-danger">{{ error }}</li>
      <li v-else-if="notifications.length === 0" class="dropdown-item text-muted">沒有新通知</li>
      <li v-for="notification in notifications" :key="notification.id" class="dropdown-item">
        {{ notification.content }}
      </li>
    </ul>
  </li>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import axios from "@/plugins/axios";
import useUserStore from "@/stores/userstore";

const userStore = useUserStore();
const isLoggedIn = computed(() => userStore.isLoggedIn);
const userId = computed(() => userStore.userId);

const notifications = ref([]);
const unreadCount = ref(0);
const dropdownVisible = ref(false);
const pollingInterval = ref(null);
const isPolling = ref(false);
const isLoading = ref(false);
const error = ref(null);

const displayCount = computed(() => unreadCount.value);

async function fetchNotifications() {
  if (!isPolling.value || !isLoggedIn.value) return;
  isLoading.value = true;
  error.value = null;
  try {
    const response = await axios.get(`/notification/${userId.value}`);
    notifications.value = response.data;
    unreadCount.value = notifications.value.filter(n => !n.status).length;
    localStorage.setItem('notificationCount', unreadCount.value.toString());
  } catch (err) {
    console.error('Failed to fetch notifications:', err);
    if (err.response && err.response.status === 404) {
      error.value = "無法獲取通知，請稍後再試";
    } else {
      error.value = "發生錯誤，請稍後再試";
    }
  } finally {
    isLoading.value = false;
  }
}

async function fetchNotificationCount() {
  if (!isLoggedIn.value) return;
  try {
    const response = await axios.get(`/notification/count/${userId.value}`);
    unreadCount.value = response.data;
    localStorage.setItem('notificationCount', unreadCount.value.toString());
  } catch (err) {
    console.error('Failed to fetch notification count:', err);
  }
}

function handleBellClick(event) {
  event.stopPropagation();
  dropdownVisible.value = !dropdownVisible.value;
  if (dropdownVisible.value && isLoggedIn.value) {
    fetchNotifications();
  }
}

function startPolling() {
  if (isPolling.value || !isLoggedIn.value) return;
  isPolling.value = true;
  pollingInterval.value = setInterval(fetchNotifications, 30000); // 每30秒輪詢一次
}

function stopPolling() {
  isPolling.value = false;
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value);
  }
}

let userActivityTimeout;
function resetUserActivityTimer() {
  clearTimeout(userActivityTimeout);
  userActivityTimeout = setTimeout(() => {
    stopPolling();
  }, 300000); // 5分鐘無活動後停止輪詢
}

function handleUserActivity() {
  resetUserActivityTimer();
  if (!isPolling.value && isLoggedIn.value) {
    startPolling();
  }
}

function handleVisibilityChange() {
  if (document.hidden) {
    stopPolling();
  } else if (isLoggedIn.value) {
    startPolling();
  }
}

function handleOnline() {
  if (isLoggedIn.value) {
    startPolling();
  }
}

function handleOffline() {
  stopPolling();
}

function closeDropdown(event) {
  if (!event.target.closest('.dropdown')) {
    dropdownVisible.value = false;
  }
}

onMounted(async () => {
  if (isLoggedIn.value) {
    await fetchNotificationCount(); // 初始只獲取數量
    startPolling(); // 開始輪詢完整通知
  }
  
  document.addEventListener('click', closeDropdown);
  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  ['mousemove', 'keypress', 'scroll', 'click'].forEach(event => {
    document.addEventListener(event, handleUserActivity);
  });
  
  resetUserActivityTimer();
});

onUnmounted(() => {
  stopPolling();
  
  document.removeEventListener('click', closeDropdown);
  document.removeEventListener('visibilitychange', handleVisibilityChange);
  window.removeEventListener('online', handleOnline);
  window.removeEventListener('offline', handleOffline);
  
  ['mousemove', 'keypress', 'scroll', 'click'].forEach(event => {
    document.removeEventListener(event, handleUserActivity);
  });
  
  clearTimeout(userActivityTimeout);
});

watch(isLoggedIn, async (newValue) => {
  if (newValue) {
    await fetchNotificationCount();
    startPolling();
  } else {
    stopPolling();
    notifications.value = [];
    unreadCount.value = 0;
    error.value = null;
    localStorage.removeItem('notificationCount');
  }
});

watch(() => userStore.route, (newRoute) => {
  if (isLoggedIn.value) {
    stopPolling();
    startPolling();
  }
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