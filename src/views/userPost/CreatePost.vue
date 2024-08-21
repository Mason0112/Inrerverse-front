<template>
    <n-space vertical>
        <n-input
            type="textarea"
            placeholder="你在想什麼?"
            v-model="content"
        />
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
// 响应式变量
const content = ref('')
const fileList = ref([])  // 这里不指定类型，直接使用空数组

const userStore = useUserStore();

let userId = userStore.userId;

// 提交函数
async function submit() {
  try {
    await axios.post('/userPost', 
    { text: content.value,
        userId: userId
     })
    alert('提交成功')
  } catch (error) {
    console.error('提交失敗', error)
    alert('提交失敗!')
  }
}
</script>


    
<style>
    
</style>