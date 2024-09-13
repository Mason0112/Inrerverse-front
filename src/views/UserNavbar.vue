<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light mt-4">
    <div class="container-fluid">
      <RouterLink class="navbar-brand" :to="{ name: 'home-link' }"><img src="/interverse navlogo.png" width="100px"></RouterLink>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav">
          <li class="nav-item">
            <RouterLink class="nav-link active" aria-current="page" :to="{ name: 'home-link' }">首頁</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" :to="{ name: 'post-create-link' }">新增動態(暫放)</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" :to="{ name: 'club-all-link' }">俱樂部</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" :to="{ name: 'event-all-link' }">工作坊</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" :to="{ name: 'product-cart' }">商城</RouterLink>
          </li>
          <!-- <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button"
            @mouseenter="openDropdown('club')" @mouseleave="closeDropdown('club')" aria-expanded="dropdownStates.club">
              靖緯(暫放) <font-awesome-icon :icon="['fas', 'caret-down']" :class="{ 'rotate': dropdownStates.club }" />
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink" :class="{ 'show': dropdownStates.club }" @mouseenter="openDropdown('club')" @mouseleave="closeDropdown('club')">
              <li><RouterLink class="dropdown-item" :to="{ name: 'club-all-link' }" @click="closeDropdown('club')">俱樂部
              </RouterLink></li>
              <li><RouterLink class="dropdown-item" :to="{ name: 'club-approve-link' }" @click="closeDropdown('club')">我創建的俱樂部
              </RouterLink></li>
              <li><RouterLink class="dropdown-item" :to="{ name: 'club-my-link' }" @click="closeDropdown('club')">我的俱樂部
              </RouterLink></li>
              <li><RouterLink class="dropdown-item" :to="{ name: 'club-favorite-link' }" @click="closeDropdown('club')">收藏
              </RouterLink></li>
              <li><RouterLink class="dropdown-item" :to="{ name: 'event-all-link' }" @click="closeDropdown('club')">工作坊
              </RouterLink></li>
              <li><RouterLink class="dropdown-item" :to="{ name: 'event-approve-link' }" @click="closeDropdown('club')">我主辦的活動/工作坊
              </RouterLink></li>
              <li><RouterLink class="dropdown-item" :to="{ name: 'event-my-link' }" @click="closeDropdown('club')">我參加的活動/工作坊
              </RouterLink></li>
            </ul>
          </li> -->
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="anotherDropdownMenuLink" role="button"
            @mouseenter="openDropdown('settings')" @mouseleave="closeDropdown('settings')" aria-expanded="dropdownStates.settings">
              勁甫(暫放) <font-awesome-icon :icon="['fas', 'caret-down']" :class="{ 'rotate': dropdownStates.settings }" />
            </a>
            <ul class="dropdown-menu" aria-labelledby="anotherDropdownMenuLink"
              :class="{ 'show': dropdownStates.settings }" @mouseenter="openDropdown('settings')" @mouseleave="closeDropdown('settings')">
              <li><RouterLink class="dropdown-item" :to="{ name: 'post-create-link' }" @click="closeDropdown('settings')">新增動態
              </RouterLink></li>
              <li><RouterLink class="dropdown-item" :to="{ name: 'user-post-link' }" @click="closeDropdown('settings')">動態牆
              </RouterLink></li>
              <RouterLink 
                class="dropdown-item" 
                :to="{ name: 'user-post-link', params: { id: currentUserId } }" 
                @click="closeDropdown('settings')"
                >
                我的動態牆
              </RouterLink>
              <li><RouterLink class="dropdown-item" :to="{ name: 'club-forum' }" @click="closeDropdown('settings')">論壇
              </RouterLink></li>
              <li><RouterLink class="dropdown-item" :to="{ name: 'club-addArticle' }" @click="closeDropdown('settings')">新增文章
              </RouterLink></li>
            </ul>
          </li>
          <!-- Other items -->
        </ul>

        <ul class="navbar-nav ms-auto">
          <li class="nav-item dropdown me-2">
            <a class="nav-link dropdown-toggle" href="#" id="anotherDropdownMenuLink" role="button"
            @mouseenter="openDropdown('person')" @mouseleave="closeDropdown('person')" 
            aria-expanded="dropdownStates.person" v-show="userStore.isLoggedIn">
              <font-awesome-icon :icon="['fas', 'user']" /> <font-awesome-icon :icon="['fas', 'caret-down']" :class="{ 'rotate': dropdownStates.person }" />
            </a>
            <ul class="dropdown-menu" aria-labelledby="anotherDropdownMenuLink"
              :class="{ 'show': dropdownStates.person }" @mouseenter="openDropdown('person')" @mouseleave="closeDropdown('person')">
              <RouterLink class="dropdown-item" :to="{ name: 'profile-link' }" @click="closeDropdown('person')">會員詳細
              </RouterLink>
              <RouterLink class="dropdown-item" :to="{ name: 'friend-link' }" @click="closeDropdown('person')">我的好友列表
              </RouterLink>
              <RouterLink class="dropdown-item" :to="{ name: 'friend-request-link' }" @click="closeDropdown('person')">我的好友邀請列表
              </RouterLink>
              <RouterLink class="dropdown-item" :to="{ name: 'user-orders' }" @click="closeDropdown('person')">我的訂單紀錄
              </RouterLink>
              <RouterLink class="dropdown-item" :to="{ name: 'club-my-link' }" @click="closeDropdown('club')">我的俱樂部
              </RouterLink>
              <RouterLink class="dropdown-item" :to="{ name: 'club-approve-link' }" @click="closeDropdown('club')">俱樂部審核
              </RouterLink>
              <RouterLink class="dropdown-item" :to="{ name: 'event-approve-link' }" @click="closeDropdown('club')">我主辦的活動/工作坊
              </RouterLink>
              <RouterLink class="dropdown-item" :to="{ name: 'event-my-link' }" @click="closeDropdown('club')">我參加的活動/工作坊
              </RouterLink>
              <li><a class="dropdown-item" @click="logout(); closeDropdown('person')">登出</a></li>
            </ul>
          </li>
          <li class="nav-item me-2" >
            <!-- <n-badge :value="notiValue" :max="15" v-show="userStore.isLoggedIn">
              <RouterLink class="nav-link" :to="{ name: 'notification-link' }" v-show="userStore.isLoggedIn">
                <font-awesome-icon :icon="['far', 'bell']" />
              </RouterLink>
            </n-badge> -->
            <div v-show="userStore.isLoggedIn">
              <NotificationDropdown></NotificationDropdown>
            </div>
          </li>
          <li class="nav-item me-2">
            <n-badge :value="cartValue" :max="15" v-show="userStore.isLoggedIn">
              <RouterLink class="nav-link" :to="{ name: 'cart-user' }" v-show="userStore.isLoggedIn">
                <font-awesome-icon :icon="['fas', 'cart-shopping']"  />
              </RouterLink>
            </n-badge>
          </li>


          <li class="nav-item">
            <RouterLink class="nav-link" :to="{ name: 'login-link' }" v-show="!userStore.isLoggedIn">
              <font-awesome-icon :icon="['fas', 'sign-in-alt']" /> 登入
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" :to="{ name: 'register-link' }" v-show="!userStore.isLoggedIn">
              <font-awesome-icon :icon="['fas', 'user-plus']" /> 註冊
            </RouterLink>
          </li>


        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { onMounted, ref,computed } from 'vue';
