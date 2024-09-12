<template>
  <div>
    <h2 v-if="viewingUserId != currentUserId">
      查看用戶 {{ viewingUserName || '載入中...' }} 的動態牆
    </h2>
    <h2 v-else>這是您的個人動態牆</h2>
    <!-- 其餘模板保持不變 -->
  </div>

  <div v-if="isLoading" class="loading-indicator">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">加載中…</span>
      </div>
    </div>

  <div v-else class="page-container">
    <section class="left-section">
      <div class="user-profile d-flex align-items-center mb-3">
    <div class="user-avatar me-3">
      <div v-if="photo" class="avatar-container">
        <img :src="`${photo}`" :alt="userData.nickname || 'User Photo'" class="rounded-circle" />
      </div>
      <div v-else class="default-avatar rounded-circle">
        {{ (userData.accountNumber || "無").charAt(0).toUpperCase() }}
      </div>
    </div>
    <div class="flex-grow-1">
      <h5 class="mb-2">{{ userData.nickname }}</h5>
      <div v-if="viewingUserId != currentUserId">
        <button v-if="friendStatus === 'not_friend'" @click="switchFriendStatus"
          class="btn btn-outline-secondary btn-sm">
          加好友
        </button>
        <button v-else-if="friendStatus === 'pending_sent'" @click="switchFriendStatus"
          class="btn btn-outline-secondary btn-sm">
          取消好友邀請
        </button>
        <button v-else-if="friendStatus === 'friends'" @click="switchFriendStatus"
          class="btn btn-outline-secondary btn-sm">
          刪除好友
        </button>
        <div v-else-if="friendStatus === 'pending_received'" class="dropdown">
          <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" id="friendRequestDropdown"
            @click="toggleDropdown" aria-expanded="false">
            回應好友邀請
          </button>
          <ul class="dropdown-menu" :class="{ 'show': isDropdownOpen }" aria-labelledby="friendRequestDropdown">
            <li><a class="dropdown-item" href="#" @click.prevent="acceptFriendRequest">接受</a></li>
            <li><a class="dropdown-item" href="#" @click.prevent="declineFriendRequest">拒絕</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>


      <hr />

      <table class="table table-borderless">
        <tr>
          <td><font-awesome-icon :icon="['fas', 'location-dot']" /></td>
          <td>{{ userData.country }} , {{ userData.city }}</td>
        </tr>
        <tr>
          <td><font-awesome-icon :icon="['fas', 'cake-candles']" /></td>
          <td>{{ userData.age }} 歲</td>
        </tr>
        <tr>
          <td><font-awesome-icon :icon="['fas', 'venus-mars']" /></td>
          <td>{{ userData.gender }}</td>
        </tr>
      </table>
      <hr />

      <div>
        <h5>關於我</h5>
        <p>{{ userData.bio }}</p>
      </div>
    </section>


    <div class="main-content">

      <n-infinite-scroll style="height: 80%" :distance="10" @load="handleLoad">
        <div v-for="onePost in postList" :key="onePost.id" class="item">
          <div class="post-actions">
            <div v-if="onePost.userId !== null && onePost.user.id == userStore.userId">
              <button class="btn btn-outline-secondary btn-sm" @click="updatePost(onePost)">編輯</button>
              <button class="btn btn-outline-danger btn-sm" @click=deletePost(onePost)>刪除</button>
            </div>
          </div>
          <div class="post-header">
            <div class="post-date"> {{ formatDate(onePost.added) }}</div>
            <a @click="navigateToUserPost(onePost.user.id)" class="a-link post-author">
              {{ onePost.user.nickname }}
            </a>
            <div>

              <n-ellipsis expand-trigger="click" line-clamp="2" :tooltip="false" class="formatted-content">
                <p>{{ onePost.content }}</p>
              </n-ellipsis>
              <!-- photo -->
              <n-carousel v-if="onePost.photos && onePost.photos.length > 0" direction="vertical" dot-placement="right"
                mousewheel style="width: 100%; height: 240px">
                <n-image v-for="onePhoto in onePost.photos" :key="onePhoto.id" :src="onePhoto.base64Photo"
                  :alt="onePhoto.name" class="image" />
              </n-carousel>
            </div>
            <div class="post-like">
              <font-awesome-icon :icon="onePost.isLiked ? ['fas', 'heart'] : ['far', 'heart']"
                @click="toggleLike(onePost)" :style="{ color: onePost.isLiked ? 'red' : 'black', cursor: 'pointer' }" />
              <span class="like-count">{{ onePost.likeCount || 0 }}</span>
            </div>
            <!-- 留言 -->
            <div v-if="onePost.comments && onePost.comments.length > 0" class="comments-section">
              <h6>評論區：</h6>
              <div v-for="oneComment in onePost.comments" :key="oneComment.id" class="comment">
                <div class="comment-content">
                  <div class="comment-user">
                    <a @click="navigateToUserPost(oneComment.user.id)" class="a-link">
                      <span>{{ oneComment.user?.nickname || '未知用戶' }}:</span>
                    </a>
                  </div>
                  <div class="comment-text">{{ oneComment.comment }}</div>
                  <div class="comment-date">{{ formatDate(oneComment.added) }}</div>
                  <div class="comment-like">
                    <font-awesome-icon :icon="oneComment.isLiked ? ['fas', 'heart'] : ['far', 'heart']"
                      @click="toggleCommentLike(oneComment)"
                      :style="{ color: oneComment.isLiked ? 'red' : 'black', cursor: 'pointer' }" />
                    <span class="like-count">{{ oneComment.likeCount || 0 }}</span>
                  </div>
                </div>
                <div v-if="oneComment.userId !== null && oneComment.user.id == userStore.userId"
                  class="comment-actions">
                  <button class="btn btn-outline-secondary btn-sm" @click="editComment(oneComment)">編輯</button>
                  <button class="btn btn-outline-danger btn-sm" @click="deleteComment(oneComment, onePost.id)">
                    <font-awesome-icon :icon="['fas', 'trash']" />
                  </button>
                </div>
              </div>
            </div>
            <!-- 留言輸入框 -->
            <!-- 把屬性傳給子元件 -->
            <PostComment :postId="onePost.id" @comment-added="handleCommentAdded(onePost.id, $event)"></PostComment>
          </div>
        </div>
        <updatePostModal ref="updatePostModal" :post="selectedPost" @update:onePost="handlePostUpdate">
        </updatePostModal>
      </n-infinite-scroll>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from '@/plugins/axios';
