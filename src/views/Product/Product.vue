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
            <ProductCard :product="product" @delete="callRemove(product.id)" @open-update="openModal" >
            </ProductCard>
        </div>
    </div>
    <ProductModal   ref="productModal"
                    v-model:product="product"
                    :is-show-button-insert="isShowButtonInsert" 
                    @insert="callCreate" 
                    @update="callModify">
    </ProductModal>
 


</template>
    
<script setup >
import { ref, onMounted } from 'vue';
import axiosapi from '@/plugins/axios';
import ProductCard from '@/components/Product/ProductCard.vue';
const products = ref([]);//用AJAX接收進來的全部資料 


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



//Modal start
import ProductModal from '@/components/Product/ProductModal.vue';
const product = ref({});//v-model雙向資料綁定的對象
const productModal =ref(null);
const isShowButtonInsert = ref(true);

function openModal(action, id){
        console.log("openModal",action,id)
        if (action==="insert") {
            isShowButtonInsert.value = true;
            product.value = { };
        } else {
            isShowButtonInsert.value = false;  
             //有多拿到一個id參數 要做findbyid
            axiosapi.get(`/categories/${id}`).then(function(response){
                console.log("response",response)
                //const product = ref({}); 透過ref綁定元件 修改裡面的value
                // product.value =    {  id:response.data.id,
                //                     name:response.data.name
                //                     };
               
            })
           
        }
        productModal.value.showModal();
}
//Modal end

//新增
function callCreate(){
    console.log("callCreate",product.value);
    console.log("callCreate",product.value.Category);
    let request = {
        "name": product.value.name,
        "description": product.value.description,
        "color":product.value.color,
        "price":product.value.price,
        "categories":product.value.Category
    };
     axiosapi.post("/products", request).then(function(response) {
        console.log(response);
     })

    productModal.value.hideModal();


}

//修改

function callModify(){
    //物件
    console.log("callModify",product.value);
    //id
    console.log("callModify",product.value.id);
    productModal.value.hideModal();
}

//刪除





function callRemove(id){
    console.log("callRemove",id);
}


</script>
    
<style>
    
</style>