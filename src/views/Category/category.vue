<template>
    <h3>Category Table</h3>
    <div class="row">
        <div class="col-4">
            <button type="button" class="btn btn-primary">開啟新增</button>
        </div>
        <div class="col-4">
            <input type="text" placeholder="請輸入產品名稱">
        </div>
        <div class="col-4">
            下拉選單元件
        </div>
    </div>
    <br>

    <div class="row">
        <div class="col-4">分頁</div>
    </div>
    <br>
    <div class="row">
        <div class="col-lg-3 col-md-6">
            <div class="card">
                <img src="..." class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">Card title</h5>
                    <div class="card-text text-danger text-end" >100元
                    </div>
                    <div class="row">
                        <div class="col text-start">
                            <button type="button" class="btn btn-primary">開啟修改</button>
                        </div>
                        <div class="col text-end"> 
                            <button type="button" class="btn btn-primary">刪除</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axiosapi from '@/plugins/axios';
import Swal from 'sweetalert2';

const categories = ref([]);
const router = useRouter();


onMounted(function () {
    getAllCategories()
});
function getAllCategories() {
    axiosapi.get(`/categories`).then(function(response){
        console.log("response",response)
        categories.value = response.data
    })

}


</script>

<style></style>