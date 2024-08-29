<template>
    <div class="container mt-4">
    <div class="row mb-3">
      <div class="col-md-6">
        <h2>錢包餘額</h2>
      </div>
      <div class="col-md-6 text-end">
        <!-- <h2>${{ totalBalance.toFixed(2) }}</h2> -->
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-md-12 text-end">
        <button class="btn btn-primary me-2" @click="showDepositModal = true">儲值</button>
        <button class="btn btn-secondary" @click="showWithdrawModal = true">提現</button>
      </div>
    </div>
    <div class="list-group">
      <div v-for="transaction in transactionData" :key="transaction.id" class="list-group-item">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <!-- <h5 class="mb-1">{{ transaction.description }}</h5> -->
            <small>{{ transaction.paymentMethod }} - {{ transaction.added }}</small>
          </div>
          <div class="text-end">
            <h5 :class="transaction.amount > 0 ? 'text-success' : 'text-danger'">
              $NTD {{ Math.abs(transaction.amount).toFixed(2) }}
            </h5>
            <button class="btn btn-sm btn-link" @click="toggleDetails(transaction)">
              {{ transaction.showDetails ? '收起' : '顯示更多' }}
            </button>
          </div>
        </div>
        <div v-if="transaction.showDetails" class="mt-3">
          <p>交易ID: {{ transaction.id }}</p>
          <p>備註: {{ transaction.transactionNo }}</p>
        </div>
      </div>
    </div>

    <!-- 儲值 Modal -->
    <div class="modal" tabindex="-1" :class="{ 'd-block': showDepositModal }">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">儲值</h5>
            <button type="button" class="btn-close" @click="showDepositModal = false"></button>
          </div>
          <div class="modal-body">
            <input v-model="depositAmount" type="number" class="form-control" placeholder="請輸入儲值金額">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showDepositModal = false">取消</button>
            <button type="button" class="btn btn-primary" @click="deposit">確認儲值</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 提現 Modal -->
    <div class="modal" tabindex="-1" :class="{ 'd-block': showWithdrawModal }">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">提現</h5>
            <button type="button" class="btn-close" @click="showWithdrawModal = false"></button>
          </div>
          <div class="modal-body">
            <input v-model="withdrawAmount" type="number" class="form-control" placeholder="請輸入提現金額">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showWithdrawModal = false">取消</button>
            <button type="button" class="btn btn-primary" @click="withdraw">確認提現</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "@/plugins/axios";
import useUserStore from "@/stores/userstore";

const userStore = useUserStore();
const userId = userStore.userId;

const transactionData = ref({});


onMounted(function () {
  callFind();
});

function callFind() {
    axios.get(`/transaction/${userId}`)
    .then((response) => {
    
        transactionData.value = response.data;
        console.log(transactionData.value);
  }).catch((error) => {
    console.log("error", error);
  });
}

// const totalBalance = computed(() => {
//   return transactionData.value.reduce((sum, transaction) => sum + transaction.amount, 0);
// });

const toggleDetails = (transaction) => {
  transaction.showDetails = !transaction.showDetails;
};

const showDepositModal = ref(false);
const showWithdrawModal = ref(false);
const depositAmount = ref(0);
const withdrawAmount = ref(0);

const deposit = () => {
  if (depositAmount.value > 0) {
    transactionData.value.unshift({
      id: transactionData.value.length + 1,
      description: 'Deposit',
      category: 'Deposit',
      date: new Date().toLocaleDateString(),
      amount: parseFloat(depositAmount.value),
      note: '儲值',
      showDetails: false
    });
    showDepositModal.value = false;
    depositAmount.value = 0;
  }
};

const withdraw = () => {
  if (withdrawAmount.value > 0 && withdrawAmount.value <= totalBalance.value) {
    transactionData.value.unshift({
      id: transactionData.value.length + 1,
      description: 'Withdrawal',
      category: 'Withdrawal',
      date: new Date().toLocaleDateString(),
      amount: -parseFloat(withdrawAmount.value),
      note: '提現',
      showDetails: false
    });
    showWithdrawModal.value = false;
    withdrawAmount.value = 0;
  } else {
    alert('提現金額無效或餘額不足');
  }
};

</script>

<style>
</style>
