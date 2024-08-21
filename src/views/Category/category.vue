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
        <div class="col-4">分頁

        </div>
    </div>
    <br>


    <div class="row">
        <div class="col-lg-3 col-md-6" v-for=" category in categories" :key="category.id">
            <CategoryCard :category="category" @delete="callRemove(category.id)"></CategoryCard>
        </div>
    </div>



</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axiosapi from '@/plugins/axios';
import CategoryCard from '@/components/product/CategoryCard.vue';

const categories = ref([]);
const router = useRouter();


onMounted(function () {
    getAllCategories()
});
function callRemove(id){
console.log("callRemove",id);
}


function getAllCategories() {
    axiosapi.get(`/categories`).then(function(response){
        console.log("response",response)
        categories.value = response.data
    })

}


</script>

<style></style>