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
                                <th>#</th>
                                <th>商品圖片</th>
                                <th>名稱</th>
                                <th>金額</th>
                                <th>數量</th>
                                <th>小計</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(product, index) in products" :key="product.productId">
                                <td>{{ index + 1 }}</td>
                                <td>
                                    <img :src="`${path}/products/${product.productId}/latestphoto`"
                                        :alt="product.productName">
                                </td>
                                <td>{{ product.productName }}</td>
                                <td>NT$ {{ product.price }}</td>
                                <td>{{ product.vol }}</td>
                                <td>NT$ {{ product.price * product.vol }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="checkout-summary">
                <div class="ts-box">
                    <div class="ts-content is-padded">
                        <div class="ts-header is-heavy">訂單摘要</div>
                        <div class="ts-divider"></div>
                        <div class="ts-flex is-vertical">
                            <div class="ts-flex">
                                <div class="ts-text">總金額：</div>
                                <div class="ts-text is-strong">NT$ {{ calculateTotalAmount }}</div>
                            </div>
                            <div class="ts-space"></div>
                            <button class="ts-button is-fluid is-primary" @click="proceedToCheckout">前往付款</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted, computed,watch  } from 'vue'
import axiosapi from '@/plugins/axios';
import useUserStore from '@/stores/userstore';


const path = import.meta.env.VITE_API_URL;
const userStore = useUserStore();
const router = useRouter();
const products = ref([]);
const totalAmount = ref(0); 

const calculateTotalAmount = computed(() => {
    return products.value.reduce((total, product) => total + (product.price * product.vol), 0);
});

watch(calculateTotalAmount, (newValue) => {
    totalAmount.value = newValue;
});


onMounted(() => {
    console.log(userStore.userId);
    getUserCart(userStore.userId);
});

function getUserCart(request) {
    axiosapi.get(`/cart/user/${request}`).then(function (productResponse) {
        console.log("列出清單", productResponse.data);
        products.value = productResponse.data;
    });
}

function proceedToCheckout() {
  console.log("前往結帳");
  localStorage.setItem('checkoutProducts', JSON.stringify(products.value));
  localStorage.setItem('checkoutTotal', totalAmount.value);
  router.push({ name: 'order-payment' });
}
</script>
<style scoped>
body {
    width: 1800px;
    margin: 0 auto;
}

.cart-container {
    display: flex;
    gap: 20px;
}

.cart-list {
    flex: 1;
}

.checkout-summary {
    width: 300px;
}

.ts-table img {
    max-width: 100px;
    height: auto;
}
</style>