<template>
    <n-infinite-scroll style="height: 80%" :distance="10" @load="handleLoad">
        <div class="container">

            <div v-for="onePost in postList" :key="onePost.id" class="item">
                <div> {{ onePost.added }}</div>
                <n-ellipsis expand-trigger="click" line-clamp="2" :tooltip="false">
                    {{ onePost.content }}
                </n-ellipsis>
            </div>
        </div>
    </n-infinite-scroll>
</template>

<script setup>
import { defineComponent, onMounted, ref } from "vue";
import axios from '@/plugins/axios';
import useUserStore from '@/stores/userstore';

const userStore = useUserStore();
const id = userStore.userId;
const content = ref('')
const added = ref('')
const postList = ref([
    id ,
    content,
    added,


])
onMounted(function(){
    showUserPostList(id)
})


function showUserPostList(id){
    console.log(id + 123)
    axios.get(`/userPost/showUserAllPost/${id}`)
    .then(Response=>{
        postList.value = Response.data
    console.log(postList)
    })
    .catch(error => {
    console.error("erroe fetching user posts:", error)
    })
}

//載入更多
const count = ref(6);
const handleLoad = () => {
    count.value += 1;
};


</script>

<style scoped>
    .item {
        display: flex;
        align-items: center;
        height: 100px;
        justify-content: center;
        margin-bottom: 10px;
        background-color: lightblue;
    }

    .item:last-child {
    margin-bottom: 0;
}
</style>