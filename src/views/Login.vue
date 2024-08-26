<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
        <div class="card border-0 shadow rounded-3 my-5">
          <div class="card-body p-4 p-sm-5">

            <Vueform :display-errors="false" ref="form$" :endpoint="false">
              <StaticElement name="register_title" content="登入" tag="h1" />
              <StaticElement name="divider" tag="hr" />
              <TextElement name="accountNumber" label="帳號" rules="required" />
              <TextElement name="password" input-type="password" label="密碼" rules="required"/>
              <ButtonElement name="login" button-label="登入" align="center" size="lg" @click="login" :submits="true"/>
            </Vueform>

            <hr class="my-4" />
              <div class="d-grid mb-2">
                <button
                  class="btn btn-google text-uppercase fw-bold"
                  type="submit"
                >
                  <font-awesome-icon :icon="['fab', 'google']" /> 使用google登入
                </button>
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

const form$ = ref(null);

const router = useRouter();
const userStore = useUserStore();

let message = ref("");

function login() {
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
        //把登入者資訊塞給userStore供不同SFC使用
        userStore.setUserId(response.data.id);
        userStore.setNickname(response.data.nickname);
        userStore.setIsLoggedIn(true);
        userStore.setToken(response.data.token);

        // 把JWT塞到axios的headers裡
        axios.defaults.headers.authorization = "Bearer " + response.data.token;

        // 轉址到首頁
        router.push("/");

        // 登入失敗的邏輯
      } else {
        message.value = response.data.message;
      }
    })
    // 呼叫失敗的邏輯
    .catch(function (error) {
      console.log("error", error);
    });
}
</script>

<style>
.btn-google {
  color: white;
  background-color: grey;
}
</style>
