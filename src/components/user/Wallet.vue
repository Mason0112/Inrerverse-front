<template>
  <div class="wallet-container">
    <div class="balance-section">
      <h6>錢包餘額</h6>
      <h4>臺幣(TWD) ${{ userData.walletBalance || 0 }} </h4>
    </div>

    <div class="action-buttons">
      <n-button type="primary" @click="showDepositModal = true">儲值</n-button>
      <n-button @click="showWithdrawModal = true">提現</n-button>
    </div>

    <n-list hoverable clickable>
      <n-list-item v-for="transaction in transactionsWithBalance" :key="transaction.id">
        <div class="transaction-item">
          <div class="transaction-header">
            <span class="date">{{ formatDate(transaction.added) }}</span>
            <div class="right-aligned-content">
              <div class="amount-section">
                <span class="amount" :class="{ 'negative': transaction.amount < 0, 'failed': transaction.status === 0 }">
                  {{ transaction.amount < 0 ? '-' : '' }} ${{ Math.abs(transaction.amount) }}
                </span>
                <span v-if="transaction.status !== 0" class="balance">
                  餘額: ${{ transaction.balance || '0' }}
                </span>
              </div>
              <n-tag :type="getStatusType(transaction.status)" class="status-tag">
                {{ getStatusText(transaction.status) }}
              </n-tag>
            </div>
          </div>
          <n-collapse>
            <n-collapse-item title="詳細信息">
              <p>支付方式: {{ transaction.paymentMethod }}</p>
              <p>備註: {{ transaction.transactionNo }}</p>
            </n-collapse-item>
          </n-collapse>
        </div>
      </n-list-item>
    </n-list>


    <n-modal v-model:show="showDepositModal">
      <n-card style="width: 600px" title="儲值" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <n-input-number v-model:value="depositAmount" placeholder="請輸入儲值金額" min="0" step="100"/>
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
          <n-button type="primary" @click="withdraw">確認提現</n-button>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "@/plugins/axios";
import useUserStore from "@/stores/userstore";
import { useDepositStore } from '@/stores/depositStore'
import { useMessage } from 'naive-ui';

const userStore = useUserStore();
const depositStore = useDepositStore()
const userId = userStore.userId;
const message = useMessage();

const userData = ref({ walletBalance: 0 });
const transactionData = ref([]);

const isLoading = ref(true);
const showDepositModal = ref(false);
const showWithdrawModal = ref(false);
const depositAmount = ref(0);
const withdrawAmount = ref(0);

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

const getStatusType = (status) => {
  switch (status) {
    case 0: return 'error';
    case 1: return 'success';
    case 2: return 'info';
    default: return 'default';
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

function deposit() {
  if (depositAmount.value > 0) {
    depositStore.setDepositAmount(depositAmount.value)
    router.push('/stripe')
  }
}

function withdraw() {
  console.log(withdrawAmount)
  if (withdrawAmount.value <= 0) {
    message.error('提現金額必須大於零', {
      closable: true,
      duration: 5000
    });
    return;
  }

  axios.post('/transaction/add', {
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

.balance-section {
  text-align: center;
  margin-bottom: 22px;
}

.balance-section h6 {
  margin-bottom: 10px;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-bottom: 22px;
}

.transaction-item {
  width: 100%;
}

.transaction-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 8px;
}

.right-aligned-content {
  display: flex;
  align-items: center;
  gap: 14px;
}

.date {
  /* font-size: 1.05em; */
  color: #555;
}

.amount-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.amount {
  font-size: 1.15em;
  font-weight: bold;
}

.amount.negative {
  color: #ff4d4f;
}

.amount.failed {
  text-decoration: line-through;
}

.balance {
  font-size: 0.95em;
  color: #666;
}

.status-tag {
  white-space: nowrap;
}

:deep(.n-list-item) {
  padding: 18px;
}

:deep(.n-button) {
  font-size: 0.95em;
}

:deep(.n-tag) {
  font-size: 0.9em;
}
</style>