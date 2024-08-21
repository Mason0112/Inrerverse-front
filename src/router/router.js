import { createRouter, createWebHistory } from "vue-router";

import Home from "@/views/Home.vue";
import Forbidden from "@/views/result/Forbidden.vue";
import NotFound from "@/views/result/NotFound.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/user/Register.vue";
import Profile from "@/views/user/Profile.vue";
import category from "@/views/Category/category.vue";

const routes = [
    { path: "/", name: "home-link", component: Home },
    { path: "/403", name: "403-link", component: Forbidden },
    { path: "/404", name: "404-link", component: NotFound},
    { path: "/login", name: "login-link", component: Login },
    { path: "/user/register", name: "register-link", component: Register },
    { path: "/user/profile", name: "profile-link", component: Profile },
    { path: "/product/category", name: "product-category", component: category }
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router;