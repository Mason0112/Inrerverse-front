<template>
        <h3>WELCOMEEEEEEEE <font-awesome-icon icon="fa-solid fa-house" /> {{ userId }}</h3>
</template>
    
<script setup>
    import useUserStore from '@/stores/userstore';
    const userStore = useUserStore();

    let userId = userStore.userId;

</script>
    
<style>
    
</style>