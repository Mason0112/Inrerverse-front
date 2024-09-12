<template>
 <div class="forum-container">
    <div class="search-container">
      <div class="input-group">
        <input type="text" class="form-control" v-model="searchQuery" placeholder="搜索文章...">
        <button class="btn search-button" type="button" @click="searchArticles">搜尋</button>
        <button v-if="isSearching" class="btn return-button" type="button" @click="resetSearch">返回</button>
        <button class="btn create-article-button" type="button" @click="showCreateArticleModal">新增文章</button>
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
                  <n-tag 
                  v-for="hashtag in oneArticle.hashtags" 
                  :key="hashtag" 
                  :bordered="false" 
                  type="info" 
                  size="small"
                  style="cursor: pointer;"
                  @click.stop="searchByHashtag(hashtag)">
                      #{{ hashtag }}
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


   
    <!-- 新增文章的彈出窗口 -->
    <n-modal v-model:show="showModal" preset="card" title="新增文章" :style="{ width: '90%', maxWidth: '600px' }">
      <n-space vertical>
        <n-input v-model:value="title" type="text" placeholder="有創意的文章標題" />
        <n-input
          type="textarea"
          placeholder="大聲說出來你在想什麼?"
          v-model:value="content"
          :autosize="{ minRows: 3 }"
        />
        <n-input v-model:value="hashtagInput" type="text" placeholder="輸入 hashtag (用空格分隔多個標籤)" @keyup.enter="addHashtag"/>
        <n-space v-if="hashtags.length > 0">
          <n-tag v-for="tag in hashtags" :key="tag" closable @close="removeHashtag(tag)">
            {{ tag }}
          </n-tag>
        </n-space>
        <div v-else>No hashtags added yet</div>
        <n-upload
          ref="upload"
          :custom-request="customRequest"
          :default-file-list="fileList"
          list-type="image-card"
          @change="handleChange"
        >
          發文附圖是基本禮儀
        </n-upload>
        <n-button tertiary @click="submit">提交</n-button>
      </n-space>
    </n-modal>
  </div>
</template>
    
<script setup>
  import {onMounted, ref, computed, watchEffect  } from "vue";
  import axios from '@/plugins/axios';
  import useUserStore from '@/stores/userstore';
  import {  useMessage, NModal, NSpace, NInput, NTag, NUpload, NButton } from 'naive-ui'
  import { RouterLink } from "vue-router";
  import { useRouter } from "vue-router";

  // 定義 props
const props = defineProps({
  clubIdtoForum: {
    type: [Number, String],
    required: true
  },
  isMember: {
    type: Boolean,
    default: false
  }
});

// 新增文章相關的變量
const showModal = ref(false)
const title = ref('')
const content = ref('')
const fileList = ref([])
const hashtagInput = ref('')
const hashtags = ref([])
const upload = ref(null)

  const userStore = useUserStore();
  const userId = userStore.userId;
  const userNickname=userStore.nickname
  const articleList = ref([])
  const router = useRouter();
  const message=useMessage()
  const searchQuery = ref('');
  const isSearching = ref(false);
  const originalArticles = ref([]);


  const displayedArticles = computed(() => {
    return isSearching.value ? articleList.value : originalArticles.value;
  });

// 使用 watchEffect 來監聽 clubId 的變化
watchEffect(() => {
  console.log("Club ID changed:", props.clubIdtoForum);
  if (props.clubIdtoForum) {
    showClubArticleList(props.clubIdtoForum);
  }
});

onMounted(() => {
  if (props.clubIdtoForum) {
    showClubArticleList(props.clubIdtoForum);
  }
});

  //渲染article
  async function showClubArticleList(clubId) {
  try {
    console.log("Fetching articles for club ID:", clubId);
    const response = await axios.get(`/club/article/all/${clubId}`);
    articleList.value = response.data;
    originalArticles.value = [...response.data];
    await checkLikeStatus();
  } catch (error) {
    console.error("Error fetching club articles:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    message.error("Failed to fetch articles. Please try again later.");
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
      let response;
      if (searchQuery.value.startsWith('#')) {
        // 如果搜索查詢以 # 開頭，則按 hashtag 搜索
        const hashtag = searchQuery.value.slice(1);
        response = await axios.get(`/club/article/hashtag/${hashtag}`);
      } else {
        // 否則按標題搜索
        response = await axios.get('/club/article/search', {
          params: { title: searchQuery.value }
        });
      }
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

async function searchByHashtag(hashtag) {
    try {
      isSearching.value = true;
      searchQuery.value = `#${hashtag}`;
      const response = await axios.get(`/club/article/hashtag/${hashtag}`);
      articleList.value = response.data;
      await checkLikeStatus();
      message.success(`找到 ${articleList.value.length} 篇含有 #${hashtag} 的文章`);
    } catch (error) {
      console.error("Error searching articles by hashtag:", error);
      message.error("搜索文章失敗");
    }
  }
// 顯示新增文章的彈出窗口

  const showCreateArticleModal = () => {
  showModal.value = true
}

// 自定義上傳請求
const customRequest = ({ file, onFinish, onError }) => {
  const reader = new FileReader();
  reader.readAsDataURL(file.file);
  reader.onload = () => {
    file.url = reader.result;
    onFinish();
  }
  reader.onerror = (error) => {
    onError(error)
  }
}

const handleChange = (options) => {
  fileList.value = options.fileList
}

// 添加 hashtag
function addHashtag() {
  const newTags = hashtagInput.value.split(' ').filter(tag => tag.trim() !== '')
  hashtags.value = [...new Set([...hashtags.value, ...newTags])]
  hashtagInput.value = ''
}

// 移除 hashtag
function removeHashtag(tag) {
  hashtags.value = hashtags.value.filter(t => t !== tag)
}

// 提交新文章
async function submit() {
  try {
    if (hashtagInput.value.trim()) {
      addHashtag();
    }
    const articleDTO = {
      title: title.value,
      content: content.value,
      clubId: props.clubIdtoForum,
      userId: userId,
      hashtags: hashtags.value
    };

    const articleResponse = await axios.post('/club/article', articleDTO);
    const articleId = articleResponse.data.id

    for (const file of fileList.value) {
      const formData = new FormData();
      formData.append('file', file.file);
      formData.append('articleId', articleId)
      await axios.post('/club/articlePhoto', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    }

    // 清空表單
    title.value = '';
    content.value = '';
    fileList.value = [];
    hashtags.value = [];
    if (upload.value) {
      upload.value.clear();
    }

    showModal.value = false;
    message.success('文章發布成功');
    
    // 重新獲取文章列表
    await showClubArticleList(props.clubIdtoForum);
  } catch (error) {
    console.error('提交失敗', error);
    message.error('提交失敗: ' + (error.response?.data?.message || error.message));
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

.create-article-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  transition: background-color 0.3s ease;
}

.create-article-button:hover {
  background-color: #45a049;
}
</style>