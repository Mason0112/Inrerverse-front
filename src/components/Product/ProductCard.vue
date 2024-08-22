<template>

    <div class="card">
        <img class="card-img-top" :src="`${product.productPhotos[0].photoPath}`" :alt="product.name">
        <div class="card-body">
            <h5 class="card-title">{{ product.name }}</h5>
            <div class="row">
                <div class="col text-start">
                    <button type="button" class="btn btn-primary">開啟修改</button>
                </div>
                <div class="col text-end">
                    <button type="button" class="btn btn-primary" >刪除</button>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>
   const props = defineProps(["product"]);

</script>

<style></style>