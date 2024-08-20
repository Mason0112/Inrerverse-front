import { createRouter, createWebHistory } from "vue-router";

import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/user/Register.vue";
import profile from "@/views/user/Profile.vue";
import category from "@/views/Category/category.vue";

const routes = [
    { path: "/", name: "home-link", component: Home},
    { path: "/login", name: "login-link", component: Login},
    { path: "/user/register", name: "register-link", component: Register},
    { path: "/user/profile", name: "profile-link", component: profile},
    { path: "/product/category", name: "product-category", component: category}
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router;