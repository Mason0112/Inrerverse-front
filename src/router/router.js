import { createRouter, createWebHistory } from "vue-router";

import Home from "@/views/Home.vue";
import Forbidden from "@/views/result/Forbidden.vue";
import NotFound from "@/views/result/NotFound.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/user/Register.vue";
import Notification from "@/views/user/Notification.vue";
import Friend from "@/views/friend/Friend.vue";
import Profile from "@/views/user/Profile.vue";
import ProfileTest from "@/views/test/ProfileTest.vue";
import PersonalModalTest from "@/views/test/PersonalModalTest.vue";


const routes = [
    { path: "/", name: "home-link", component: Home },
    { path: "/403", name: "403-link", component: Forbidden },
    { path: "/404", name: "404-link", component: NotFound},
    { path: "/login", name: "login-link", component: Login },
    { path: "/user/register", name: "register-link", component: Register },
    { path: "/user/profile", name: "profile-link", component: Profile },
    { path: "/user/notification", name: "notification-link", component: Notification },
    { path: "/friend", name: "friend-link", component: Friend },
    { path: "/profile", name: "profiletest-link", component: ProfileTest },
    { path: "/personal", name: "personal-link", component: PersonalModalTest }

    
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router;