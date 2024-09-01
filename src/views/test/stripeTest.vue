<template>
    <form @submit.prevent="handleSubmit" id="payment-form">
        <div>
            <label for="amount">儲值金額</label>
            <input type="number" id="amount" v-model="amount" value="200">
        </div>
        <div>
            <label for="card-element">
                金融卡資訊
            </label>
            <div id="card-element">
                <!-- A Stripe Element will be inserted here. -->
            </div>
            <!-- Used to display form errors. -->
            <div id="card-errors" role="alert">{{ cardErrors }}</div>
        </div>
        <button type="submit">儲值</button>
    </form>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { loadStripe } from '@stripe/stripe-js'
import axios from '@/plugins/axios'
import { useRouter } from 'vue-router'
import useUserStore from "@/stores/userstore";

const userStore = useUserStore();
const userId = userStore.userId;
const router = useRouter()

const amount = ref(200)
const stripe = ref(null)
const card = ref(null)
const cardErrors = ref('')


onMounted(async () => {
    // 載入 Stripe
    stripe.value = await loadStripe('pk_test_51PtkQIP1MEI3D9bvY2dSwQeGWfXWl8LBLP4XBXtnU6BwrpECvUVbn4Jn7OwXbNgUuOYRwhIt0LGwNYwY6ZVZ0DTx005c4jRv46')
    const elements = stripe.value.elements()

    // 定義樣式
    const style = {
        base: {
            color: "#32325d",
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
                color: "#aab7c4"
            }
        },
        invalid: {
            color: "#fa755a",
            iconColor: "#fa755a"
        }
    }
    // 創建 card 元素
    card.value = elements.create("card", { style: style })
    // 掛載到 DOM
    card.value.mount('#card-element')

    // 處理驗證錯誤
    card.value.on('change', (event) => {
        if (event.error) {
            cardErrors.value = event.error.message
        } else {
            cardErrors.value = ''
        }
    });
})

const handleSubmit = async () => {
    if (!stripe.value || !card.value) {
        console.error('Stripe not initialized')
        return
    }

    const result = await stripe.value.createToken(card.value)

    if (result.error) {
        cardErrors.value = result.error.message
    } else {
        await stripeTokenHandler(result.token)
    }
}

const stripeTokenHandler = async (token) => {
    try {
        // 首先处理支付
        const chargeResponse = await axios.post('/transaction/charge', {
            token: token.id,
            amount: amount.value * 100
        });
        console.log('Payment successful:', chargeResponse.data);

        // 支付成功后，添加交易记录
        const addTransactionResponse = await axios.post('/transaction/add', {
            transactionNo: chargeResponse.data,
            status: 1,
            amount: amount.value.toString(),
            paymentMethod: 'Stripe',
            user: {
                id: userId
            }
        });
        console.log('Transaction added:', addTransactionResponse.data);

        // 所有操作成功后，重定向到用户资料页面
        router.push('/user/profile');

    } catch (error) {
        console.error('Operation failed:', error);
        cardErrors.value = 'Operation failed. Please try again.';
        const addTransactionResponse = await axios.post('/transaction/add', {
            transactionNo: chargeResponse.data,
            status: 0,
            amount: amount.value.toString(),
            paymentMethod: 'Stripe',
            user: {
                id: userId
            }
        });
        console.log('Transaction added:', addTransactionResponse.data);
    }
};
</script>

<style scoped>
/* 整體表單樣式 */
#payment-form {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 標籤樣式 */
label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    color: #333;
}

/* 輸入框樣式 */
input[type="number"] {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
}

/* Stripe Element 容器樣式 */
#card-element {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: white;
    margin-bottom: 20px;
}

/* 錯誤訊息樣式 */
#card-errors {
    color: #dc3545;
    font-size: 14px;
    margin-top: 10px;
}

/* 提交按鈕樣式 */
button[type="submit"] {
    width: 100%;
    padding: 12px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button[type="submit"]:hover {
    background-color: #0056b3;
}
</style>