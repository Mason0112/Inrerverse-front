<template>
 <div class="forum-container">
    <div class="search-container">
      <div class="input-group">
        <input type="text" class="form-control" v-model="searchQuery" placeholder="搜索文章...">
        <button class="btn search-button" type="button" @click="searchArticles">搜尋</button>
        <button v-if="isSearching" class="btn return-button" type="button" @click="resetSearch">返回</button>

      </div>
    </div>
  <div v-for="oneArticle in displayedArticles" :key="oneArticle.id">
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
  </div>
</template>
    
<script setup>
  import {onMounted, ref, computed  } from "vue";
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
  const searchQuery = ref('');
  const isSearching = ref(false);
  const originalArticles = ref([]);


  const displayedArticles = computed(() => {
    return isSearching.value ? articleList.value : originalArticles.value;
  });

  onMounted(function(){
    showClubArticleList(clubId)
  })

  //渲染article
async function showClubArticleList(clubId) {
  try{
    const response = await axios.get(`/club/article/all/${clubId.value}`);
    articleList.value=response.data;
    originalArticles.value = [...response.data]; // 保存原始文章列表
    await checkLikeStatus();

  }catch(error){
    console.error("Error fetching club articles:", error);
    message.error("Failed to fetch articles");
  }
}
//搜尋文章
async function searchArticles() {
  if (!searchQuery.value.trim()) {
    message.warning("請輸入搜索內容");
    return;
  }
  try {
    isSearching.value = true;
    const response = await axios.get('/club/article/search', {
      params: { title: searchQuery.value }
    });
    articleList.value = response.data;
    await checkLikeStatus();
    message.success(`找到 ${articleList.value.length} 篇相關文章`);
  } catch (error) {
    console.error("Error searching articles:", error);
    message.error("搜索文章失敗");
  } 
}

function resetSearch() {
  isSearching.value = false;
  searchQuery.value = '';
  articleList.value = [...originalArticles.value];
  message.success("返回文章列表");
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
.forum-container {
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.search-container {
  margin-bottom: 20px;
  width: 100%;
  max-width: 600px;
  align-self: center;
}

.search-button {
  background-color: #FF9999;
  color: white;
  border: none;
  transition: background-color 0.3s ease;
}

.search-button:hover {
  background-color: #FF7777;
}

.form-control:focus {
  border-color: #FF9999;
  box-shadow: 0 0 0 0.2rem rgba(255, 153, 153, 0.25);
}

.article-container {
  display: flex;
  width: 100%;
  cursor: pointer;
  background-color: #FEE8E8;
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

:deep(.n-thing) {
  display: flex;
  flex-direction: column;
  background-color: #FEE8E8;
  border-radius: 8px;
  overflow: hidden;
}

:deep(.n-thing-header) {
  background-color: #FFD6D6;
  padding: 10px;
}

:deep(.n-thing-header__title) {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1a1a1a;
}

:deep(.n-thing-main) {
  background-color: #FEE8E8;
  padding: 10px;
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