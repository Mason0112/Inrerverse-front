<template>
        <h3>WELCOMEEEEEEEE <font-awesome-icon icon="fa-solid fa-house" /> {{ nickname }}</h3>

        <personal-modal> </personal-modal>
        <img src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRbezqZpEuwGSvitKy3wrwnth5kysKdRqBW54cAszm_wiutku3R">
</template>
    
<script setup>
    import useUserStore from '@/stores/userstore';
    const userStore = useUserStore();

    let nickname = userStore.nickname;

    import PersonalModal from '@/components/user/PersonalModal.vue';

</script>
    
<style>
    
</style>