import useUserStore from '@/stores/userstore';
import UpdatePostModal from "./updatePostModal.vue";
import PostComment from "./PostComment.vue";
import { useMessage } from 'naive-ui'


const userStore = useUserStore();
const userId = userStore.userId;
const userIdUrl = ref();
const route = useRoute();

const userNickname = userStore.nickname
//初始化
const updatePostModal = ref(null);
const selectedPost = ref(null)
const editingCommentId = ref(null)
const editedComment = ref(null)
const message = useMessage()
const router = useRouter();
const currentUserId = computed(() => userStore.userId);
const viewingUserId = ref(null);
const viewingUserName = ref('');

const postList = ref([])


const userData = ref({});
const photo = ref('');
const friendStatus = ref('not_friend');
const isDropdownOpen = ref(false);
const isLoading = ref(true);

function initializeViewingUserId() {
  viewingUserId.value = route.params.id || currentUserId.value;
  console.log("Initialized viewingUserId:", viewingUserId.value);
  console.log("Current logged in userId:", currentUserId.value);
  if (viewingUserId.value) {
    fetchUserName();
    showUserPostList();
    fetchFriendStatus();
  } else {
    console.error("viewingUserId is not set");
  }
}

onMounted(() => {
  initializeViewingUserId();
  callFind();
});


// 監聽路由變化
watch([() => route.params.id, currentUserId], ([newId, newCurrentId]) => {
  console.log("Route params or current user changed. New ID:", newId, "New current user ID:", newCurrentId);
  initializeViewingUserId();
}, { immediate: true });

// 監聽 currentUserId 變化
watch(currentUserId, (newId) => {
  console.log("Current user ID changed:", newId);
  if (!route.params.id) {
    initializeViewingUserId();
  }
});

const navigateToUserPost = (userId) => {
  if (userId && userId.toString() !== viewingUserId.value) {
    console.log("Navigating to user post:", userId);
    router.push(`/post/userPost/${userId}`);
  } else {
    console.log("Already viewing the requested user's posts or invalid userId");
  }
};

