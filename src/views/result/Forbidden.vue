<template>
    <n-result status="403" title="403 Forbidden" description="沒有權限">
        <template #footer>
            <n-button @click="toLogin">登入</n-button>
        </template>
    </n-result>
</template>

<script setup>
import  { useRouter } from 'vue-router';
const router = useRouter();

function toLogin() {

    router.push("/login");
}
</script>

<style></style>