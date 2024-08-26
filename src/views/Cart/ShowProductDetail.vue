<template>
        <h3>產品詳細資料</h3>

        
</template>
    
<script setup>
import { useRoute,useRouter } from 'vue-router';
import { ref, onMounted } from 'vue'
import axiosapi from '@/plugins/axios';
import useUserStore from '@/stores/userstore';

const userStore = useUserStore();
const route = useRoute();
const product = ref({});


onMounted(() => {
  const productId = route.params.id;
  console.log('Product ID from route:', productId);
  getProductById(productId);

});

function getProductById(id) {
    axiosapi.get(`/products/${id}`).then(function (response) {
        console.log("responseproducts", response)
        product.value = response.data
    })
}

</script>
    
<style>
    
</style>