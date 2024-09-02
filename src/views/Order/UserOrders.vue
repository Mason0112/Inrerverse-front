<template>
    <div>
        <div class="ts-breadcrumb is-stepped is-divided">
            <a href="#!" class="item">我的購物車</a>
        </div>
        <div class="cart-container has-top-spaced">
            <div class="cart-list">
                <div class="ts-box">
                    <table class="ts-table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>訂單編號</th>
                                <th>狀態</th>
                                <th>付款方式</th>
                                <th>總金額</th>
                                <th>小計</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(product, index) in products" :key="product.productId">
                                <td>{{ index + 1 }}</td>
                                <td>{{ product.productName }}</td>
                                <td>NT$ {{ product.price }}</td>
                                <td>{{ product.vol }}</td>
                                <td>NT$ {{ product.price * product.vol }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
    
<script setup >
  //paymentMethod: 1:linePay 2:貨到付款
  //status 1:等待確認中 2:已付款 3:已取消
import { ref, onMounted } from 'vue';
import axiosapi from '@/plugins/axios';
import useUserStore from '@/stores/userstore';

const userStore = useUserStore();
const userOrders = ref([]);


onMounted(function () {
    console.log("onMounted UserId",userStore.userId )
    getAllOrdersByUser(userStore.userId);
});

function getAllOrdersByUser(id) {
    axiosapi.get(`/api/orders/user/${id}/paginated`).then(function (response) {
        console.log("responseUserOrders", response.data.content);
        userOrders.value = response.data.content;
    })
}


</script>
    
<style scoped>
    
</style>