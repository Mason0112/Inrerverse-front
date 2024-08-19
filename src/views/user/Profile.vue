<template>
    <Vueform ref="form$">
        <ButtonElement name="editProfile" button-label="編輯個人資料" :full="true" size="lg" @click="editProfile"/>
    </Vueform>
</template>
    
<script setup>
    import { ref, onMounted } from 'vue'
import axios from '@/plugins/axios';
import  { useRouter } from 'vue-router';

onMounted(function(){
    callFind();
})

function callFind() {
    //準備呼叫一支需登入才看得到的api
}
</script>
    
<style>
    
</style>