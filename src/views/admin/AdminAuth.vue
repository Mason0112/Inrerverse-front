<template>
  <div class="admin-auth-container">
    <div class="admin-auth-content">
      <h1 class="admin-auth-title">IYKYK</h1>
        <input type="text" v-model="auth" required class="admin-auth-input" placeholder="請輸入通關密語">
        <button type="button" @click="submit" class="admin-auth-button">送出</button>
      </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "@/plugins/axios";
import { useRouter } from "vue-router";
import { useMessage } from "naive-ui";
import useAdminStore from "@/stores/adminStore";
import useUserStore from "@/stores/userstore";

const router = useRouter();
const adminStore = useAdminStore();
const userStore = useUserStore();
const message = useMessage();
const auth = ref("");

function submit() {
  let request = {
    auth: auth.value,
  };

  axios
    .post("/auth", request)
    .then(function (response) {
      console.log("Response:", response);

      if (response.status === 200) {
        // 假設後端在認證成功時返回 200
        message.success("認證成功", {
          closable: true,
          duration: 5000,
        });

        //先把其他東西清空
        userStore.resetStore();
        axios.defaults.headers.authorization = "";
        axios.defaults.headers.common["X-User-ID"] = "";

        adminStore.setToken(response.data);
        axios.defaults.headers.authorization = "Bearer " + response.data.token;
        axios.defaults.headers.common["X-User-ID"] = response.data.id;
        router.push("/admin/login");
      }
    })
    .catch(function (error) {
      console.error("Error:", error);
      message.error("認證失敗，請重試");
    });
}
</script>

<style scoped>
.admin-auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #1a202c; /* 深蓝灰色背景 */
  color: #e2e8f0; /* 浅色文字 */
}

.admin-auth-content {
  text-align: center;
  background-color: #2d3748; /* 稍微浅一点的背景色 */
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.admin-auth-title {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: bold;
}

.admin-auth-input {
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  width: 100%;
  max-width: 300px;
  background-color: #4a5568; /* 输入框背景色 */
  color: #e2e8f0;
  border: 1px solid #718096;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.admin-auth-input:focus {
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
}

.admin-auth-button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  background-color: #4299e1; /* 蓝色按钮 */
  color: white;
  border: none;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.admin-auth-button:hover {
  background-color: #3182ce; /* 悬停时稍深的蓝色 */
}

.admin-auth-button:active {
  background-color: #2b6cb0; /* 点击时更深的蓝色 */
}
</style>
