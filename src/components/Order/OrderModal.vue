<template>
    <div class="modal" tabindex="-1" ref="modalRef">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">訂單詳情</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <table class="ts-table">
                        <thead>
                            <tr>
                                <th>品名</th>
                                <th>數量</th>
                                <th>單價</th>
                                <th>金額</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="singleorder in order" :key="singleorder.productId">
                                <td>{{ productNames[singleorder.productId] || '載入中...' }}</td>
                                <td>{{ singleorder.quantity }}</td>
                                <td>{{ singleorder.price }}</td>
                                <td>{{ singleorder.subtotal }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, reactive } from 'vue';
import { Modal } from 'bootstrap';
import axiosapi from '@/plugins/axios';

const props = defineProps(["order"]);
const emit = defineEmits(["update:order"]);

const modalRef = ref(null);
let modalInstance = null;
const productNames = reactive({});

onMounted(() => {
    modalInstance = new Modal(modalRef.value);
});

async function findProductName(id) {
    if (productNames[id]) return;
    try {
        const response = await axiosapi.get(`/products/${id}`);
        console.log("responseProductName", response.data.name);
        productNames[id] = response.data.name;
    } catch (error) {
        console.error("Error fetching product name:", error);
        productNames[id] = '獲取失敗';
    }
}

function showModal() {
    if (modalInstance) {
        modalInstance.show();
    }
}

function hideModal() {
    if (modalInstance) {
        modalInstance.hide();
    }
}

defineExpose({
    showModal,
    hideModal
});

watch(() => props.order, (newOrder) => {
    if (newOrder && newOrder.length > 0) {
        showModal();
        newOrder.forEach(item => findProductName(item.productId));
    }
}, { deep: true });
</script>

<style scoped>
.modal-dialog {
    max-width: 800px;
}

.modal-content {
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    border: none;
}

.modal-header {
    background-color: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
    padding: 1.5rem;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
}

.modal-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #343a40;
}

.modal-body {
    max-height: 70vh;
    overflow-y: auto;
    padding: 1.5rem;
}

.table-responsive {
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.ts-table {
    width: 100%;
    margin-bottom: 0;
    color: #212529;
    border-collapse: separate;
    border-spacing: 0;
}

.ts-table thead th {
    background-color: #f1f3f5;
    color: #495057;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.875rem;
    padding: 1rem;
    border-bottom: 2px solid #dee2e6;
}

.ts-table tbody td {
    padding: 1rem;
    border-bottom: 1px solid #e9ecef;
    transition: background-color 0.3s ease;
}

.ts-table tbody tr:last-child td {
    border-bottom: none;
}

.ts-table tbody tr:hover td {
    background-color: #f8f9fa;
}

.modal-footer {
    background-color: #f8f9fa;
    border-top: 1px solid #e9ecef;
    padding: 1rem 1.5rem;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
}

.btn-secondary {
    background-color: #6c757d;
    border-color: #6c757d;
    color: #fff;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border-radius: 5px;
    transition: all 0.2s ease-in-out;
}

.btn-secondary:hover {
    background-color: #5a6268;
    border-color: #545b62;
    transform: translateY(-1px);
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

@media (max-width: 768px) {
    .modal-dialog {
        margin: 0.5rem;
    }

    .modal-body {
        padding: 1rem;
    }

    .ts-table thead th,
    .ts-table tbody td {
        padding: 0.75rem;
    }
}
</style>