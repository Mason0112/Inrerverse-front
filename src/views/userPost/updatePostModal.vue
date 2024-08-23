<template>
    <!-- Button trigger modal -->
    
    
    <!-- Modal -->
    <div ref="exampleRef" class="modal fade"  id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                    <div class="modal-content">
                            <div class="modal-header">
                                    <h1 class="modal-title fs-5" id="exampleModalLabel">Product</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                            <table>
                                    <tr>
                                            <td>Id : </td>
                                            <td><input type="number" name="id" :value="product.id" @input="modify('id', $event.target.value)"></td>
                                    </tr>
                                    <tr>
                                            <td>Name : </td>
                                            <td><input type="text" name="name" :value="product.name" @input="modify('name', $event.target.value)"></td>
                                    </tr>
                                    <tr>
                                            <td>Price : </td>
                                            <td><input type="number" name="price" :value="product.price" @input="modify('price', $event.target.value)"></td>
                                    </tr>
                                    <tr>
                                            <td>Make : </td>
                                            <td><input type="text" name="make" :value="product.make" @input="modify('make', $event.target.value)"></td>
                                    </tr>
                                    <tr>
                                            <td>Expire : </td>
                                            <td><input type="text" name="expire" :value="product.expire" @input="modify('expire', $event.target.value)"></td>
                                    </tr>
                            </table>
                            </div>
                            <div class="modal-footer">
                                    <button type="button" class="btn btn-primary" @click="emits('insert')" v-show="isShowButtonInsert">新增</button>
                                    <button type="button" class="btn btn-primary" @click="emits('update')" v-show="!isShowButtonInsert">修改</button>
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
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
    