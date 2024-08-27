<template>
    <div class="wallet-container">
      <!-- 儲值按鈕 -->
      <div class="wallet-header">
        <button class="btn-recharge">儲值</button>
      </div>
  
      <!-- 錢包信用區塊 -->
      <div class="wallet-credit">
        <div class="credit-section">
          <span class="label">總計</span>
          <span class="amount">NT$209</span>
        </div>
        <div class="credit-section">
          <span class="label">不可提領的SHEIN餘額</span>
          <span class="amount">0</span>
          <small>僅適用於Interverse消費</small>
        </div>
        <div class="credit-section">
          <span class="label">可提領的SHEIN餘額</span>
          <span class="amount">NT$209</span>
          <button class="btn-withdraw">提取存款</button>
        </div>
      </div>
  
      <!-- 錢包歷史區塊 -->
      <div class="wallet-history">
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
            <tr>
              <td>2024/06/29 22:25:52</td>
              <td>購物</td>
              <td>GSHNHD220BONJ59</td>
              <td class="negative">-NT$545</td>
              <td>已完成</td>
            </tr>
            <tr>
              <td>2024/06/28 11:30:10</td>
              <td>退款</td>
              <td>GSHNHQ22F00181C</td>
              <td class="positive">+NT$754</td>
              <td>已完成</td>
            </tr>
          </tbody>
        </table>
  
        <!-- 頁碼區塊 -->
        <div class="pagination">
          <span>共1頁</span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  // 這裡你可以使用 Composition API 來處理數據
  </script>
  
  <style scoped>
  /* 全局樣式 */
  .wallet-container {
    max-width: 600px;
    margin: 0 auto;
    font-family: Arial, sans-serif;
  }
  
  /* 儲值按鈕樣式 */
  .wallet-header {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 16px;
  }
  
  .btn-recharge {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 6px 12px;
    cursor: pointer;
    border-radius: 4px;
    font-size: 14px;
  }
  
  .btn-recharge:hover {
    background-color: #0056b3;
  }
  
  /* 錢包信用樣式 */
  .wallet-credit {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    background-color: #f8f9fa;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 24px;
  }
  
  .credit-section {
    text-align: center;
  }
  
  .label {
    display: block;
    font-weight: bold;
    margin-bottom: 4px;
  }
  
  .amount {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 4px;
  }
  
  small {
    color: #6c757d;
    font-size: 12px;
  }
  
  /* 提取存款按鈕樣式 */
  .btn-withdraw {
    background-color: #343a40;
    color: white;
    border: none;
    padding: 4px 8px;
    cursor: pointer;
    border-radius: 4px;
    font-size: 12px;
  }
  
  .btn-withdraw:hover {
    background-color: #23272b;
  }
  
  /* 錢包歷史樣式 */
  .wallet-history {
    background-color: white;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }
  
  th, td {
    padding: 8px;
    text-align: left;
    border-bottom: 1px solid #dee2e6;
  }
  
  th {
    background-color: #f1f3f5;
  }
  
  .negative {
    color: #dc3545;
  }
  
  .positive {
    color: #28a745;
  }
  
  /* 頁碼樣式 */
  .pagination {
    text-align: center;
    margin-top: 16px;
    font-size: 14px;
    color: #6c757d;
  }
  </style>
  