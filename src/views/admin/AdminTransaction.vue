<template>
    <div class="container mt-4">
      <div class="row mb-3">
        <div class="col-md-4">
          <select v-model="selectedOption" class="form-select" @change="fetchTransactions">
            <option value="all">所有交易</option>
            <option value="handling">處理中交易</option>
          </select>
        </div>
        <div class="col-md-8">
          <div class="input-group">
            <input type="date" v-model="startDate" class="form-control" @change="fetchTransactions">
            <span class="input-group-text">至</span>
            <input type="date" v-model="endDate" class="form-control" @change="fetchTransactions">
          </div>
        </div>
      </div>
  
      <div v-if="loading" class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">加載中...</span>
        </div>
      </div>
  
      <div v-else>
        <h3>{{ dateRangeText }}</h3>
        <ul class="list-group">
          <li v-for="transaction in transactions" :key="transaction.id" class="list-group-item">
            {{ transaction.description }} - {{ transaction.amount }}
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import axios from "@/plugins/axios";
  
  const selectedOption = ref('all');
  const startDate = ref('');
  const endDate = ref('');
  const transactions = ref([]);
  const loading = ref(false);
  
  const dateRangeText = computed(() => {
    if (startDate.value && endDate.value) {
      return `${startDate.value} 至 ${endDate.value} 的交易`;
    }
    return '所有日期的交易';
  });
  
  const fetchTransactions = async () => {
    loading.value = true;
    const endpoint = selectedOption.value === 'all' ? '/admin/transaction/all' : '/admin/transaction/handling';
    try {
      const response = await axios.get(endpoint, {
        params: {
          startDate: startDate.value,
          endDate: endDate.value
        }
      });
      console.log(response.data)
      transactions.value = response.data;
    } catch (error) {
      console.error('獲取交易數據失敗：', error);
      // 這裡可以添加錯誤處理邏輯，比如顯示錯誤消息
    } finally {
      loading.value = false;
    }
  };
  
  // 初始加載
  onMounted(() => {
    fetchTransactions();
  });
  </script>