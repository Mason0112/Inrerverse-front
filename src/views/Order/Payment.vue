<template>
    <div class="ts-container is-narrow">
      <div class="ts-box is-elevated">
        <div class="ts-content is-tertiary">
          <h3 class="ts-header is-2">付款方式</h3>
        </div>
        <div class="ts-content">
          <div class="ts-grid is-2-columns">
            <label class="ts-radio is-large">
              <input type="radio" name="payment" value="cod" v-model="selectedPayment" />
              貨到付款
            </label>
            <label class="ts-radio is-large">
              <input type="radio" name="payment" value="linepay" v-model="selectedPayment" />
              LinePay
            </label>
          </div>
        </div>
        <div class="ts-divider"></div>
        <div class="ts-content">
          <button 
            class="ts-button is-fluid is-primary is-large" 
            @click="proceedToCheckout"
            :disabled="!selectedPayment"
          >
            前往付款
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref,watch } from 'vue';
  import useUserStore from '@/stores/userstore';
  import axiosapi from '@/plugins/axios';
  import { useRouter } from 'vue-router';

  const products = ref([]);
  const total = ref(0);
  const selectedPayment = ref('');
  const order = ref({});
  const status = ref(0);
  const paymentMethod = ref(0);
  const userStore = useUserStore();
  const router = useRouter();

  



  
  onMounted(() => {
    products.value = JSON.parse(localStorage.getItem('checkoutProducts') || '[]');
    total.value = Number(localStorage.getItem('checkoutTotal') || '0');
    console.log("userId",userStore.userId);
    console.log("物件",products.value);
    console.log("總金額",total.value);

  });
  //paymentMethod: 1:linePay 2:貨到付款
  //status 1:等待確認中 2:已付款 3:已取消

  watch(selectedPayment, (newValue) => {
      if (newValue === 'linepay') {
        status.value = 1;
        paymentMethod.value = 1;
      } else if (newValue === 'cod') {
        status.value = 2;
        paymentMethod.value = 2;
      } else {
        // 重置為默認值或處理其他情況
        status.value = 0;
        paymentMethod.value = 0;
      }
    });




  
  function proceedToCheckout (){
    console.log("status",status.value);
    console.log("payment",paymentMethod.value);
    console.log("總金額2",total.value);

    //第一個orderAJAX建立出訂單
    order.value = {   "paymentMethod"   : paymentMethod.value, 
                      "status": status.value, 
                      "userId": userStore.userId,
                      "totalAmount": total.value
    }

    console.log("order",order.value);
    axiosapi.post(`/api/orders`,order.value).then(function (orderResponse) {
        console.log("列出order", orderResponse.data.id);
        console.log("cart",products.value)
        let request = {
                          "orderId" :orderResponse.data.id ,
                          "cartItems":products.value
                      }
        //第二個AJAX把cart的內容轉成order
        return axiosapi.post("/api/orders/create-with-details", request);
    }).then(function (detailResponse){
        console.log("detailResponse",detailResponse);
        console.log("userId結帳用",userStore.userId);
        //第三個AJAX清空購物車
        return axiosapi.delete(`/cart/clear/${userStore.userId}`);
    }).then(function(){
       // 使用完後清除
    localStorage.removeItem('checkoutProducts');
    localStorage.removeItem('checkoutTotal');


    router.push({ name: 'user-orders' });

    });
  };






  </script>
  
  <style scoped>
  .ts-grid.is-2-columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  </style>