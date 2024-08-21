<template>

    <div class="card">
        <div class="card-body">
            <h5 class="card-title">{{ category.name }}</h5>
            <div class="row">
                <div class="col text-start">
                    <button type="button" class="btn btn-primary" @click="emits('openUpdate','update',category.id)">開啟修改</button>
                </div>
                <div class="col text-end">
                    <button type="button" class="btn btn-primary" @click="emits('delete',category.id)">刪除</button>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>
    const props = defineProps(["category"]);
    const emits = defineEmits(["openUpdate","delete"]) 
</script>

<style></style>