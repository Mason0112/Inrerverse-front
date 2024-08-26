<template>
  <div class="container mt-5">
    <div class="row d-flex justify-content-center">
      <div class="col-md-10">
        <div class="card">
          <div class="input-box">

            <input type="text" class="form-control" />
            <font-awesome-icon
              :icon="['fas', 'magnifying-glass']"
              class="input-icon"
            />
          </div>

          <div class="list border-bottom">
            <!-- <img :src="`${photo}`" alt="User Photo" /> -->
            <div class="d-flex flex-column ml-3">
              <span>帳號</span>
              <small>#politics - may - @max</small>
            </div>
          </div>

          <div class="list">
            <i class="fa fa-weibo"></i>
            <div class="d-flex flex-column ml-3">
              <span>Client communication policy</span>
              <small>#politics - may - @max</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.input-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  pointer-events: none; /* 防止圖標阻礙用戶點擊輸入框 */
}

.card {
  background-color: #fff;
  padding: 15px;
  border: none;
}

.input-box {
  position: relative;
}

.input-box i {
  position: absolute;
  right: 13px;
  top: 15px;
  color: #ced4da;
}

.form-control {
  height: 50px;
  background-color: #eeeeee69;
}

.form-control:focus {
  background-color: #eeeeee69;
  box-shadow: none;
  border-color: #eee;
}

.list {
  padding-top: 20px;
  padding-bottom: 10px;
  display: flex;
  align-items: center;
}

.border-bottom {
  border-bottom: 2px solid #eee;
}

.list i {
  font-size: 19px;
  color: red;
}

.list small {
  color: #dedddd;
}
</style>
