<template>
  <div class="wallet-container">
    <h1>我的錢包</h1>
    
    <div class="balance-info">
      <h2>錢包餘額 <span class="info-icon" @click="showBalanceInfo">?</span></h2>
      <div class="balance-grid">
        <div class="balance-item">
          <h3>總計</h3>
          <p class="amount">NT${{ totalBalance }}</p>
        </div>
        <div class="balance-item">
          <h3>不可提現的SHEIN餘額</h3>
          <p class="amount">{{ nonWithdrawableBalance }}</p>
          <p class="note">僅適用於SHEIN購買</p>
        </div>
        <div class="balance-item">
          <h3>可提現的SHEIN餘額</h3>
          <p class="amount">NT${{ withdrawableBalance }}</p>
          <button @click="withdraw" class="withdraw-btn">提取存款</button>
        </div>
      </div>
    </div>

    <div class="transaction-history">
      <h2>錢包歷史 <span class="link" @click="showAllTransactions">查看我們</span></h2>
      <table>
        <thead>
          <tr>
            <th>日期</th>
            <th>類型</th>
            <th>訂單號</th>
            <th>消費金額</th>
            <th>狀態</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(transaction, index) in transactions" :key="index">
            <td>{{ transaction.date }}</td>
            <td>{{ transaction.type }}</td>
            <td>{{ transaction.orderId }}</td>
            <td :class="{ 'positive': transaction.amount > 0, 'negative': transaction.amount < 0 }">
              {{ formatAmount(transaction.amount) }}
            </td>
            <td>{{ transaction.status }}</td>
          </tr>
        </tbody>
      </table>
      <div class="pagination">
        <span>共1頁</span>
        <button class="page-btn active">1</button>
      </div>
    </div>

    <button @click="topUp" class="top-up-btn">儲值</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const totalBalance = ref(209);
const nonWithdrawableBalance = ref(0);
const withdrawableBalance = computed(() => totalBalance.value - nonWithdrawableBalance.value);

const transactions = ref([
  { date: '2024/06/29 22:25:52', type: '購物', orderId: 'GSHNHD22B00NJ59', amount: -545, status: '已完成' },
  { date: '2024/06/28 11:30:10', type: '退款', orderId: 'GSHNHO22F00181C', amount: 754, status: '已完成' },
]);

const formatAmount = (amount) => {
  return amount > 0 ? `+NT$${amount}` : `-NT$${Math.abs(amount)}`;
};

const showBalanceInfo = () => {
  alert('這裡顯示餘額的詳細信息');
};

const showAllTransactions = () => {
  alert('這裡顯示所有交易歷史');
};

const withdraw = () => {
  alert('處理提款邏輯');
};

const topUp = () => {
  alert('處理儲值邏輯');
};
</script>

<style scoped>
.wallet-container {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1, h2 {
  color: #333;
}

.balance-info {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.balance-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.balance-item {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
}

.amount {
  font-size: 1.5em;
  font-weight: bold;
  color: #0066cc;
}

.withdraw-btn, .top-up-btn {
  background-color: #0066cc;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  margin-top: 10px;
}

.transaction-history {
  margin-top: 30px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

.positive {
  color: green;
}

.negative {
  color: red;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.page-btn {
  background-color: #f2f2f2;
  border: 1px solid #ddd;
  padding: 5px 10px;
  margin-left: 5px;
  cursor: pointer;
}

.page-btn.active {
  background-color: #0066cc;
  color: white;
}

.info-icon, .link {
  color: #0066cc;
  cursor: pointer;
}

.note {
  font-size: 0.8em;
  color: #666;
}

.top-up-btn {
  display: block;
  margin: 20px auto;
  font-size: 1.2em;
  padding: 15px 30px;
}
</style>