<template>
    <div v-if="article" class="article-container">
      <div class="header">
        <h1>{{ article.title }}</h1>
        <div v-if="article.userId !== null">
          <div v-if="article.userId == userStore.userId">
            <button class="btn btn-outline-secondary btn-sm" @click="editArticle">編輯</button>
            <button class="btn btn-outline-danger btn-sm" @click="deleteArticle">刪除</button>          
          </div>
        </div>
      </div>
      <div class="article-meta">
        <span>作者: 
        <a @click="navigateToUserPost(article.userId)"> 
          {{ article.userId ? article.userName : "匿名" }}
        </a>
      </span>
        <span>發布時間: {{ formatDate(article.added) }}</span>
      </div>
      <div class="article-content">{{ article.content }}</div>
      <div class="article-photos">
        <n-image v-for="(photo, index) in article.photos" :key="index" :src="photo.base64Photo" :alt="`Photo ${index + 1}`" 
        style="max-width: auto; height: 200px; object-fit: cover;"/>
      </div>
      <div class="article-actions">
        <div class="like-container" @click.stop>
  <button @click="toggleLike">
    <font-awesome-icon 
      :icon="article.isLiked ? ['fas', 'heart'] : ['far', 'heart']" 
      :style="{ color: article.isLiked ? 'red' : 'black', cursor: 'pointer' }"
    />
    <span class="like-count">{{ article.likeCount || 0 }}</span>
  </button>
