<template>
  <h1>後台首頁</h1>
</template>

<script setup>
import { onMounted } from "vue";
import axios from "@/plugins/axios";


//掛載時直接確認是否有權限參訪頁面
async function checkPermission() {
  try {
    const response = await axios.get('/admin/void')
    if (response.status === 200) {
      console.log('權限檢查:', response.data)
    }
  } catch (error) {
    console.error('權限檢查:', error)
  }
}

onMounted(() => {
  checkPermission()
})
</script>

<style></style>
