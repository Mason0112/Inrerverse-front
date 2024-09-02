<template>
    <h3>Cart-product Table</h3>
    <div class="row">
        <div class="col-lg-3 col-md-6" v-for=" product in products" :key="product.id">
            <CartProductCard :product="product">
            </CartProductCard>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axiosapi from '@/plugins/axios';
import CartProductCard from '@/components/Cart/CartProductCard.vue';


const products = ref([]);//用AJAX接收進來的全部資料 
const categories = ref([]);//接資料進來

//進入頁面先做的事情start 把所以種類讀進來
onMounted(function () {
    getAllProducts()
    getAllCategories()
});
function getAllProducts() {
    axiosapi.get(`/products`).then(function (response) {
        console.log("responseproducts", response)
        products.value = response.data

    })
}
function getAllCategories() {
    axiosapi.get(`/categories`).then(function (response) {
        console.log("responsecategories", response)
        categories.value = response.data
    })
}

//進入頁面先做的事情end




</script>

<style></style>