</div>
        <button @click="handleFavorite">收藏</button>
        <button @click="handleShare">分享</button>
      </div>
      <div class="comments-section">
    <h3>評論</h3>
    <div v-for="comment in article.comments" :key="comment.id" class="comment">
      <div class="comment-header">
        <span class="comment-date">{{ formatDate(comment.added) }}</span>
        <div class="comment-actions" v-if="comment.userId === userStore.userId">
          <button @click="editComment(comment)" class="btn-edit">編輯</button>
          <button @click="deleteComment(comment.id)" class="btn-delete">刪除</button>
        </div>
      </div>
      <div class="comment-content">
        <a @click="navigateToUserPost(comment.userId)">
          <strong class="comment-author">{{ comment.userName }}:</strong>
        </a>
        <p>{{ comment.content }}</p>
      </div>
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

    <n-modal v-model:show="showEditModal">
    <n-card title="編輯文章" style="width: 600px;">
      <n-input v-model:value="editedArticle.title" type="text" placeholder="標題" />
      <n-input v-model:value="editedArticle.content" type="textarea" placeholder="內容" />
      <n-button @click="updateArticle">保存</n-button>
      <n-button @click="showEditModal = false">取消</n-button>
    </n-card>
  </n-modal>
  <n-modal v-model:show="showEditCommentModal">
    <n-card title="編輯評論" style="width: 600px;">
      <n-input v-model:value="editedCommentContent" type="textarea" placeholder="編輯你的評論..." />
      <n-button @click="updateComment">保存</n-button>
      <n-button @click="showEditCommentModal = false">取消</n-button>
    </n-card>
  </n-modal>
  </template>
  
  <script setup>
  import { ref, onMounted, reactive, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import axios from '@/plugins/axios';
  import useUserStore from '@/stores/userstore';
  import { useMessage, NModal, NInput, NButton } from 'naive-ui'
  const message=useMessage()

  const userStore = useUserStore();
  const userId = userStore.userId;
  const route = useRoute();
  const router = useRouter();
  const article = ref(null);
  const commentText = ref('');
  const showEditModal = ref(false)
  const editedArticle = reactive({
    title: '',
    content: ''
  })
  const showEditCommentModal = ref(false);
  const editedCommentContent = ref('');
  const currentEditingComment = ref(null);

  const editComment = (comment) => {
  currentEditingComment.value = comment;
  editedCommentContent.value = comment.content;
  showEditCommentModal.value = true;
};


  onMounted(async () => {
  try {
    const articleId = route.params.id;
    if (route.state && route.state.articleData) {
      article.value = route.state.articleData;
    } else {
      const response = await axios.get(`/club/article/oneArticle/${articleId}`);
      article.value = response.data;
    }

    if(!Array.isArray(article.value.comments)){
      article.value.comments =[];
    }
    await checkLikeStatus();
  } catch (error) {
    console.error('Error fetching article:', error);
  }
});

// 編輯文章
function editArticle() {
  editedArticle.title = article.value.title;
  editedArticle.content = article.value.content;
  showEditModal.value = true;
}

// 更新文章
async function updateArticle() {
  try {
    const updateData = {
      title: editedArticle.title,
      content: editedArticle.content,
    };
    const response = await axios.put(`/club/article/${article.value.id}`, updateData);
    article.value = {
      ...response.data,
      photos: article.value.photos
    }
    showEditModal.value = false;
    message.success('文章已更新');
  } catch (error) {
    console.error('Error updating article:', error);
    message.error('更新文章失敗');
  }
}

// 刪除文章
async function deleteArticle() {
  if (confirm('確定要刪除這篇文章嗎？')) {
    try {
      await axios.delete(`/club/article/${article.value.id}`);
      message.success('文章已刪除');
      router.push(`/club/article/all/${article.value.clubId}`); // 假設刪除後返回俱樂部頁面
    } catch (error) {
      console.error('Error deleting article:', error);
      message.error('刪除文章失敗');
    }
  }
}
  
// 檢查按讚狀態
async function checkLikeStatus() {
  if (!article.value || !userId) return;

        try {
            const response = await axios.get(`/articleLike`, {
                params: { userId: userId, articleId: article.value.id }
            });
            article.value.isLiked = response.data;
        } catch (error) {
            console.error('Error checking like status:', error);
        }
    }

// 切換按讚狀態
async function toggleLike() {
  if (!article.value || !userId) return;
  try {
    const response = await axios.post('/articleLike', null, {
      params: { 
        userId: userId, 
        articleId: article.value.id, 
        type: article.value.isLiked ? 0 : 1 // 0 表示取消讚，1 表示按讚
      }
    });
    article.value.isLiked = !article.value.isLiked;
    article.value.likeCount = (article.value.likeCount) + (article.value.isLiked ? 1 : -1);
    message.success(article.value.isLiked ? '已按讚!' : '已取消讚!');
  } catch (error) {
    console.error('Error toggling like:', error);
    message.error('更新按讚狀態失敗');
  }
}

  
  const handleFavorite = async () => {
    // 實現收藏邏輯
  };
  
  const handleCommentSubmit = async () => {
    if(!commentText.value.trim()) return;

    try{
      const response = await axios.post('/club/article/comment',{
        content: commentText.value,
        articleId: article.value.id,
        userId: userStore.userId
      })

      if(!Array.isArray(article.value.comments)){
        article.value.comments=[];
      }

      article.value.comments.push(response.data);
      commentText.value='';
      message.success('發布評論成功');
    }catch(error){
      console.error('Error submitting comment:', error);
      message.error('發布評論失敗')
    }
  };

  const updateComment = async () => {
  try {
    const response = await axios.put(`/club/article/comment/${currentEditingComment.value.id}`, {
      content: editedCommentContent.value
    });
    const updatedComment = response.data;
    const index = article.value.comments.findIndex(c => c.id === updatedComment.id);
    if (index !== -1) {
      article.value.comments[index] = updatedComment;
    }
    showEditCommentModal.value = false;
    message.success('評論已更新');
  } catch (error) {
    console.error('Error updating comment:', error);
    message.error('更新評論失敗');
  }
};
  
const deleteComment = async (commentId) => {
  if (confirm('確定要刪除這條評論嗎？')) {
    try {
      await axios.delete(`/club/article/comment/${commentId}`);
      article.value.comments = article.value.comments.filter(c => c.id !== commentId);
      message.success('評論已刪除');
    } catch (error) {
      console.error('Error deleting comment:', error);
      message.error('刪除評論失敗');
    }
  }
};

const handleShare = async () => {
  try {
    const shareUrl = `${window.location.origin}/club/article/${article.value.id}`;
    await navigator.clipboard.writeText(shareUrl);
    message.success('文章連結已複製到剪貼板');
  } catch (error) {
    console.error('Error sharing article:', error);
    message.error('分享文章失敗');
  }
};

const navigateToUserPost = (userId) => {
  if (userId) {
    router.push(`/post/userPost/${userId}`);
  }
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

.article-actions {
  display: flex;
  gap: 8px;
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
  margin-top: 20px;
  border-top: 1px solid #e0e0e0;
  padding-top: 24px;
}

.comments-section h3 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
}

.comment {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
}

.comment p {
  font-size: 14px;
  margin-bottom: 4px;
}

.comment-date {
  font-size: 0.8em;
  color: #6c757d;
}

.comment-actions {
  display: flex;
  gap: 8px;
}

.btn-edit, .btn-delete {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.8em;
  color: #6c757d;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
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
.btn-edit:hover, .btn-delete:hover {
  color: #007bff;
}

.comment-content {
  line-height: 1.4;
}

.comment-author {
  font-weight: bold;
  margin-right: 8px;
}

.comment-form button:hover {
  background-color: #2c7eb3;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header h1 {
  margin: 0;
  flex-grow: 1;
}



.article-actions button {
  padding: 4px 8px;
  font-size: 12px;
}

.article-meta a {
  color: #007bff;
  cursor: pointer;
  text-decoration: none;
}

.article-meta a:hover {
  text-decoration: underline;
}
  </style>