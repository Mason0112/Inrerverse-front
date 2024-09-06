<template>
    <div v-if="article" class="article-container">
      <h1>{{ article.title }}</h1>
      <div class="article-meta">
        <span>作者: {{ article.user.nickname }}</span>
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
  import axios from 'axios';
  
  const route = useRoute();
  const router = useRouter();
  const article = ref(null);
  const commentText = ref('');
  
  onMounted(async () => {
    try {
      if (route.params.state && route.params.state.articleData) {
        article.value = route.params.state.articleData;
      } else {
        const response = await axios.get(`/club/article/${route.params.id}`);
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
  /* 添加您的樣式 */
  </style>