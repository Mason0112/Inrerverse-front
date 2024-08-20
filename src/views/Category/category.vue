<template>
        <h3>Category Table</h3>
        <div class="row">
            <button type="button" class="btn btn-primary">開啟新增</button>
            <input type="text" placeholder="產品名稱查詢" v-model="findName" >
            <div>下拉選單元件</div>

        </div>
        <br>
        <div class="row">分頁元件
        </div>
        <br>
        <div class="row">Bootstrap Card元件
        </div>
</template>
    
<script setup >
    import { ref,onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import axiosapi from '@/plugins/axios';
    import Swal from 'sweetalert2';

    const category = ref(null);
    const router = useRouter();

    onMounted(function(){getAllCategories()
        });
    function getAllCategories(){
        axiosapi.get(`/categories`).then

    }


</script>
    
<style>
    
</style>