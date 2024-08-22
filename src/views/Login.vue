<template>
        <div class="container">
                <Vueform :display-errors="false" ref="form$" :endpoint="false">
                        <TextElement name="accountNumber" placeholder="請輸入帳號" label="帳號" rules="required"/>
                        <TextElement name="password" input-type="password" placeholder="請輸入密碼" label="密碼" rules="required"/>
                        <ButtonElement name="login" button-label="登入" :full="true" size="lg" @click="login" :submits="true"/>
                </Vueform>
        </div>

</template>

<script setup>
import { ref } from 'vue'
import axios from '@/plugins/axios';
import  { useRouter } from 'vue-router';
import useUserStore from '@/stores/userstore';

const form$ = ref(null);

const router = useRouter();
const userStore = useUserStore();

function login() {
        let request={
                accountNumber: accountNumber.value,
                password: password.value
        }
        axios.post("/user/login",request)
        // 呼叫成功的邏輯
        .then(function(response){
                console.log("response", response);
                // 登入成功的邏輯
                if (response.data.success){
                        //把登入者資訊塞給userStore供不同SFC使用
                        userStore.setUserId(response.data.id);
                        userStore.setNickname(response.data.nickname);
                        userStore.setIsLoggedIn(true);
                        
                        // 把JWT塞到axios的headers裡
                        axios.defaults.headers.authorization = 'Bearer '+response.data.token;

                        // 轉址到首頁
                        router.push("/");

                // 登入失敗的邏輯
                } else {

                }

        })
        // 呼叫失敗的邏輯
        .catch(function(error){
                console.log("error", error);

        });
}

</script>

<style></style>