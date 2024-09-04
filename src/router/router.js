import { createRouter, createWebHistory } from "vue-router";


import Home from "@/views/Home.vue";
import Forbidden from "@/views/result/Forbidden.vue";
import NotFound from "@/views/result/NotFound.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/user/Register.vue";
import Notification from "@/views/user/Notification.vue";
import CreatePost from "@/views/userPost/CreatePost.vue";
import UserPost from "@/views/userPost/UserPost.vue";
import Friend from "@/views/friend/Friend.vue";
import Profile from "@/views/user/Profile.vue";
import ProfileTest from "@/views/test/ProfileTest.vue";
import PersonalModalTest from "@/views/test/PersonalModalTest.vue";
import Category from "@/views/Category/category.vue";
import Product from "@/views/Product/Product.vue";
import CartProductList from "@/views/Cart/CartProductList.vue";
import ShowProductDetail from "@/views/Cart/ShowProductDetail.vue";
import UserCart from "@/views/Cart/UserCart.vue";
import ClubList from "@/views/club/ClubList.vue";
import ClubDetail from "@/views/club/ClubDetail.vue";
import ClubForm from "@/views/club/ClubForm.vue";
import ClubEdit from "@/views/club/ClubEdit.vue";
import ClubApprove from "@/views/club/ClubApprove.vue";
import ClubApprove2 from "@/views/club/ClubApprove2.vue";
import ClubMy from "@/views/club/ClubMy.vue";
import ClubPhotoAlbum from "@/views/club/ClubPhotoAlbum.vue";
import EventList from "@/views/Event/EventList.vue";
import EventDetail from "@/views/Event/EventDetail.vue";
import ClubEvent from "@/views/Event/ClubEvent.vue";
import AddClubEventForm from "@/views/Event/AddClubEventForm.vue";


const routes = [
    { path: "/", name: "home-link", component: Home },
    { path: "/403", name: "403-link", component: Forbidden },
    { path: "/404", name: "404-link", component: NotFound},
    { path: "/login", name: "login-link", component: Login },
    { path: "/user/register", name: "register-link", component: Register },
    { path: "/user/profile", name: "profile-link", component: Profile },
    { path: "/user/notification", name: "notification-link", component: Notification },
    { path: "/product/category", name: "product-category", component: Category},
    { path: "/post/createPost", name: "post-create-link", component: CreatePost},
    { path: "/post/userPost", name: "user-post-link", component: UserPost},

    { path: "/club/all", name: "club-all-link", component: ClubList},
    { path: "/club/:id", name:"club-detail-link", component:ClubDetail},
    { path: "/club/new", name:"club-form-link", component:ClubForm},
    { path: "/club/:id/edit",name:"club-edit-link", component:ClubEdit},
    { path: "/clubMember/approve",name:"club-approve-link", component:ClubApprove},
    { path: "/clubMember/approve2/:id",name:"club-approve2-link", component:ClubApprove2},
    { path: "/clubMember/my-clubs",name:"club-my-link", component:ClubMy},
    { path: "/club/album",name:"club-album-link", component:ClubPhotoAlbum},
    
    { path: "/event/all",name:"event-all-link", component:EventList},
    { path: "/event/detail/:id",name:"event-detail-link", component:EventDetail},
    { path: "/event/club/all",name:"event-cluball-link", component:ClubEvent},
    { path: "/event/club/all",name:"event-addclubevent-link", component:ClubEvent},



    { path: "/friend", name: "friend-link", component: Friend },
    { path: "/profile", name: "profiletest-link", component: ProfileTest },
    { path: "/personal", name: "personal-link", component: PersonalModalTest },

    { path: "/product/product", name: "product-product", component: Product },
    { path: "/product/Cart", name: "product-cart", component: CartProductList },
    { path: "/product/ProductCartDetail/:id", name: "product-cartDetail", component: ShowProductDetail },
    { path: "/cart", name: "cart-user", component: UserCart }
    
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})



export default router;