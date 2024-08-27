<template>
    <n-space vertical>
      <n-input
        v-model:value="commentText"
        type="textarea"
        placeholder="留下你的留言..."
        />
        <n-button tertiary type="comment" @click="addComment">
            留言
        </n-button>

      
    </n-space>
  </template>
  
  <script setup>
  import { ref , defineProps, defineEmits} from 'vue'
  import axios from '@/plugins/axios'
  import useUserStore from '@/stores/userstore';

  const props= defineProps({
    postId:{
      type:Number,
      required:true
    }
  })

  const emit = defineEmits(['comment-added'])

  const commentText=ref('')
  
  const userStore = useUserStore();
  let userId = userStore.userId;

  async function addComment() {
    if(!commentText.value.trim()) return;
  const commentData={
    userPost : {
      id:props.postId
    },
    user:{
      id:userId
    },
  comment:commentText.value
  }
  try {
    const response = await axios.post('/postComment', commentData)
    const newComment = response.data
    emit('comment-added', newComment)
    commentText.value='' //清空輸入框
  } catch (error) {
    console.error('留言失敗', error)
    alert('留言失敗!')
  }
}
  

  </script>