<template>
    <h3>Product Table</h3>
    <div class="row">
        <div class="col-4">
            <button type="button" class="btn btn-primary" @click="openModal('insert')">開啟新增</button>
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
        <div class="col-lg-3 col-md-6" v-for=" product in products" :key="product.id" >
            <ProductCard :product="product" >
            </ProductCard>
        </div>
    </div>

 


</template>
    
<script setup >
import { ref, onMounted } from 'vue';
import axiosapi from '@/plugins/axios';
import ProductCard from '@/components/Product/ProductCard.vue';
import ProductModal from '@/components/Product/ProductModal.vue';

//進入頁面先做的事情start 把所以種類讀進來
onMounted(function () {
    getAllProducts()
});
function getAllProducts() {
    axiosapi.get(`/products`).then(function(response){
        console.log("response",response)
        products.value = response.data

    })
}
//進入頁面先做的事情end
const products = ref([]);
const product = ref({});



</script>
    
<style>
    
</style>