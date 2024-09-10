<template>
  <div v-for="oneArticle in articleList" :key="oneArticle.id">
    <n-list hoverable>
      <n-list-item>
        <div class="article-container">
          <div class="content-container" @click="enterArticle(oneArticle.id)">
            <n-thing>
              <template #header>
                <div class="article-title">{{ oneArticle.title }}</div>
              </template>
              <template #header-extra>
                <!-- 如果有額外的標題內容,放在這裡 -->
              </template>
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
  background-color: #FEE8E8; /* 整體背景色 */
  border-radius: 8px;
  margin-bottom: 15px;
  overflow: hidden;
}

.content-container {
  flex-grow: 1;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

/* 使用更具體的選擇器來定位標題區域 */
:deep(.n-thing) {
  display: flex;
  flex-direction: column;
  background-color: #FEE8E8; /* 整體背景色 */
  border-radius: 8px;
  overflow: hidden;
}

:deep(.n-thing-header) {
  background-color: #FFD6D6; /* 標題背景色略深 */
  padding: 10px;
}

:deep(.n-thing-header__title) {
  font-size: 1.2rem !important;
  font-weight: 700 !important;
  color: #1a1a1a !important;
}

:deep(.n-thing-main) {
  background-color: #FEE8E8; /* 內容背景色 */
  padding: 10px;
}

/* 為內容區域添加特定的類名 */
.article-content-wrapper {
  background-color: #FEE8E8;
  padding: 10px;
  border-radius: 0 0 8px 8px;
}

.article-content {
  font-size: 1.5rem;
  color: #333;
}

.image-container {
  width: 120px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: default;
  padding: 10px;
}

.n-image {
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.n-image:hover {
  transform: scale(1.05);
}

.like-container {
  margin-top: 10px;
  cursor: default;
  padding: 0 15px 15px;
}

.like-container .font-awesome-icon {
  cursor: pointer;
}
</style>