<template>
    <n-list hoverable clickable>
      <n-list-item>
        <n-thing title="相见恨晚" content-style="margin-top: 10px;">
          <template #description>
            <n-space size="small" style="margin-top: 4px">
              <n-tag :bordered="false" type="info" size="small">
                暑夜
              </n-tag>
              <n-tag :bordered="false" type="info" size="small">
                晚春
              </n-tag>
            </n-space>
          </template>
            <n-ellipsis style="max-width: 240px">
                住在我心里孤独的 孤独的海怪 痛苦之王 开始厌倦 深海的光 停滞的海浪
            </n-ellipsis>
        </n-thing>
        
        
      </n-list-item>
    </n-list>
  <div v-for="oneArticle in articleList" :key="oneArticle.id">
    <n-list hoverable clickable>
      <n-list-item>
        <n-thing title="相见恨晚" content-style="margin-top: 10px;">
          <template #description>
            <n-space size="small" style="margin-top: 4px">
              <n-tag :bordered="false" type="info" size="small">
                <!-- hashtag -->
              </n-tag>

            </n-space>
          </template>
            <n-ellipsis style="max-width: 240px">
                {{oneArticle.content}}
            </n-ellipsis>
        </n-thing>
        
        
      </n-list-item>
    </n-list>
  
  </div>
  </template>
    
<script setup>
  import {onMounted, ref, inject } from "vue";
  import axios from '@/plugins/axios';
  import useUserStore from '@/stores/userstore';
  import { useMessage } from 'naive-ui'

  const userStore = useUserStore();
  const userId = userStore.userId;
  const userNickname=userStore.nickname
  const articleList = ref([])

  onMounted(function(){
    showClubArticleList(clubId)
  })

  //渲染article
async function showClubArticleList(clubId) {
  try{
    const response = await axios.get(`/club/article/${clubId}`);
    articleList.value=response.data;
    // await Promise.all(articleList.value.map(article=> fetchComment(article.id)));
    //await checkLikeStatus();

  }catch(error){
    console.error("Error fetching club articles:", error);
    message.error("Failed to fetch articles");
  }
}


</script>
    
<style>
    
</style>