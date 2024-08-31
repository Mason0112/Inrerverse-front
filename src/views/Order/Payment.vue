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
  
  const products = ref([]);
  const total = ref(0);
  const selectedPayment = ref('');
  const order = ref({});
  const status = ref(0);
  const paymentMethod = ref(0);



  
  onMounted(() => {
    products.value = JSON.parse(localStorage.getItem('checkoutProducts') || '[]');
    total.value = Number(localStorage.getItem('checkoutTotal') || '0');
  
    console.log("物件",products.value);
    console.log("總金額",total.value);
  });

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
    order.value = {   "paymentMethod"   : 1, 
                "status": 1, 
                "userId": 1
    }
    // 使用完後清除
    localStorage.removeItem('checkoutProducts');
    localStorage.removeItem('checkoutTotal');
  };
  </script>
  
  <style scoped>
  .ts-grid.is-2-columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  </style>