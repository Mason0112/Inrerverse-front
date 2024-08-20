<template>
    <div>
      <navbar></navbar>
      <category></category>
    </div>
    <RouterView></RouterView>    
</template>
  
<script setup>
  import navbar from './views/navbar.vue';
  import category from './views/Category/category.vue';

  import 'bootstrap/dist/css/bootstrap.min.css';
  import 'bootstrap/dist/js/bootstrap.bundle.min.js';
</script>
  
<style>
  
</style>