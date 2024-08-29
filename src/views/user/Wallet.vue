<template>

</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "@/plugins/axios";
import useUserStore from "@/stores/userstore";

const userStore = useUserStore();
let userId = userStore.userId;

onMounted(function () {
  callFind();
});

function callFind() {
    axios.get(`/transaction/${userId}`)
    .then((response) => {
    
        const transactionData = response.data;
        console.log(transactionData);
  }).catch((error) => {
    console.log("error", error);
  });
}

</script>

<style>
</style>
