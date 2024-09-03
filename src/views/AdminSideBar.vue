<template>
  <div class="sidebar">
    <div class="user-info">
      <img src="" alt="User Avatar" class="avatar" />
      <span class="email">{{ nickname }}</span>
    </div>
    <nav>
      <RouterLink to="/admin/home" class="nav-item">
        <font-awesome-icon :icon="['fas', 'house']" />
        首頁
      </RouterLink>
      <RouterLink to="/admin/home" class="nav-item">
        <i class="icon icon-star"></i>
        Starred
      </RouterLink>
      <RouterLink to="/admin/home" class="nav-item">
        <i class="icon icon-sent"></i>
        Sent Mail
      </RouterLink>


      <div class="dropdown">
        <div class="dropdown-header" @click="toggleCategory('HumanResources')">
          人資管理
          <font-awesome-icon
            :icon="['fas', 'caret-down']"
            :class="{ 'icon-rotated': isOpen('HumanResources') }"
            class="dropdown-icon"
          />
        </div>
        <div v-if="isOpen('HumanResources')" class="dropdown-content">
          <RouterLink to="/admin/register" class="nav-item">
            新增會員
          </RouterLink>
          <RouterLink to="/admin/register" class="nav-item">
            Updates
          </RouterLink>
          <RouterLink to="/admin/register" class="nav-item">
            Forums
          </RouterLink>
        </div>
      </div>

      <div class="dropdown">
        <div class="dropdown-header" @click="toggleCategory('Product')">
          商品管理
          <font-awesome-icon
            :icon="['fas', 'caret-down']"
            :class="{ 'icon-rotated': isOpen('Product') }"
            class="dropdown-icon"
          />
        </div>
        <div v-if="isOpen('Product')" class="dropdown-content">
          <RouterLink to="/product/product" class="nav-item">
            產品頁
          </RouterLink>
          <RouterLink to="/product/category" class="nav-item">
            類別頁
          </RouterLink>
        </div>
      </div>

      <div class="dropdown">
        <div class="dropdown-header" @click="toggleCategory('More')">
          會員
          <font-awesome-icon
            :icon="['fas', 'caret-down']"
            :class="{ 'icon-rotated': isOpen('More') }"
            class="dropdown-icon"
          />
        </div>
        <div v-if="isOpen('More')" class="dropdown-content">
          <RouterLink to="/admin/home" class="nav-item">
            <i class="icon icon-all-mail"></i>
            All Mail
          </RouterLink>
          <RouterLink to="/admin/home" class="nav-item">
            <i class="icon icon-social"></i>
            Social
          </RouterLink>
          <RouterLink to="/admin/home" class="nav-item">
            <i class="icon icon-promo"></i>
            Promo
          </RouterLink>
          <a class="nav-item" @click="logoutAdmin()">登出</a>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import useAdminStore from "@/stores/adminStore";
import axios from "@/plugins/axios";

const adminStore = useAdminStore();

let nickname = adminStore.nickname;

//掛載時直接確認是否有權限參訪此navbar
async function checkPermission() {
  try {
    const response = await axios.get("/admin/void");
    if (response.status === 200) {
      console.log("權限檢查:", response.data);
    }
  } catch (error) {
    adminStore.setAdminId("");
    console.error("權限檢查:", error);
  }
}

onMounted(() => {
  checkPermission();
});

function logoutAdmin() {
  adminStore.resetStore();
  axios.defaults.headers.authorization = "";
  axios.defaults.headers.common["X-User-ID"] = "";
}

//下面開始是控制樣式
const openCategories = ref(new Set());

const toggleCategory = (categoryName) => {
  if (openCategories.value.has(categoryName)) {
    openCategories.value.delete(categoryName);
  } else {
    openCategories.value.add(categoryName);
  }
};

const isOpen = (categoryName) => openCategories.value.has(categoryName);

</script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: #f5f5f5;
  padding: 20px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  overflow-y: auto;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.email {
  font-size: 14px;
  color: #333;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 10px;
  color: #333;
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 5px;
}

.nav-item:hover {
  background-color: #e0e0e0;
}

@media (max-width: 768px) {
  .sidebar {
    width: 200px;
  }
}
.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.email {
  font-size: 14px;
  color: #333;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 10px;
  color: #333;
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 5px;
}

.nav-item:hover {
  background-color: #e0e0e0;
}

.icon {
  margin-right: 10px;
}

.dropdown {
  margin-top: 10px;
}

.dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 10px;
  font-size: 14px;
}

.dropdown-icon {
  transition: transform 0.3s ease;
}

.icon-rotated {
  transform: rotate(180deg);
}

.dropdown-content {
  margin-left: 20px;
}

.dropdown-content .nav-item {
  padding-left: 20px;
}
</style>
