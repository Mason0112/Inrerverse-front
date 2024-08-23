<template>
    <h1>我的好友</h1>
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

<style></style>