async function fetchUserName() {
  try {
    const response = await axios.get(`/user/findName/${viewingUserId.value}`);
    viewingUserName.value = response.data; // API 直接返回暱稱字符串
    console.log("Fetched user name:", viewingUserName.value);
  } catch (error) {
    console.error('Error fetching user name:', error);
    viewingUserName.value = '未知用戶';
  }
}

// 渲染post

async function showUserPostList() {
  try {
    console.log("Fetching posts for viewingUserId:", viewingUserId.value);
    const response = await axios.get(`/userPost/showUserAllPost/${viewingUserId.value}`);
    console.log("Response data:", response.data);
    postList.value = Array.isArray(response.data) ? response.data : [];
    await Promise.all(postList.value.map(post => fetchComments(post.id)));
    await checkLikeStatus();
  } catch (error) {
    console.error("Error fetching user posts:", error);
    message.error("Failed to fetch posts");
    postList.value = [];
  }
}

// 檢查按讚狀態
async function checkLikeStatus() {
  for (const post of postList.value) {
    try {
      const response = await axios.get(`/postLike`, {
        params: { userId: userId, postId: post.id }
      });
      post.isLiked = response.data;
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  }
}

// 切換按讚狀態
async function toggleLike(post) {
  try {
    await axios.post('/postLike', null, {
      params: { userId: userId, postId: post.id, type: 1 }
    });
    post.isLiked = !post.isLiked;
    if (post.likeCount = null) {
      post.likeCount = 0;
    }
    post.likeCount = (post.likeCount) + (post.isLiked ? 1 : 0);
    message.success(post.isLiked ? '已按讚!' : '已取消讚!');
  } catch (error) {
    console.error('Error toggling like:', error);
    message.error('更新按讚狀態失敗');
  }
}

async function updateLikeCount(post) {
  try {
    const response = await axios.get(`/userPost/${post.id}/likeCount`);
    post.likeCount = response.data;
  } catch (error) {
    console.error('Error fetching like count:', error);
  }
}

//渲染comment
function fetchComments(postId) {
  axios.get(`/postComment/${postId}`)
    .then(response => {
      const postIndex = postList.value.findIndex(post => post.id === postId);
      if (postIndex !== -1) {
        postList.value[postIndex].comments = response.data
      }
    })
    .catch(error => {
      console.error(`Error fetching comments for post ${postId}:`, error);
    })
}

//渲染PostPhoto
// function fetchPhoto(postId){
//     axios.get(`/postPhoto/${postId}`)
//     .then(response=>  {
//         const postIndex = postList.value.findIndex(post => post.id === postId);
//         if(postIndex !== -1){
//             postList.value[postIndex].photos = response.data
//         }
//     })
//     .catch(error => {
//         console.error(`Error fetching photos for post ${postId}:`, error)
//     })
// }

//即時更新comment
function handleCommentAdded(postId, newComment) {
  //在 postList 中尋找 ID 等於 postId 的貼文。findIndex 方法會返回該貼文在陣列中的索引。如果沒有找到，返回 -1    
  const postIndex = postList.value.findIndex(post => post.id === postId);
  // 如果找到了對應的貼文
  if (postIndex !== -1) {
    // 如果該貼文尚未有留言，則初始化為空陣列
    if (!postList.value[postIndex].comments) {
      postList.value[postIndex].comments = []
    }
    // 更新留言後保留 user.nickname，如果 newComment.user 不存在，則使用預設的 userNickname
    newComment.user = newComment.user || { nickname: userNickname }
    // 將新留言添加到對應貼文的留言列表中
    postList.value[postIndex].comments.push(newComment)
  }
}


// 檢查按讚狀態
async function checkCommentLikeStatus() {
  for (const post of postList.value) {
    if (post.comments) {
      for (const comment of post.comments) {
        try {
          const response = await axios.get(`/postCommentLike`, {
            params: { userId: userId, commentId: comment.id }
          });
          comment.isLiked = response.data;
        } catch (error) {
          console.error('Error checking comment like status:', error);
        }
      }
    }
  }
}

// 切換按讚狀態
async function toggleCommentLike(comment) {
  try {
    await axios.post('/postCommentLike', null, {
      params: { userId: userId, commentId: comment.id }
    });
    comment.isLiked = !comment.isLiked;
    comment.likeCount = comment.likeCount || 0;
    comment.likeCount += comment.isLiked ? 1 : -1;
    message.success(comment.isLiked ? '已對評論按讚!' : '已取消評論讚!');
  } catch (error) {
    console.error('Error toggling comment like:', error);
    message.error('更新評論按讚狀態失敗');
  }
}

//載入更多
const count = ref(6);
const handleLoad = () => {
  count.value += 1;
};

//修改post
function updatePost(onePost) {
  onePost.value = {
    id: onePost.id,
    content: onePost.content,

  }
  selectedPost.value = { ...onePost }
  console.log(selectedPost.value)
  updatePostModal.value.showModal();
}

// 即時更新貼文
function handlePostUpdate(updatePost) {
  const index = postList.value.findIndex(post => post.id === updatePost.id);
  if (index !== -1) {
    postList.value[index] = updatePost
  }
}

function deletePost(onePost) {
  confirm("確定要刪除嗎");

  if (true) {
    axios.delete(`/userPost/${onePost.id}`)
      .then(response => {
        postList.value = postList.value.filter(post => post.id !== onePost.id)
        console.log(`Post with id ${onePost.id} deleted`)
      })
      .catch(error => {
        console.error("Error fetching user posts:", error);
      })
  }
}

function editComment(oneComment) {
  editingCommentId.value = oneComment.id
  editedComment.value = oneComment.comment
}

function cancelEdit() {
  editingCommentId.value = null;
  editedComment.value = ''
}

async function saveComment(oneComment) {
  try {
    const response = await axios.put(`/postComment/${oneComment.id}`, { newComment: editedComment.value })
    //更新前端畫面
    oneComment.comment = editedComment.value

    //重置編輯狀態
    editingCommentId.value = null
    editedComment.value = ''
  } catch (error) {
    console.error('更新評論失敗', error)
    //可以添加錯誤處理邏輯 (顯示錯誤提示)
  }
}

async function deleteComment(oneComment, postId) {
  if (window.confirm("確定要刪除嗎")) {
    try {
      await axios.delete(`/postComment/${oneComment.id}`)

      // 如果找到了Post（即 postIndex 不等於 -1），則使用 filter 方法從該Post的評論列表中移除被刪除的評論。
      const postIndex = postList.value.findIndex(post => post.id === postId)
      console.log(postIndex)
      if (postIndex !== -1) {
        postList.value[postIndex].comments = postList.value[postIndex].comments.filter(comment => comment.id !== oneComment.id)
        console.log(postList.value)
      }
      message.success('評論已成功刪除')
    } catch (error) {
      message.error("刪除評論時發生錯誤:")
      console.error("刪除評論時發生錯誤:", error)
    }
  }
}






//格式化時間
function formatDate(dateString) {
  if (!dateString) return '無效日期'; // 提供默認值或處理無效情況
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '無效日期'; // 檢查日期是否有效
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    weekday: 'long',
    timeZone: 'Asia/Taipei' // 可根據需要調整時區
  };
  return new Intl.DateTimeFormat('zh-TW', options).format(date);
}

