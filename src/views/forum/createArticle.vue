<template>
  <n-space vertical>
    <n-input v-model:value="title" type="text" placeholder="有創意的文章標題" />
    <n-input
      type="textarea"
      placeholder="大聲說出來你在想什麼?"
      v-model:value="content"
      :autosize="{
        minRows: 3
      }"
    />
    <n-upload
      ref="upload"
      :custom-request="customRequest"
      :default-file-list="fileList"
      list-type="image-card"
      @change="handleChange"
    >
      發文附圖是基本禮儀
    </n-upload>
    <n-button tertiary @click="submit">提交</n-button>
  </n-space>
</template>

<script setup>
import { ref } from 'vue'
import axios from '@/plugins/axios'
import useUserStore from '@/stores/userstore';

const content = ref('')
const title=ref('')
const fileList = ref([])  
const userStore = useUserStore();
const upload = ref(null)

const customRequest = ({ file, onFinish, onError }) => {
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

// 修改後的提交函數
async function submit() {
  try {
    console.log('Submitting article. Current userStore.userId:', userStore.userId);
    // 確保 userId 存在
    if (!userStore.userId) {
      console.error('User ID is missing');
      alert('User ID is missing. Please log in.');
      return;
      }
    // 創建 DTO 對象
    const articleDTO = {
      content: content.value,
      title: title.value,
      user:{
        id:userStore.userId
      },
    }
    // console.log('Article DTO:', articleDTO);

    const articleResponse = await axios.post('/club/article', articleDTO);
    const createdArticleId = articleResponse.data.id
    // console.log('Article created successfully:', articleResponse.data);

    // 上傳圖片，獲取 URL
    for (const file of fileList.value) {
      const formData = new FormData();
      formData.append('file', file.file);
      formData.append('articleId', createdArticleId)
      await axios.post('/club/articlePhoto', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    }
    const updatedArticle = await axios.get(`/club/article/${createdArticleId}`);
    console.log('Updated article:', updatedArticle.data);

    // 清空內容
    content.value = '';
    title.value = ''
    fileList.value = [];
    if (upload.value) {
      upload.value.clear();
    }

    alert('提交成功');
  } catch (error) {
    console.error('提交失敗', error);
    if (error.response) {
      // 服務器響應了，但狀態碼不在 2xx 範圍內
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
    } else if (error.request) {
      // 請求已經發出，但沒有收到響應
      console.error('No response received:', error.request);
    } else {
      // 在設置請求時發生了一些事情，觸發了錯誤
      console.error('Error message:', error.message);
    }
    alert('提交失敗: ' + (error.response?.data?.message || error.message));
  }
}
</script>

<style>
</style>