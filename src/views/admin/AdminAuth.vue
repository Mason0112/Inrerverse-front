<template>
    <div class="container">
      <div class="row">
        <div class="col-lg-10 col-xl-9 mx-auto">
          <input type="text" v-model="auth" required/>
          <button type="button" @click="submit">送出</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import axios from "@/plugins/axios";
  import { useRouter } from "vue-router";
  import { useMessage } from "naive-ui";
  import useAdminStore from "@/stores/adminStore"
  
  const router = useRouter();
  const adminStore = useAdminStore();
  const message = useMessage();
  const auth = ref('');
  
  function submit() {
    let request = {
      auth: auth.value
    };
  
    axios
      .post("/auth", request)
      .then(function (response) {
        console.log("Response:", response);
  
        if (response.status === 200) {  // 假設後端在認證成功時返回 200
          message.success("認證成功", {
            closable: true,
            duration: 5000,
          });
          adminStore.setToken(response.data);
          axios.defaults.headers.authorization = "Bearer " + response.data;
          axios.defaults.headers.common['X-User-ID'] = "interverse";
          router.push("/admin/login");
        }
      })
      .catch(function (error) {
        console.error("Error:", error);
        message.error("認證失敗，請重試");
      });
  }
  </script>