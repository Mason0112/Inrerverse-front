<template>
    <div class="centered-container">
    <div class="container">
      <div class="row">
        <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div class="card border-0 shadow rounded-3 my-5">
            <div class="card-body p-4 p-sm-5">
              <h2><b>後台登入</b></h2>
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
  import useAdminStore from "@/stores/adminStore"
  
  const form$ = ref(null);
  
  const router = useRouter();
  const adminStore = useAdminStore();

  function login() {
    const formInstance = form$.value;
    let request = {
      accountNumber: accountNumber.value,
      password: password.value,
    };
    axios
      .post("/admin/login", request)
      // 呼叫成功的邏輯
      .then(function (response) {
        console.log("response", response);

        if (response.status === 200) {
          //把登入者資訊塞給userStore供不同SFC使用
          adminStore.setUserId(response.data.id);
          adminStore.setAuthority(response.data.authority);
          adminStore.setNickname(response.data.nickname);
          adminStore.setIsLoggedIn(true);
          adminStore.setToken(response.data.token);
  
        //   把JWT塞到axios的headers裡
          axios.defaults.headers.authorization = "Bearer " + response.data.token;
  
        //   把id塞到axios的headers裡
          axios.defaults.headers.common['X-User-ID'] = response.data.id;
  
          // 轉址到首頁
          router.push("/admin/home");
        } 
      })

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
  