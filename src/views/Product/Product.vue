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
        <div class="col-lg-3 col-md-6" v-for=" product in products" :key="product.id">
            <ProductCard :product="product" @delete="callRemove(product.id)" @open-update="openModal">
            </ProductCard>
        </div>
    </div>
    <ProductModal   ref="productModal"
                    v-model:product="product" 
                    :categories="categories"
                    :is-show-button-insert="isShowButtonInsert" 
                    :is-show-category="isShowCategory"
                    @insert="callCreate" 
                    @update="callModify"
                    @fileUpload="handleFileUpload">
    </ProductModal>



</template>

<script setup>
import { ref, onMounted } from 'vue';
import axiosapi from '@/plugins/axios';
import ProductCard from '@/components/Product/ProductCard.vue';
const products = ref([]);//用AJAX接收進來的全部資料 
const categories = ref([]);//接資料進來
const fileObject = ref(null);

//進入頁面先做的事情start 把所以種類讀進來
onMounted(function () {
    getAllProducts()
    getAllCategories()
});
function getAllProducts() {
    axiosapi.get(`/products`).then(function (response) {
        console.log("response", response)
        products.value = response.data

    })
}
function getAllCategories() {
    axiosapi.get(`/categories`).then(function (response) {
        console.log("response", response)
        categories.value = response.data
    })
}

//進入頁面先做的事情end



//Modal start
import ProductModal from '@/components/Product/ProductModal.vue';
const product = ref({});
const category = ref({});//新增或修改時拿來存category的
const productModal = ref(null);//v-model雙向資料綁定的對象 控制開關
const isShowButtonInsert = ref(true);
const isShowCategory = ref(true);

function openModal(action, id) {
    console.log("openModal", action, id)
    if (action === "insert") {
        isShowButtonInsert.value = true;
        isShowCategory.value =true;
        product.value = ({});
    } else {
        isShowButtonInsert.value = false;
        isShowCategory.value =false;
        //有多拿到一個id參數 要做findbyid
        axiosapi.get(`/products/${id}`).then(function (response) {
            console.log("response", response)
            product.value =    {  id:response.data.id,
                                name:response.data.name,
                                description:response.data.description,
                                color:response.data.color,
                                price:response.data.price
                                };
            console.log("responseProduct", product.value);

        })

        }
    productModal.value.showModal();
}
//Modal end

//新增
function callCreate() {
    console.log("callCreate", product.value);
    console.log("callCreate", product.value.category);
    // 第一步：获取类别信息
    axiosapi.get(`/categories/${product.value.category}`).then(function (response) {
        console.log("response", response)
        category.value = {
            id: response.data.id,
            name: response.data.name
        };
        // 第二步：创建产品
        let request = {
            "name": product.value.name,
            "description": product.value.description,
            "color": product.value.color,
            "price": product.value.price,
            "categories": category.value
        };

        return axiosapi.post("/products", request);
    }).then(function (productResponse) {
        console.log("Product created", productResponse);
         // 第三步：上传图片（如果有）
         if (fileObject.value) {
                const formData = new FormData();
                formData.append('file', fileObject.value);
                formData.append('productId', productResponse.data.id); // 假设后端返回的产品数据中包含 id

                return axiosapi.post("/api/product-photos", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
        }
            
        return Promise.resolve(); // 如果没有图片，返回一个已解决的 Promise
    });
    productModal.value.hideModal();
}

// 处理文件选择
function handleFileUpload(event) {
    console.log("file",event)
    fileObject.value = event;
}

//修改

function callModify() {
    //物件
    console.log("callModify", product.value);
    //id
    console.log("callModify", product.value.id);

    let request = {
                    "name": product.value.name,
                    "description": product.value.description,
                    "color": product.value.color,
                    "price": product.value.price
                    };
        axiosapi.put(`/products/${product.value.id}`, request).then(function(response) {
            console.log("Product modify", response);
         // 第三步：上传图片（如果有）
            if (fileObject.value) {
                const formData = new FormData();
                formData.append('file', fileObject.value);
                formData.append('productId', response.data.id); // 假设后端返回的产品数据中包含 id

                return axiosapi.post("/api/product-photos", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
        }  
        return Promise.resolve(); // 如果没有图片，返回一个已解决的 Promise
         });


    productModal.value.hideModal();
}

//刪除
function callRemove(id){
    console.log("callRemove",id);
    axiosapi.delete(`/products/${id}`).then(function(response){
    })
}

//重新導頁面的function 之後要加在新增刪除修改後面



</script>

<style></style>