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

<script setup>
import { ref, onMounted } from "vue";
import axios from "@/plugins/axios";
import useUserStore from "@/stores/userstore";

const userStore = useUserStore();
let userId = userStore.userId;

onMounted(function () {
    callFind();
});

function callFind() {

    axios.get(`/friend/${userId}/list`)
        .then(function (response) {
            console.log("response", response);

            fetchUserDetails(response.data);

        })
        .catch(function (error) {
            console.log("error", error);
        });
}

function fetchUserDetails(data) {
  // Extract user2Ids from the data
  const user2Ids = data.map(item => item.user2Id);

  // Create an array of requests to fetch user details for each user2Id
  const requests = user2Ids.map(user2Id =>
    axios.get(`/user/secure/${user2Id}`)
  );

  // Use Promise.all to handle all requests
  Promise.all(requests)
    .then(responses => {
      // Process each response
      responses.forEach(response => {
        // Log user details
        console.log('User details:', response.data);
      });
    })
    .catch(error => {
      // Handle any errors that occur during the requests
      console.error('Error fetching user details:', error);
    });
}

</script>

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
