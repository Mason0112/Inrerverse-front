<template>
    <Vueform ref="form$">
        <ButtonElement name="editProfile" button-label="編輯個人資料" :full="true" size="lg" @click="editProfile"/>
    </Vueform>

</template>
    
<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/plugins/axios';
import useUserStore from '@/stores/userstore';

const userStore = useUserStore();


onMounted(function(){
    callFind();
})

let userId = userStore.userId;

function callFind() {
    axios.get(`/user/secure/${userId}`)
    .then(function(response){
        console.log("response",response);

    })
    .catch(function(error){
        console.log("error", error);

    })
}
</script>
    
<style>
    
</style>