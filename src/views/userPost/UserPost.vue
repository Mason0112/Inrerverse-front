<template>
    <n-infinite-scroll style="height: 80%" :distance="10" @load="handleLoad">
        
        <div v-for="onePost in postList" :key="onePost.id" class="item"  @click="showId(onePost)">
                <div class="container">
                <div> {{ formatDate(onePost.added) }}</div>
                <n-ellipsis expand-trigger="click" line-clamp="2" :tooltip="false" class="formatted-content">
                    {{ onePost.content }}
                </n-ellipsis>
                <div v-if="onePost.userId !== null">
                    <div v-if="onePost.user.id == userStore.userId">

                        <button class="btn btn-outline-secondary btn-sm">編輯</button>
                        <button class="btn btn-outline-danger btn-sm">刪除</button>
                    </div>
                </div>

            </div>
        </div>
    </n-infinite-scroll>
</template>

<script setup>
import { defineComponent, onMounted, ref } from "vue";
import axios from '@/plugins/axios';
import useUserStore from '@/stores/userstore';

const userStore = useUserStore();
const userId = userStore.userId;
const content = ref('')
const added = ref('')
const postList = ref([])
onMounted(function(){
    showUserPostList(userId)
})

function showId(onePost) {
    if (onePost.user) {
        console.log(onePost.user.id);
    } else {
        console.log('User is undefined');
    }
}

function showUserPostList(userId) {
    axios.get(`/userPost/showUserAllPost/${userId}`)
        .then(response => {
            postList.value = response.data;
            console.log(postList.value);
        })
        .catch(error => {
            console.error("Error fetching user posts:", error);
        });
}

//載入更多
const count = ref(6);
const handleLoad = () => {
    count.value += 1;
};

//修改post
function updatePost(onePost){
    onePost.value={
        id,
        content,
        
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


</script>

<style scoped>
    .item {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 10px;
        background-color: rgba(0, 128, 0, 0.16);
        padding: 10px;
    }

    .item:last-child {
    margin-bottom: 0;
    }
    .formatted-content {
    white-space: pre-wrap; /* 保留换行符和空格 */
    }
</style>