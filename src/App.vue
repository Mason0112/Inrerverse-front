<template>
    <div>
      <navbar></navbar>
    </div>
    <RouterView></RouterView>
</template>
  
<script setup>
  import navbar from './views/navbar.vue';


  import 'bootstrap/dist/css/bootstrap.min.css';
  import 'bootstrap/dist/js/bootstrap.bundle.min.js';
</script>
  
<style>
  
</style>