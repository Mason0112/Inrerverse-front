<template>
    <!-- Button trigger modal -->
    
    
    <!-- Modal -->
<!-- Button trigger modal -->
        <button class="btn btn-outline-secondary btn-sm" @click="showModal">編輯</button>

<!-- Modal -->
        <div ref="exampleRef" class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                        <div class="modal-content">
                                <div class="modal-header">
                                        <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                ...
                                </div>
                                <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-primary">Save changes</button>
                                </div>
                        </div>
                </div>
        </div>
</template>

<script setup>
        import { ref , onMounted} from 'vue';
        import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js'
    
        const props = defineProps(["product", "isShowButtonInsert"])
        const emits = defineEmits(["update:product", "insert" , "update"])
            
        //input事件
        function modify(key, value){
        let obj={
                ...props.product,
                [key]:value
            }    
        //把update跟obj傳出元件
        emits("update:product", obj)    
        // console.log(obj)            
        }
    
    const exampleRef = ref(null);
    const exampleObj = ref(null);
    //初始化exampleObj 
    onMounted(function(){
            exampleObj.value= new bootstrap.Modal(exampleRef.value);
    });
    
    function showModal(){
                exampleObj.value.show();
    }
    function hideModal(){
            exampleObj.value.hide();
    }
    //SFC元件預設對外封閉，使用define()宣告要暴露給外部使用的變數與函數
    defineExpose({
            showModal, 
            hideModal
    });
    
    
    </script>
    
    <style>
    
    </style>
    