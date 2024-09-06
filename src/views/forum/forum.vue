<template>
  <div v-for="oneArticle in articleList" :key="oneArticle.id">
      <n-list hoverable clickable>
        <n-list-item @click="enterArticle(oneArticle.id)">
          <n-thing :title="oneArticle.title" content-style="margin-top: 10px;">
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
  import { RouterLink } from "vue-router";
  import { useRouter } from "vue-router";

  const userStore = useUserStore();
  const userId = userStore.userId;
  const userNickname=userStore.nickname
  const articleList = ref([])
  const clubId=ref(1)
  const router = useRouter();
  const message=useMessage()

  onMounted(function(){
    showClubArticleList(clubId)
  })

  //渲染article
async function showClubArticleList(clubId) {
  try{
    const response = await axios.get(`/club/article/all/${clubId.value}`);
    articleList.value=response.data;
    // await Promise.all(articleList.value.map(article=> fetchComment(article.id)));
    //await checkLikeStatus();

  }catch(error){
    console.error("Error fetching club articles:", error);
    message.error("Failed to fetch articles");
  }
}


async function enterArticle(articleId){
  try{
    const response = await axios.get(`/club/article/oneArticle/${articleId}`);
    const articleData = response.data;
    console.log("Article data from API:",articleData)

    router.push({
      name:"club-article-link",
      params:{ id : articleId
      },
      state:{ articleData }
    })
  }catch(error){
    console.error("Error fetching article details:", error);
    message.error("Failed to fetch article details");
  }
}


</script>
    
<style>
    
</style>