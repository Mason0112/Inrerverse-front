<template>
  <div class="wallet-container">
    <div class="balance-section text-center mb-4">
      <h6>錢包餘額</h6>
      <h4>臺幣(TWD) ${{ userData.walletBalance || 0 }} </h4>
    </div>
    <div class="action-buttons d-flex justify-content-end mb-4">
      <button class="btn btn-primary me-2" @click="showDepositModal = true">儲值</button>
      <button class="btn btn-secondary" @click="showWithdrawModal = true">提款</button>
    </div>
    <ul class="list-group">
      <li class="list-group-item" v-for="transaction in transactionsWithBalance" :key="transaction.id">
        <div class="transaction-item">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="date">{{ formatDate(transaction.added) }}</span>
            <div class="d-flex align-items-center">
              <div class="amount-section text-end me-3">
                <div>
                  <span :class="['amount', { 'text-danger': transaction.amount < 0, 'text-decoration-line-through': transaction.status === 0 }]">
                    {{ transaction.amount < 0 ? '-' : '' }} ${{ Math.abs(transaction.amount) }}
                  </span>
                </div>
                <div v-if="transaction.status !== 0">
                  <span class="balance text-muted">
                    餘額: ${{ transaction.balance || '0' }}
                  </span>
                </div>
              </div>
              <span :class="['badge', getStatusBadgeClass(transaction.status)]">
                {{ getStatusText(transaction.status) }}
              </span>
            </div>
          </div>
          <div class="accordion" :id="'accordion-' + transaction.id">
            <div class="accordion-item">
              <h2 class="accordion-header" :id="'heading-' + transaction.id">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse-' + transaction.id" aria-expanded="false" :aria-controls="'collapse-' + transaction.id">
                  詳細信息
                </button>
              </h2>
              <div :id="'collapse-' + transaction.id" class="accordion-collapse collapse" :aria-labelledby="'heading-' + transaction.id" :data-bs-parent="'#accordion-' + transaction.id">
                <div class="accordion-body">
                  <p>支付方式: {{ transaction.paymentMethod }}</p>
                  <p>備註: {{ transaction.transactionNo }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>

    <n-modal v-model:show="showDepositModal">
    <n-card style="width: 600px" title="儲值" :bordered="false" size="huge" role="dialog" aria-modal="true">
      <n-space vertical>
        <n-radio-group v-model:value="paymentMethod" name="paymentMethod">
          <n-space>
            <n-radio value="creditCard">信用卡支付</n-radio>
            <n-radio value="linePay">LINE Pay</n-radio>
          </n-space>
        </n-radio-group>
        <n-input-number v-model:value="depositAmount" placeholder="請輸入儲值金額" min="100" step="100"/>
      </n-space>
      <template #footer>
        <n-button @click="showDepositModal = false">取消</n-button>
        <n-button type="primary" @click="deposit">確認儲值</n-button>
      </template>
    </n-card>
  </n-modal>
    
    <n-modal v-model:show="showWithdrawModal">
      <n-card style="width: 600px" title="提現" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <n-input-number v-model:value="withdrawAmount" placeholder="請輸入提現金額" min="0" step="100"/>
        <template #footer>
          <n-button @click="showWithdrawModal = false">取消</n-button>
          <n-button type="primary" @click="withdraw">確認提款</n-button>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "@/plugins/axios";
import { useRouter } from "vue-router";
import useUserStore from "@/stores/userstore";
import { useDepositStore } from '@/stores/depositStore'
import { useMessage } from 'naive-ui';

const userStore = useUserStore();
const depositStore = useDepositStore()
const userId = userStore.userId;
const router = useRouter();
const message = useMessage();

const userData = ref({ walletBalance: 0 });
const transactionData = ref([]);

const isLoading = ref(true);
const showDepositModal = ref(false);
const showWithdrawModal = ref(false);
const depositAmount = ref(100);
const withdrawAmount = ref(0);
const paymentMethod = ref('creditCard')

onMounted(callFind);

function callFind() {
  isLoading.value = true;
  Promise.all([
    axios.get(`/user/secure/${userId}`),
    axios.get(`/transaction/${userId}`)
  ]).then(([userResponse, transactionResponse]) => {
    console.log(userResponse.data)
    console.log(transactionResponse.data)

    userData.value = userResponse.data;
    transactionData.value = transactionResponse.data.sort((a, b) => new Date(b.added) - new Date(a.added));
  }).catch((error) => {
    console.log("error", error);
  }).finally(() => {
    isLoading.value = false;
  });
}

const transactionsWithBalance = computed(() => {
  let balance = userData.value.walletBalance;
  return transactionData.value.map(transaction => {
    const transactionWithBalance = { ...transaction };
    if (transaction.status ===1 || transaction.status === 2) {
      transactionWithBalance.balance = balance;
      balance -= transaction.amount;
    } else {
      transactionWithBalance.balance = null;
    }
    return transactionWithBalance;
  });
});
// 處理頁面渲染的值
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(/\//g, '-');
};

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 0: return 'bg-danger';
    case 1: return 'bg-success';
    case 2: return 'bg-info';
    default: return 'bg-warning';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 0: return '失敗';
    case 1: return '成功';
    case 2: return '處理中';
    default: return '未知';
  }
};

// 儲值：取得使用者輸入的值後，直接導向付款頁面
function deposit() {
  if (depositAmount.value > 0) {
    depositStore.setDepositAmount(depositAmount.value)
    depositStore.setPaymentMethod(paymentMethod.value)
    
    if (paymentMethod.value === 'creditCard') {
      router.push('/payment')
    } else if (paymentMethod.value === 'linePay') {
      router.push('/payment/line-pay')
    }
    
    showDepositModal.value = false
  }
}

// 生成唯一交易序號的函數
const generateTransactionId = () => {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000000);
  return `TX-${timestamp}-${random}`;
};


// 提款
function withdraw() {
  console.log(withdrawAmount)
  if (withdrawAmount.value <= 0) {
    message.error('提現金額必須大於零', {
      closable: true,
      duration: 5000
    });
    return;
  }

  // 新增交易的函數
  const transactionNo = generateTransactionId();
  
  axios.post('/transaction/add', {
    transactionNo: transactionNo,
    amount: -withdrawAmount.value,
    paymentMethod: '提現',
    status: 2,
    user: {
      id: userId
    }
  })
  .then(response => {
    if (response.status === 201) {  // HttpStatus.CREATED
      message.success('提現請求已提交，正在處理中', {
        closable: true,
        duration: 5000
      });
      showWithdrawModal.value = false;
      withdrawAmount.value = 0;
      callFind();  // 更新交易列表
    } else {
      throw new Error('提現請求失敗');
    }
  })
  .catch(error => {
    if (error.response && error.response.status === 400) {  // HttpStatus.BAD_REQUEST
      message.error('餘額不足', {
        closable: true,
        duration: 5000
      });
    } else {
      message.error('提現過程中發生錯誤', {
        closable: true,
        duration: 5000
      });
    }
  });
}
</script>

<style scoped>
.wallet-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-size: 16px;
}

.amount {
  font-size: 1.15em;
  font-weight: bold;
}

.balance {
  font-size: 0.85em;
}

.date {
  color: #555;
}

.list-group-item {
  padding: 18px;
}

.btn {
  font-size: 0.95em;
}

.badge {
  font-size: 0.9em;
}
/* 確保詳細信息內容靠左對齊 */
.accordion-body {
  text-align: left;
}
</style>