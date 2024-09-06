<template>
    <n-result status="404" title="404 Not Found" description="找不到網頁">
        <template #footer>
            <n-button @click="toHome">回上一頁</n-button>
        </template>
    </n-result>
</template>

<script setup>
import  { useRouter } from 'vue-router';
const router = useRouter();

function toHome() {

    router.go(-1);
}

</script>

<style></style>