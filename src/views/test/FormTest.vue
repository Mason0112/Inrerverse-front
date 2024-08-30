<template>
    <form @submit.prevent="onSubmit">
      <div>
        <label>性別：</label>
        <div v-for="option in genderOptions" :key="option.value">
          <input 
            type="radio" 
            :id="option.value" 
            v-model="formData.gender" 
            :value="option.value" 
            :name="'gender'"
          >
          <label :for="option.value">{{ option.label }}</label>
        </div>
      </div>
      <button type="submit">提交</button>
    </form>
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue'
  
  const genderOptions = [
    { value: 'male', label: '男' },
    { value: 'female', label: '女' },
    { value: 'other', label: '其他' },
  ]
  
  const formData = reactive({
    gender: ''
  })
  
  const onSubmit = () => {
    console.log('表單提交的數據:', formData)
    console.log('性別欄位的值:', formData.gender)
  }
  </script>
  