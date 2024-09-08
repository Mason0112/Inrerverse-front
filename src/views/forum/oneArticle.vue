<template>
    <div v-if="article" class="article-container">
      <h1>{{ article.title }}</h1>
      <div class="article-meta">
        <span>作者: {{ article.user? article.user.nickname : "匿名" }}</span>
        <span>發布時間: {{ formatDate(article.added) }}</span>
      </div>
      <div class="article-content">{{ article.content }}</div>
      <div class="article-photos">
        <img v-for="(photo, index) in article.photos" :key="index" :src="photo.base64Photo" :alt="`Photo ${index + 1}`" />
      </div>
      <div class="article-actions">
        <button @click="handleLike">讚 ({{ article.likeCount }})</button>
        <button @click="handleFavorite">收藏</button>
        <button @click="handleShare">分享</button>
      </div>
      <div class="comments-section">
        <h3>評論</h3>
        <div v-for="(comment, index) in article.comments" :key="index" class="comment">
          <p>{{ comment.user.nickname }}: {{ comment.content }}</p>
          <span>{{ formatDate(comment.added) }}</span>
        </div>
      </div>
      <form @submit.prevent="handleCommentSubmit" class="comment-form">
        <textarea 
          v-model="commentText" 
          placeholder="寫下你的評論..."
        ></textarea>
        <button type="submit">發表評論</button>
      </form>
    </div>
    <div v-else>Loading...</div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import axios from '@/plugins/axios';
  
  const route = useRoute();
  const router = useRouter();
  const article = ref(null);
  const commentText = ref('');
  const user=ref();


  onMounted(async () => {
    try {
      if (route.state && route.state.articleData) {
        article.value = route.state.articleData;
    } else {
        const articleId = route.params.id
        const response = await axios.get(`/club/article/oneArticle/${articleId}`);
        article.value = response.data;
    }
    } catch (error) {
      console.error('Error fetching article:', error);
    }
  });
  
  const handleLike = async () => {
    // 實現點贊邏輯
  };
  
  const handleFavorite = async () => {
    // 實現收藏邏輯
  };
  
  const handleShare = () => {
    // 實現分享邏輯
  };
  
  const handleCommentSubmit = async () => {
    // 實現提交評論邏輯
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };
  </script>
  
  <style scoped>
  body {
  font-family: 'Noto Sans TC', sans-serif;
  background-color: #f0f0f0;
  color: #333;
  line-height: 1.6;
}

.article-container {
  max-width: 680px;
  margin: 20px auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

/* 文章標題 */
h1 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #000;
}

/* 文章元數據 */
.article-meta {
  font-size: 14px;
  color: #6f7780;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
}

/* 文章內容 */
.article-content {
  font-size: 16px;
  line-height: 1.8;
  margin-bottom: 24px;
}

/* 文章圖片 */
.article-photos {
  margin-bottom: 24px;
}

.article-photos img {
  max-width: 100%;
  border-radius: 4px;
  margin-bottom: 8px;
}

/* 文章操作按鈕 */
.article-actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}

.article-actions button {
  background-color: #f0f0f0;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  color: #6f7780;
  cursor: pointer;
  transition: background-color 0.2s;
}

.article-actions button:hover {
  background-color: #e0e0e0;
}

/* 評論區域 */
.comments-section {
  border-top: 1px solid #e0e0e0;
  padding-top: 24px;
}

.comments-section h3 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
}

.comment {
  margin-bottom: 16px;
}

.comment p {
  font-size: 14px;
  margin-bottom: 4px;
}

.comment span {
  font-size: 12px;
  color: #6f7780;
}

/* 評論表單 */
.comment-form {
  margin-top: 24px;
}

.comment-form textarea {
  width: 100%;
  height: 100px;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  resize: vertical;
  font-size: 14px;
}

.comment-form button {
  background-color: #3397cf;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 8px;
}

.comment-form button:hover {
  background-color: #2c7eb3;
}
  </style>