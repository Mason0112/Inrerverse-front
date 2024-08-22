<template>
    <n-space vertical>
        <n-input
            type="textarea"
            placeholder="你在想什麼?"
            v-model:value="content"
        />
        <!-- <div>Content: {{ content }}</div> -->
        <n-upload
            action="/userPost/"
            :default-file-list="fileList"
            list-type="image-card"
        >
            上傳圖片
        </n-upload>
        <n-button tertiary @click="submit">提交</n-button>
    </n-space>
</template>

<script setup>
import { ref } from 'vue'
import axios from '@/plugins/axios'
import useUserStore from '@/stores/userstore';

const content = ref('')
const fileList = ref([])  

const userStore = useUserStore();

let userId = userStore.userId;

// 提交
async function submit() {
  const post={
    content : content.value,
    user:{
      id:userId
    }
  }
  try {
    await axios.post('/userPost', post)
    alert('提交成功')
    // console.log("123"+content.value)
  } catch (error) {
    console.error('提交失敗', error)
    alert('提交失敗!')
  }
}
</script>


    
<style>
    
</style>