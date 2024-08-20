<template>
    <img :src="`${photo}`" alt="Profile Photo" />
    
    <Vueform ref="form$">
        <ButtonElement name="editProfile" button-label="編輯個人資料" :full="true" size="lg" @click="editProfile"/>
    </Vueform>
</template>
    
<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/plugins/axios';
import useUserStore from '@/stores/userstore';

const userStore = useUserStore();
let photo=ref("");

onMounted(function(){
    callFind();
})

let userId = userStore.userId;

function callFind() {

    Promise.all([
        axios.get(`/user/secure/${userId}`),
        axios.get(`/user/secure/profile-photo/${userId}`)
    ])
    .then(function([response1, response2]){
        console.log("response1",response1);
        console.log("response2", response2);

        photo = response2.data;

    })
    .catch(function(error){
        console.log("error", error);

    })
}
</script>
    
<style>
    
</style>