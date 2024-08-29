<template>
        <h3>WELCOMEEEEEEEE <font-awesome-icon icon="fa-solid fa-house" /> {{ nickname }}</h3>
        <!-- <img src="C:/interverse/user_post_photo/e669355b-39fa-44b7-bab7-122d33bc6646_javascript.png" alt="">
        <img src="C:/interverse/user_post_photo//3fb0a455-f96e-41df-a744-e5c35a97f7d5_jwt.png" alt=""> -->

</template>
    
<script setup>
    import useUserStore from '@/stores/userstore';
    const userStore = useUserStore();

    let nickname = userStore.nickname;

</script>
    
<style>
    
</style>