//取得動態牆用戶資訊
function callFind() {
  isLoading.value = true;
  Promise.all([
    axios.get(`/user/secure/${viewingUserId.value}`),
    axios.get(`/user/secure/profile-photo/${viewingUserId.value}`)
  ]).then(([userResponse, photoResponse]) => {
    // 處理用戶數據
    userData.value = userResponse.data;
    // 處理照片數據
    photo.value = photoResponse.data;
  }).catch((error) => {
    console.log("error", error);
  }).finally(() => {
    isLoading.value = false;
  });
}

//好友邀請回應的dropdown
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

//取得好友狀態，初始化時用
async function fetchFriendStatus() {
  try {
    const response = await axios.get(`/friend/friend-status/${currentUserId.value}/${viewingUserId.value}`);
    friendStatus.value = response.data.status;
    console.log("好友狀態:", friendStatus.value);
  } catch (error) {
    console.error("獲取好友狀態時出錯:", error);
    friendStatus.value = 'not_friend'; // 設置默認狀態
  }
}

const switchFriendStatus = async () => {
  try {
    const response = await axios.get(`/friend/switch-status/${currentUserId.value}/${viewingUserId.value}`);
    friendStatus.value = response.data.status;
  } catch (error) {
    console.error('切換好友狀態時出錯:', error);
  }
};

