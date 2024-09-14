<template>
  <div class="home-page">

     <div class="mosaic-grid">
      <div v-for="num in 18" :key="num" 
      :class="['mosaic-item', `item-${(num - 1) % 5 + 1}`]">
      <img :src="`http://localhost:8080/interverse/products/10/${69 - num}`" :alt="`Image ${18 - num}`" />
        <div class="mosaic-caption">
        </div>
      </div>
    </div>
    <div class="featured-products-wrapper">
      <div class="featured-products">
        <div
          class="featured-product"
          v-for="(product, index) in products"
          :key="index"
          @click="navigateToProductDetails(product.id)"
        >
          <div class="product-image-container" style="height: 300px; width: 300px;">
            <img :src="product.image" :alt="product.name" />
          </div>
          <div class="product-name">{{ product.name }}</div>
        </div>
      </div>
      <div class="shop-now-section" @click="navigateToShop" style="width: 200px;">
        <span style="font-size: 70px;">立即購物</span>
      </div>
    </div>

    <div class="separator"></div>

    <div class="club-article" >
      <div class="article-image">
        <div class="cookie-border">
          <div class="cloud-shape" ></div>
        </div>
      </div>
      <div class="article-content">
        <h1 style="font-size: 60px;">加入俱樂部</h1>
        <br />
        <h5>俱樂部為生活中比較不方便交到朋友的人提供了一個理想的平台。在這裡，您可以參加各種有趣的活動，結識志同道合的朋友。每個俱樂部都有自己獨特的內部活動，無論您的興趣是什麼，都能找到適合自己的舒適圈。</h5>
        <h5>從讀書會到戶外探險，從烹飪課程到藝術工作坊，我們的活動豐富多樣。加入我們，開啟一段充滿驚喜和友誼的旅程！</h5>
        <button @click="learnMore" style="font-size: 15px; margin: 15px 0px 0px 0px ; font-weight: bold;" >了解更多</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import useUserStore from '@/stores/userstore';

const userStore = useUserStore();
const nickname = ref(userStore.nickname);

const products = ref([
  { id: 'product1', name: '馬克杯', image: '/馬克杯2.png' },
  { id: 'product2', name: '手機殼', image: '/手機殼3.jpg' },
  { id: 'product3', name: '飲料杯袋', image: '/袋子2.png' }
]);

function navigateToProductDetails(productId) {
  console.log(`Navigating to product: ${productId}`);
}

function navigateToShop() {
  console.log('Navigating to shop');
}

function learnMore() {
  console.log('Learn more about the club');
}
</script>

<style scoped>

.item-1 { grid-column: span 1; grid-row: span 1; }
.item-2 { grid-column: span 1; grid-row: span 1; }
.item-3 { grid-column: span 1; grid-row: span 1; }
.item-4 { grid-column: span 1; grid-row: span 2; }
.item-5 { grid-column: span 2; grid-row: span 2; }


.mosaic-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-auto-rows: 150px;
  gap: 10px;
  padding: 20px;
}

.mosaic-item {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.mosaic-item:hover {
  transform: scale(1.05);
}

.mosaic-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(232, 204, 204, 0.7); /* 粉藕色半透明背景 */
  color: #4a3636; /* 深棕色文字 */
  padding: 10px;
}

.mosaic-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}



.home-page {
  width: 100%;
  background-color: #FBE4E1;
}

.featured-products-wrapper {
  display: flex;
  background-color: #FBE4E1;
  min-height: 350px; /* 設置最小高度以確保內容顯示正常 */
}

.featured-products {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  padding: 40px 20px;
}

.featured-product {
  width: 30%;
  cursor: pointer;
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.featured-product:hover {
  transform: scale(1.05);
}

.product-image-container {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border: 5px solid #E4BAB6;
}

.product-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-name {
  text-align: center;
  font-weight: bold;
  color: #97715B;
  font-size: 1.2em;
}

.shop-now-section {
  width: 120px;
  background-color: #F3D2A8;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
  writing-mode: vertical-rl;
  text-orientation: upright;
}

.shop-now-section:hover {
  background-color: #EEC48D;
}

.shop-now-section span {
  font-size: 2em;
  font-weight: bold;
  color: #97715B;
  text-transform: uppercase;
}

.separator {
  height: 40px;
  background-color: #E4BAB6;
}

.club-article {
  display: flex;
  background-color: #F9E1DD;
  padding: 50px;
}

.article-image {
  flex: 0 0 35%; /* This sets the image section to 35% of the container width */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}

.cookie-border {
  width: 350px;
  height: 350px;
  border: 15px solid #E4BAB6;
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cloud-shape {
  width: 300px;
  height: 300px;
  background-image: url('/public/Capybaras.gif');
  background-size: cover;
  background-position: center;
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
}

.article-content {
  flex: 0 0 65%; /* This sets the content section to 65% of the container width */
  padding-left: 0;
}
.article-content h2 {
  font-size: 2.5em;
  color: #97715B;
  margin-bottom: 20px;
}

.article-content p {
  font-size: 1.1em;
  line-height: 1.6;
  color: #6B5147;
  margin-bottom: 15px;
}

.article-content button {
  background-color: #F3D2A8;
  color: #97715B;
  border: none;
  padding: 10px 20px;
  font-size: 1.1em;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border-radius: 5px;
}

.article-content button:hover {
  background-color: #EEC48D;
}

@media (max-width: 1024px) {
  .featured-products-wrapper {
    flex-direction: column;
  }

  .featured-products {
    width: 100%;
  }

  .shop-now-section {
    width: 100%;
    height: 80px;
    writing-mode: horizontal-tb;
  }

  .shop-now-section span {
    writing-mode: horizontal-tb;
  }

  .club-article {
    flex-direction: column;
  }

  .article-image, .article-content {
    width: 100%;
  }

  .article-content {
    padding-left: 0;
    padding-top: 30px;
  }
}

@media (max-width: 768px) {
  .featured-product {
    width: 45%;
  }

  .product-image-container {
    width: 150px;
    height: 150px;
  }

  .cookie-border {
    width: 250px;
    height: 250px;
  }

  .cloud-shape {
    width: 200px;
    height: 200px;
  }
}

@media (max-width: 480px) {
  .featured-product {
    width: 100%;
  }

  .product-image-container {
    width: 120px;
    height: 120px;
  }
}
</style>