<template>
  <div class="payment-selection">
    <div class="payment-box">
      <div class="payment-header">
        <h3 class="main-title">選擇付款方式</h3>
      </div>
      <div class="payment-content">
        <div class="payment-options">
          <label class="payment-option">
            <input type="radio" name="payment" value="cod" v-model="selectedPayment" />
            貨到付款
          </label>
          <label class="payment-option">
            <input type="radio" name="payment" value="linepay" v-model="selectedPayment" />
            LinePay
          </label>
          <label class="payment-option">
            <input type="radio" name="payment" value="creditcard" v-model="selectedPayment" />
            信用卡
          </label>
        </div>
      </div>
      <div class="payment-divider"></div>
      <div class="payment-footer">
        <button 
          class="checkout-button" 
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
import { onMounted, ref, watch } from 'vue';
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
  console.log("userId", userStore.userId);
  console.log("物件", products.value);
  console.log("總金額", total.value);
});

watch(selectedPayment, (newValue) => {
  if (newValue === 'linepay') {
    status.value = 1;
    paymentMethod.value = 1;
  } else if (newValue === 'cod') {
    status.value = 2;
    paymentMethod.value = 2;
  } else if (newValue === 'creditcard') {
    status.value = 1; // 或者根據您的需求設置適當的狀態
    paymentMethod.value = 3;
  } else {
    status.value = 0;
    paymentMethod.value = 0;
  }
});

function proceedToCheckout() {
  console.log("status", status.value);
  console.log("payment", paymentMethod.value);
  console.log("總金額2", total.value);

  order.value = {
    "paymentMethod": paymentMethod.value,
    "status": status.value,
    "userId": userStore.userId,
    "totalAmount": total.value
  };

  console.log("order", order.value);

  // Create order
  axiosapi.post(`/api/orders`, order.value)
    .then(function (orderResponse) {
      console.log("列出order", orderResponse.data.id);
      let request = {
        "orderId": orderResponse.data.id,
        "cartItems": products.value
      };

      // Create order details
      return axiosapi.post("/api/orders/create-with-details", request);
    })
    .then(function (detailResponse) {
      console.log("detailResponse", detailResponse.data[0].orderId);
      
      if (paymentMethod.value === 2) { // COD
        // For COD, we'll clear the cart and redirect to user orders
        return axiosapi.delete(`/cart/clear/${userStore.userId}`);
      } else { // LinePay
        // For LinePay, we'll continue with the LinePay process
        return axiosapi.get(`/api/orders/${detailResponse.data[0].orderId}`);
      }
    })
    .then(function (response) {
      if (paymentMethod.value === 2) { // COD
        // Redirect to user orders page for COD
        finishCheckout();
      } else { // LinePay
        // Continue with LinePay process
        return axiosapi.post(`/linePay/pay`, response.data);
      }
    })
    .then(function (linePayResponse) {
      if (linePayResponse) { // This will only run for LinePay
        console.log("linePay", linePayResponse);
        console.log("拿網址", linePayResponse.data.info.paymentUrl.web);
        window.open(linePayResponse.data.info.paymentUrl.web, '_blank');
        
        // Clear the cart for LinePay as well
        return axiosapi.delete(`/cart/clear/${userStore.userId}`);
      }
    })
    .then(function () {
      if (paymentMethod.value === 1) { // LinePay
        finishCheckout();
      }
    })
    .catch(function (error) {
      console.error("Error during checkout:", error);
      // Handle error (e.g., show error message to user)
    });
}

function finishCheckout() {
  // Clear localStorage
  localStorage.removeItem('checkoutProducts');
  localStorage.removeItem('checkoutTotal');

  // Redirect to user orders page
  router.push({ name: 'user-orders' });
}
</script>
  
  <style scoped>
.payment-selection {
  background-color: #F8F7FF;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(177, 151, 252, 0.2);
}

.payment-box {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
}

.payment-header {
  background-color: #B197FC;
  padding: 15px;
}

.main-title {
  color: white;
  margin: 0;
  text-align: center;
  font-weight: bold;
}

.payment-content {
  padding: 20px;
}

.payment-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.payment-option {
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid #B197FC;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.payment-option:hover {
  background-color: #F8F7FF;
}

.payment-option input[type="radio"] {
  margin-right: 10px;
}

.payment-divider {
  height: 1px;
  background-color: #dfd6fa;
  margin: 0 20px;
}

.payment-footer {
  padding: 20px;
}

.checkout-button {
  width: 100%;
  background-color: #FCE797;
  color: #3A3042;
  border: none;
  padding: 15px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: opacity 0.3s ease;
}

.checkout-button:hover:not(:disabled) {
  opacity: 0.8;
}

.checkout-button:disabled {
  background-color: #dfd6fa;
  cursor: not-allowed;
}

.checkout-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(177, 151, 252, 0.5);
}
</style>