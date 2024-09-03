<template>
    <div>
      <navbar></navbar>
      <navbarTest></navbarTest>
    </div>
    <div>
    <RouterView></RouterView>
    </div>
</template>

<script setup>
import navbar from './views/navbar.vue';
import navbarTest from './views/navbarTest.vue';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'tocas/dist/tocas.min.css'

import axios from '@/plugins/axios';
import useUserStore from '@/stores/userstore';

// 初始化應用時設置 axios headers，這是用來在重新整理f5的時候，不會丟失token的方法
const userStore = useUserStore();

if (userStore.token) {
  axios.defaults.headers.authorization = `Bearer ${userStore.token}`;
}

</script>

<style>

:root {
  --primary-color: #B197FC;
  --secondary-color: #97C4FC;
  --accent-color: #FCB197;
  --background-color: #F8F7FF;
  --text-color: #3A3042;
  --light-text-color: #6C6474;
  --border-color: #D4C4FC;
}

body {
  margin-top: 20px;
  background: #FAFAFA;
  background-color: var(--background-color);
  color: var(--text-color);
}
.ts-box, .modal-content {
  background-color: #FFFFFF;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(177, 151, 252, 0.1);
}

.ts-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.ts-table th {
  background-color: var(--primary-color);
  color: #FFFFFF;
  padding: 12px;
  font-weight: 600;
}

.ts-table td {
  padding: 12px;
  border-bottom: 1px solid var(--border-color);
}

.ts-table tr:last-child td {
  border-bottom: none;
}

.btn, .ts-button {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;
}

.btn-primary, .ts-button.is-primary {
  background-color: var(--primary-color);
  color: #FFFFFF;
}

.btn-primary:hover, .ts-button.is-primary:hover {
  background-color: #9F7EFC;
}

.btn-secondary {
  background-color: var(--secondary-color);
  color: var(--text-color);
}

.btn-secondary:hover {
  background-color: #7AAEFB;
}

.btn-danger, .btn-warning {
  background-color: var(--accent-color);
  color: var(--text-color);
}

.btn-danger:hover, .btn-warning:hover {
  background-color: #FB9D7A;
}

.ts-breadcrumb {
  background-color: var(--background-color);
  padding: 10px;
  border-radius: 4px;
}

.ts-breadcrumb .item {
  color: var(--primary-color);
  font-weight: 600;
}

input[type="text"], input[type="number"], select {
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 8px;
  background-color: #FFFFFF;
  color: var(--text-color);
}

input[type="text"]:focus, input[type="number"]:focus, select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(177, 151, 252, 0.2);
}

.modal-header {
  background-color: var(--primary-color);
  color: #FFFFFF;
}

.modal-footer {
  background-color: var(--background-color);
}

/* 添加一些動畫效果 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .cart-container {
    flex-direction: column;
  }

  .checkout-summary {
    width: 100%;
  }
}
</style>