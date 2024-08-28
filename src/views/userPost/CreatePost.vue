<template>
    <n-space vertical>
        <n-input
            type="textarea"
            placeholder="你在想什麼?"
            v-model:value="content"
        />
        <n-upload
            ref="upload"
            :custom-request="customRequest"
            :default-file-list="fileList"
            list-type="image-card"
            @change="handleChange"
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
const postId=ref(null)
const upload=ref(null)

const customRequest=({file, onFinish, onError}) =>{
  const reader = new FileReader();
  reader.readAsDataURL(file.file);
  reader.onload = () => {
    file.url = reader.result;
    onFinish();
  }
  reader.onerror = (error) => {
    onError(error)
  }
}

const handleChange = (options) => {
  fileList.value = options.fileList
}

// 提交
async function submit() {
  try {
    //貼文
  const postResponse = await axios.post('/userPost', {
    content:content.value,
    user:{
      id:userId
    }
  }) 
  const postId = postResponse.data.id
  
  //圖片
  for(const file of fileList.value){
    const formData = new FormData();
    formData.append('file', file.file);
    formData.append('postId', postId)

    await axios.post('/postPhoto', formData,{
      headers:{
        'Content-Type': 'multipart/form-data'
      }
    })
  }
  alert('提交成功');
  //清空內容
  content.value='';
  fileList.value=[];
  if(upload.value){
    upload.value.clear()
  }
}catch(error){
  console.error('提交失敗', error);
  alert('提交失敗!');
}
}

</script>
<style>
</style>