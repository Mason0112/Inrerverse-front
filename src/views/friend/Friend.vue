<template>
    <h1>我的好友們</h1>
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

          <div class="list border-bottom" v-for="friend in friends" :key="user2Id">
            <!-- <img :src="`${photo}`" alt="User Photo" /> -->
            <div class="d-flex flex-column ml-3">
              <span>{{ friend.accountNumber}}</span>
              <small>{{ friend.age }} 歲</small>
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

const friends = ref([]);

const accountNumber = ref('');
const age = ref('');

onMounted(function () {
    callFind();
});

function callFind() {

    axios.get(`/friend/${userId}/list`)
        .then(function (response) {
            console.log("response", response);

            const friendsData = response.data;

      // 将 friend 列表赋值给 friends 变量
      friends.value = friendsData;

      // 传递 friendsData 去获取每个 user2Id 的详细信息
      fetchUserDetails(friendsData);

        })
        .catch(function (error) {
            console.log("error", error);
        });
}

function fetchUserDetails(friendsData) {
  const user2Ids = friendsData.map(friend => friend.user2Id);

  const requests = user2Ids.map(user2Id => axios.get(`/user/secure/${user2Id}`));

  Promise.all(requests)
    .then(responses => {
      // 将用户详情和 friend 关联起来
      responses.forEach((response, index) => {
        const userDetails = response.data;

        // 将 userDetails 赋值到对应的 friend 对象中
        friendsData[index].accountNumber = userDetails.accountNumber;
        friendsData[index].age = userDetails.age;
      });

      // 更新 friends 变量以触发重新渲染
      friends.value = friendsData;
    })
    .catch(error => {
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