<template>
  <div class="centered-container">
  <div class="container">
    <div class="row">
      <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
        <div class="card border-0 shadow rounded-3 my-5">
          <div class="card-body p-4 p-sm-5">
            <h2><b>登入</b></h2>
            <p>還沒有帳號嗎？
              <RouterLink class="bold-link" :to="{ name: 'register-link' }"> 點我註冊</RouterLink>
            </p>
            <a class="btn btn-outline-dark w-100" href="#">
                    <span class="d-flex justify-content-center align-items-center">
                      <img class="avatar me-2" src="../assets/google-icon.svg" alt="Image Description">
                      使用google登入
                    </span>
                  </a>
            <hr />

            <Vueform :display-errors="false" ref="form$" :endpoint="false">
              <TextElement name="accountNumber" label="帳號" rules="required" />
              <TextElement name="password" input-type="password" label="密碼" rules="required"/>

              <ButtonElement name="login" button-label="登入" align="center" size="lg" @click="login" :submits="true"/>
            </Vueform>
          </div>

        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref } from "vue";
import axios from "@/plugins/axios";
import { useRouter } from "vue-router";
import useUserStore from "@/stores/userstore";
import useAdminStore from '@/stores/adminStore'

const form$ = ref(null);

const router = useRouter();
const userStore = useUserStore();
const adminStore = useAdminStore();



function login() {
  const formInstance = form$.value;
  let request = {
    accountNumber: accountNumber.value,
    password: password.value,
  };
  axios
    .post("/user/login", request)
    // 呼叫成功的邏輯
    .then(function (response) {
      console.log("response", response);
      // 登入成功的邏輯
      if (response.data.success) {
        //先把其他東西清空
        adminStore.resetStore();
        axios.defaults.headers.authorization = "";
        axios.defaults.headers.common["X-User-ID"] = "";

        //把登入者資訊塞給userStore供不同SFC使用
        userStore.setUserId(response.data.id);
        userStore.setNickname(response.data.nickname);
        userStore.setIsLoggedIn(true);
        userStore.setToken(response.data.token);

        // 把JWT塞到axios的headers裡
        axios.defaults.headers.authorization = "Bearer " + response.data.token;

        // 把id塞到axios的headers裡
        axios.defaults.headers.common['X-User-ID'] = response.data.id;

        // 轉址到首頁
        router.push("/");

        // 登入失敗的邏輯
      } else {
        formInstance
              .el$("accountNumber")
              .messageBag.append("您輸入的帳號或密碼錯誤", "error");
              formInstance
              .el$("password")
              .messageBag.append("您輸入的帳號或密碼錯誤", "error");
      }
    })
    // 呼叫失敗的邏輯
    .catch(function (error) {
      console.log("error", error);
      formInstance
              .el$("accountNumber")
              .messageBag.append("您輸入的帳號或密碼錯誤", "error");
              formInstance
              .el$("password")
              .messageBag.append("您輸入的帳號或密碼錯誤", "error");
    });
}
</script>

<style scoped>
.centered-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding-top: 10vh;  /* 添加頂部內邊距 */
  background-color: #f8f9fa;
}

.bold-link {
  font-weight: bold;
  color: black;
  text-decoration: none;
}

.avatar {
    position: relative;
    display: inline-block;
    width: 1rem;
    height: 1rem;
    border-radius: .3125rem;
}
@media (max-width: 576px) {
  .card-body {
    padding: 2rem !important;
  }
  .centered-container {
    padding-top: 5vh;  /* 在小屏幕上減少頂部內邊距 */
  }
}
</style>
