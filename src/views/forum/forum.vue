<template>
  <div v-for="oneArticle in articleList" :key="oneArticle.id">
    <n-list hoverable>
      <n-list-item>
        <div class="article-container">
          <div class="content-container" @click="enterArticle(oneArticle.id)">
            <n-thing :title="oneArticle.title" content-style="margin-top: 10px;" class="article-title">
              <template #description>
                <n-space size="small" style="margin-top: 4px">
                  <n-tag :bordered="false" type="info" size="small">
                    <!-- hashtag -->
                  </n-tag>
                </n-space>
              </template>
              <n-ellipsis style="max-width: 240px" class="article-content">
                {{ oneArticle.content }}
              </n-ellipsis>
            </n-thing>
          </div>
          <div class="image-container" @click.stop>
            <n-image 
              v-if="oneArticle.photos && oneArticle.photos.length > 0"
              :src="oneArticle.photos[0].base64Photo" 
              :alt="oneArticle.photos[0].name"
              style="max-width: auto; height: 100px; object-fit: cover;"
            />
          </div>
        </div>
        <div class="like-container" @click.stop>
          <font-awesome-icon 
            :icon="oneArticle.isLiked ? ['fas', 'heart'] : ['far', 'heart']" 
            @click="toggleLike(oneArticle)"
            :style="{ color: oneArticle.isLiked ? 'red' : 'black', cursor: 'pointer' }"
          />
          <span class="like-count">{{ oneArticle.likeCount || 0 }}</span>
        </div>
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
    await checkLikeStatus();

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

// 檢查按讚狀態
async function checkLikeStatus() {
    for (const article of articleList.value) {
        try {
            const response = await axios.get(`/articleLike`, {
                params: { userId: userId, articleId: article.id }
            });
            article.isLiked = response.data;
        } catch (error) {
            console.error('Error checking like status:', error);
        }
    }
}

// 切換按讚狀態
async function toggleLike(article) {
    try {
        await axios.post('/articleLike', null, {
            params: { userId: userId, articleId: article.id, type: 1 }
        });
        article.isLiked = !article.isLiked;
        if(article.likeCount=null){
          article.likeCount=0;
        }
        article.likeCount = (article.likeCount) + (article.isLiked ? 1 : 0);
        message.success(article.isLiked ? '已按讚!' : '已取消讚!');
    } catch (error) {
        console.error('Error toggling like:', error);
        message.error('更新按讚狀態失敗');
    }
}

</script>
    
<style scoped>
.article-container {
  display: flex;
  width: 100%;
  cursor: pointer;
  background-color: rgb(254, 232, 232);
}

.content-container {
  flex-grow: 1;
  cursor: pointer;
}

.image-container {
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: default;
}

.like-container {
  margin-top: 10px;
  cursor: default;
}

.like-container .font-awesome-icon {
  cursor: pointer;
}
.article-title{
  font-size: 2rem;
}

.article-content{
  font-size: 2rem;
}
</style>