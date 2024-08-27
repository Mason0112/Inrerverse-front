<template>

    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <link rel="stylesheet" href="./../assets/tocas/tocas.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap"
            rel="stylesheet" />
        <title>檔案列表 - Tocas UI</title>
    </head>

    <body style="overflow: hidden">
        <div class="ts-container is-narrow has-top-spaced-huge">
            <div class="ts-breadcrumb is-stepped is-divided">
                <a href="#!" class="item">我的購物車</a>

            </div>
            <div class="ts-grid is-relaxed has-top-spaced">
                <div class="column is-10-wide">
                    <div class="ts-box">
                        <table class="ts-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th></th>
                                    <th>名稱</th>
                                    <th>金額</th>
                                    <th>數量</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for=" (product,index) in products" :key="product.productId">
                                    <td>{{ index + 1 }}</td>
                                    <td>
                                        <img :src="`${path}/products/${product.productId}/latestphoto`" alt="">
                                    </td>
                                    <td>{{ product.productName }}</td>
                                    <td>{{ product.price }}</td>
                                    <td>{{ product.vol }}</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th colspan="3">統計筆數：2</th>
                                    <th colspan="3">統計金額：NT$: 10000</th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                </div>
                <div class="column is-6-wide">
                    <div class="ts-box">
                        <div class="ts-content is-tertiary is-vertically-very-padded is-center-aligned">
                            <span class="ts-icon is-regular is-file-image-icon" style="font-size: 3rem"></span>
                        </div>
                        <div class="ts-divider"></div>
                        <div class="ts-content">
                            <div class="ts-header is-heavy">螢幕快照 2017-05-13 下午12.35.11.png</div>
                        </div>
                        <div class="ts-divider"></div>
                        <div class="ts-content is-padded">
                            <div class="ts-grid">
                                <div class="column has-leading-none">
                                    <span class="ts-icon is-clock-icon"></span>
                                </div>
                                <div class="column is-fluid">
                                    <div class="ts-text is-label">最後開啟時間</div>
                                    <div class="ts-text is-description">2017-06-13 12:36PM</div>
                                </div>
                            </div>
                            <div class="ts-grid has-top-spaced">
                                <div class="column has-leading-none">
                                    <span class="ts-icon is-user-icon"></span>
                                </div>
                                <div class="column is-fluid">
                                    <div class="ts-text is-label">檔案擁有者</div>
                                    <div class="ts-text is-description">Yami Odymel</div>
                                </div>
                            </div>
                            <div class="ts-grid has-top-spaced">
                                <div class="column has-leading-none">
                                    <span class="ts-icon is-lock-icon"></span>
                                </div>
                                <div class="column is-fluid">
                                    <div class="ts-text is-label">檔案驗證碼</div>
                                    <div class="ts-text is-description is-truncated">20838a8df7cc0babd745c7af4b7d94e2
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="ts-meta is-small is-end-aligned is-secondary has-top-spaced-small">
                        <a href="#!" class="item">關於</a>
                        <a href="#!" class="item">登入</a>
                        <a href="#!" class="item">網路硬碟</a>
                    </div>
                </div>
            </div>
        </div>
    </body>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted, computed } from 'vue'
import axiosapi from '@/plugins/axios';
import useUserStore from '@/stores/userstore';

const path = import.meta.env.VITE_API_URL;
const userStore = useUserStore();
const route = useRoute();
const products = ref([]);//用AJAX接收進來的全部資料

onMounted(() => {
    console.log(userStore.userId);
    getUserCart(userStore.userId);
    getUserProfile(userStore.userId);
});

function getUserCart(request) {
    axiosapi.get(`/cart/user/${request}`).then(function (productResponse) {
        console.log("列出清單", productResponse.data);
        products.value = productResponse.data;
    });

}

function getUserProfile(request){
    axiosapi.get(`/user/secure/${request}`).then(function (userResponse) {
        console.log("列出User資料", userResponse);
    });

}

</script>

<style></style>