const acceptFriendRequest = async () => {
  try {
    await axios.get(`/friend/switch-status/${currentUserId.value}/${viewingUserId.value}`);
    friendStatus.value = 'friends';
  } catch (error) {
    console.error('接受好友請求時出錯:', error);
  }
};

const declineFriendRequest = async () => {
  try {
    await axios.get(`/decline-request/${currentUserId.value}/${viewingUserId.value}`);
    friendStatus.value = 'not_friend';
  } catch (error) {
    console.error('拒絕好友請求時出錯:', error);
  }
};


</script>

<style scoped>
:root {
  --primary-pink: #FFB6C1;
  --secondary-pink: #FFC0CB;
  --light-pink: #FFF0F5;
  /* 略微加深的背景色 */
  --very-light-pink: #FFFAFB;
  /* 保持不變，用於 post-content */
  --dark-pink: #FF69B4;
  --text-color: #333;
  --background-color: #FFE4E1;
  /* 更深的背景色 */
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  color: #FF69B4;
  text-align: center;
  margin: 30px 0;
  font-size: 24px;
}

body {
  background-color: #FFE4E1;
  color: #333;
  font-family: 'Arial', sans-serif;
}

.item {
  position: relative;
  background-color: #FFF0F5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  padding: 20px;
}

.post-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 5px;
}

.formatted-content {
  white-space: pre-wrap;
  color: #333;
  line-height: 1.6;
}

.post-header {
  margin-bottom: 15px;
  padding-right: 100px;
  /* 為按鈕預留空間 */
}

.post-date {
  font-size: 0.9em;
  color: #666;
}

.post-like {
  margin-bottom: 20px;
  /* 增加與評論區的間距 */
  padding-bottom: 10px;
  border-bottom: 1px solid #FFB6C1;
}

.post-author {
  font-weight: bold;
  color: #FF69B4;
  margin-top: 5px;
}

.post-content {
  margin-bottom: 15px;
  background-color: #FFFAFB;
  border-radius: 6px;
  margin-bottom: 15px;
}

.comments-section {
  margin-top: 20px;
}

.comment {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border: 1px solid #FFB6C1;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  background-color: #FFFAFB;
}


.comment-user {
  font-weight: bold;
  color: #FF69B4;
}

.comment-text {
  margin-top: 5px;
}

.comment-date {
  font-size: 0.8em;
  color: #888;
  margin-top: 5px;
}

.formatted-content {
  white-space: pre-wrap;
  /* 保留换行符和空格 */
}


.comment-main {
  flex-grow: 1;
}

.comment-content {
  flex-grow: 1;
  margin-right: 15px;
}

.comment-like {
  display: flex;
  align-items: center;
  gap: 5px;
}

.like-count {
  font-size: 0.9em;
  color: #666;
}

.comment-actions {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

/* 輪播圖 */
.n-carousel {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 15px;
}

.image {
  width: auto;
  height: 200px;
  object-fit: contain;
  border-radius: 8px;
  margin-top: 10px;
}

.btn {
  padding: 5px 10px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
  font-size: 0.8em;
}

.btn-outline-secondary {
  color: #FF69B4;
  ;
  border: 1px solid #FF69B4;
  ;
  background-color: transparent;
}

.btn-outline-secondary:hover {
  background-color: #FF69B4;
  color: white;
}

.btn-outline-danger {
  color: #dc3545;
  border: 1px solid #dc3545;
  background-color: transparent;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  color: white;
}

.a-link {
  cursor: pointer;
  color: rgb(177 151 252);
  text-decoration: none;
  transition: color 0.3s ease
}

.a-link:hover {
  color: rgb(147, 121, 222);
}

.page-container {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.left-section {
  width: 250px;
  padding-right: 20px;
  border-right: 1px solid var(--primary-pink);
}

.main-content {
  flex: 1;
  padding-left: 20px;
}

.user-profile {
  padding: 10px 0;
}

.user-avatar {
  flex-shrink: 0;
}

.avatar-container,
.default-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #e0e0e0;
}

.avatar-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.default-avatar {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  background-color: #bbb;
}

.dropdown-menu.show {
  display: block;
}

.loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>