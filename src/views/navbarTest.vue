<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <RouterLink class="navbar-brand" :to="{ name: 'home-link' }">InterVerse</RouterLink>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
          <ul class="navbar-nav">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button"
                @click="toggleDropdown" aria-expanded="isDropdownOpen">
                俱樂部 <font-awesome-icon :icon="['fas', 'caret-down']" :class="{ 'rotate': isDropdownOpen }"/>
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink" :class="{ 'show': isDropdownOpen }">
                <li>
                  <RouterLink class="dropdown-item" :to="{ name: 'profile-link' }">Edit Profile</RouterLink>
                </li>
                <li><a class="dropdown-item" @click="logout">Logout</a></li>
              </ul>
            </li>
            <!-- Other items -->
          </ul>
          
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <RouterLink class="nav-link" :to="{ name: 'login-link' }">
                <font-awesome-icon :icon="['fas', 'sign-in-alt']" /> Login
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" :to="{ name: 'register-link' }">
                <font-awesome-icon :icon="['fas', 'user-plus']" /> Register
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import useUserStore from '@/stores/userstore';
  import axios from '@/plugins/axios';

  const isDropdownOpen = ref(false);

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}
  
  const userStore = useUserStore();
  
  function logout() {
    userStore.resetStore();
    axios.defaults.headers.authorization ='';
  }
  
  </script>
  

<style scoped>
.arrow {
  font-size: 0.75em; /* Adjust the size of the arrow */
  transition: transform 0.5s ease; /* Smooth transition for rotation */
}

.rotate {
  transform: rotate(180deg); /* Rotate the arrow when the dropdown is open */
}

.dropdown-menu {
  display: none; /* Hide dropdown menu by default */
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dropdown-menu.show {
  display: block; /* Show dropdown menu when it has 'show' class */
}

.dropdown-item {
  padding: 10px 20px;
  color: #000;
}

.dropdown-item:hover {
  background-color: #f1f1f1;
}

.dropdown-toggle::after {
  display: none; /* Hide default Bootstrap dropdown arrow */
}

.dropdown-toggle {
  display: flex;
  align-items: center;
}
</style>