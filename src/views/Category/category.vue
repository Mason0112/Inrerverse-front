<template>
    <h3>Category Table</h3>
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
        <div class="col-lg-3 col-md-6" v-for=" category in categories" :key="category.id">
            <CategoryCard :category="category" @delete="callRemove(category.id)" @open-update="openModal"></CategoryCard>
        </div>
    </div>

    <CategoryModal ref="categoryModal" 
    v-model:category="category" 
    :is-show-button-insert="isShowButtonInsert" 
    @insert="callCreate" 
    @update="callModify"></CategoryModal>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axiosapi from '@/plugins/axios';
import Swal from 'sweetalert2';
import CategoryCard from '@/components/category/CategoryCard.vue';
import CategoryModal from '@/components/category/CategoryModal.vue';

const categories = ref([]);

//Modal start
const categoryModal =ref(null);
const category = ref({});
const isShowButtonInsert = ref(true);

function openModal(action, id){
        console.log("openModal",action,id)
        if (action==="insert") {
            isShowButtonInsert.value = true;
            category.value = { };
        } else {
            isShowButtonInsert.value = false;  
            category.value = { name : '不知道'};
            //有多拿到一個id參數 要做findbyid
        }
        categoryModal.value.showModal();
}
//Modal end

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

function callCreate(){
    console.log("callCreate",category.value);
    categoryModal.value.hideModal();
}

function callModify(){
    console.log("callModify",category.value);
    categoryModal.value.hideModal();
}



</script>

<style></style>