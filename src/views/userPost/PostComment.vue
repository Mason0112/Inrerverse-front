<template>
    <n-space vertical>
      <n-input
        v-model:comment="comment"
        type="textarea"
        placeholder="基本的 Textarea"
        />
        <n-button tertiary type="comment" @click="addcomment">
            留言
        </n-button>

      
    </n-space>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const comment=ref('')

  function addcomment(){
    
  }
  

  </script>