import useUserStore from '@/stores/userstore';
import axios from '@/plugins/axios';
import { useCartStore } from '@/stores/cartStore';

import NotificationDropdown from '@/components/user/NotificationDropdown.vue';

const cartStore = useCartStore();

const cartValue = computed(() => cartStore.cartItemCount);

onMounted(() => {
  cartStore.initializeCartCount();
});






const dropdownStates = ref({
  club: false,
  settings: false,
  person: false
});

function openDropdown(menu) {
  dropdownStates.value[menu] = true;
}

function closeDropdown(menu) {
  dropdownStates.value[menu] = false;
}

const userStore = useUserStore();
const currentUserId = computed(() => userStore.userId);
function logout() {
  userStore.resetStore();
  axios.defaults.headers.authorization = '';
  axios.defaults.headers.common['X-User-ID'] = '';
}

</script>


<style scoped>
.arrow {
  font-size: 0.75em;
  /* Adjust the size of the arrow */
}

.rotate {
  transform: rotate(180deg);
  /* Rotate the arrow when the dropdown is open */
  transition: transform 0.5s ease; /* 增加旋轉時間到0.5秒 */
}

.dropdown-item {
  padding: 10px 20px;
  color: #000;
}

.dropdown-item:hover {
  background-color: #f1f1f1;
}

.dropdown-toggle::after {
  display: none;
  /* Hide default Bootstrap dropdown arrow */
}

.dropdown-toggle {
  display: flex;
  align-items: center;
  gap: 4px;
  /* Adjust the gap between the text and the icon */
}

.dropdown-menu {
  display: block;
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s ease-out, opacity 0.3s ease-out;
  opacity: 0;
}

.dropdown-menu.show {
  max-height: 400px; /* 根據實際內容調整此值 */
  opacity: 1;
}

.dropdown-toggle .fa-caret-down {
  transition: transform 0.5s ease; /* 確保非旋轉狀態也有相同的過渡效果 */
}

/* 添加淡入淡出效果 */
.dropdown-menu {
  transition: max-height 0.5s ease-out, opacity 0.3s ease-out, visibility 0s 0.5s;
  visibility: hidden;
}

.dropdown-menu.show {
  transition: max-height 0.5s ease-in, opacity 0.3s ease-in, visibility 0s;
  visibility: visible;
}

/* 確保下拉菜單不會超出視窗 */
.navbar-nav .dropdown-menu {
  right: 0;
  left: auto;
  max-width: 200px; /* 調整此值以適應您的需求 */
  width: max-content;
}

/* 為長文字項添加省略號 */
.navbar-nav .dropdown-item {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 確保下拉菜單在小屏幕上也能正確顯示 */
@media (max-width: 991.98px) {
  .navbar-nav .dropdown-menu {
    position: static;
    float: none;
    width: auto;
    margin-top: 0;
    background-color: transparent;
    border: 0;
    box-shadow: none;
  }
}

</style>