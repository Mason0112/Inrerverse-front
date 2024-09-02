<template>
    <span style="text-decoration: ">分類管理</span>
 
        <span >
            <button type="button" class="ts-button " @click="openModal('insert')">開啟新增</button>
        </span>

    <br>

    <div class="row">
        <div class="col-4">

        </div>
    </div>
    <br>


    <span >
        <span class="col-lg-3 col-md-6" v-for=" category in categories" :key="category.id">
            <CategoryCard :category="category" @delete="callRemove(category.id)" @open-update="openModal"></CategoryCard>
        </span>
    </span>

    <CategoryModal ref="categoryModal" 
    v-model:category="category" 
    :is-show-button-insert="isShowButtonInsert" 
    @insert="callCreate" 
    @update="callModify"></CategoryModal>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import axiosapi from '@/plugins/axios';
import CategoryCard from '@/components/category/CategoryCard.vue';
import CategoryModal from '@/components/category/CategoryModal.vue';
const categories = ref([]);//接資料進來


//進入頁面先做的事情start 把所以種類讀進來
onMounted(function () {
    getAllCategories()
});
function getAllCategories() {
    axiosapi.get(`/categories`).then(function(response){
        console.log("response",response)
        categories.value = response.data
    })
}
//進入頁面先做的事情end


//Modal start
const categoryModal =ref(null);
const isShowButtonInsert = ref(true);
const category = ref({});//v-model 雙向資料綁定的對象
function openModal(action, id){
        console.log("openModal",action,id)
        if (action==="insert") {
            isShowButtonInsert.value = true;
            category.value = { };
        } else {
            isShowButtonInsert.value = false;  
             //有多拿到一個id參數 要做findbyid
            axiosapi.get(`/categories/${id}`).then(function(response){
                console.log("response",response)
                category.value =    {  id:response.data.id,
                                    name:response.data.name
                                    };
               
            })
           
        }
        categoryModal.value.showModal();
}
//Modal end


//刪除
function callRemove(id){
    console.log("callRemove",id);
    axiosapi.delete(`/categories/${id}`).then(function(response){
    })
}
//新增
function callCreate(){
    console.log("callCreate",category.value);
    axiosapi.post("/categories", category.value).then(function(response) {
    })
    categoryModal.value.hideModal();
}
//修改
function callModify(){
    //物件
    console.log("callModify",category.value);
    //id
    console.log("callModify",category.value.id);

    axiosapi.put(`/categories/${category.value.id}`, category.value).then(function(response) {
    })
    categoryModal.value.hideModal();
}



</script>

<style scoped>

.ts-button{
border: 0;   background-color: var(--ts-primary-400) 


}
</style>