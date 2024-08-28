<template>
        <h3>WELCOMEEEEEEEE <font-awesome-icon icon="fa-solid fa-house" /> {{ nickname }}</h3>

</template>
    
<script setup>
    import useUserStore from '@/stores/userstore';
    const userStore = useUserStore();

    let nickname = userStore.nickname;

</script>
    
<style>
    
</style>