<template>
          <div class="home-page">
    <!-- <div class="mosaic-grid">
      <div v-for="(post, index) in posts" :key="post.postId" 
           :class="['mosaic-item', `item-${index % 5 + 1}`]"
           @click="navigateToShareDetails(post.postId)">
        <img :src="getImageUrl(post)" :alt="post.userName" />
        <div class="mosaic-caption">
        </div>
      </div>
    </div> -->

    <div class="featured-products-wrapper">
    <div class="featured-products">
      <div
        class="featured-product"
        @click="navigateToProductDetails('product1')"
      >
        <div class="product-image-container">
          <img src="#" alt="產品1" />
        </div>
        <div class="product-name">產品1</div>
      </div>
      <div
        class="featured-product"
        @click="navigateToProductDetails('product2')"
      >
        <div class="product-image-container">
          <img src="#" alt="產品2" />
        </div>
        <div class="product-name">產品2</div>
      </div>
      <div
        class="featured-product"
        @click="navigateToProductDetails('product3')"
      >
        <div class="product-image-container">
          <img src="#" alt="產品3" />
        </div>
        <div class="product-name">產品3</div>
      </div>
    </div>
    <div class="shop-now-section" @click="navigateToShop">
      <span style="font-size: 60px;">立即購物</span>
    </div>
  </div>


    <div class="club-article" style="margin: 0;">
      <div class="article-image">
        <div class="cookie-border">
          <div class="cloud-shape"></div>
        </div>
      </div>
      <div class="article-content">
        <h2>加入我們的俱樂部</h2>
        <p style="font-size: 25px;">我們的俱樂部為生活中比較不方便交到朋友的人提供了一個理想的平台。在這裡，您可以參加各種有趣的活動，結識志同道合的朋友。每個俱樂部都有自己獨特的內部活動，無論您的興趣是什麼，都能找到適合自己的小組。</p>
        <p style="font-size: 25px; ">從讀書會到戶外探險，從烹飪課程到藝術工作坊，我們的活動豐富多樣。加入我們，開啟一段充滿驚喜和友誼的旅程！</p>
        <button @click="learnMore">了解更多</button>
      </div>
    </div>

    <!-- <div class="site-philosophy">
      <h2>我們的理念</h2>
      <p>在這裡分享您的穿搭靈感，讓時尚激發無限可能！</p>
    </div> -->
  </div>
        
</template>
    
<script setup>
    import useUserStore from '@/stores/userstore';
    const userStore = useUserStore();

    let nickname = userStore.nickname;

</script>
    
<style scoped>
.home-page {
  width: 100%;
  background-color: #f8e5e5; /* 淺粉藕色背景 */
}

.mosaic-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 200px;
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

.item-1 { grid-column: span 2; grid-row: span 2; }
.item-2 { grid-column: span 1; grid-row: span 1; }
.item-3 { grid-column: span 1; grid-row: span 1; }
.item-4 { grid-column: span 1; grid-row: span 2; }
.item-5 { grid-column: span 1; grid-row: span 1; }

.featured-products-wrapper {
  background-color: #ffd6d6; /* 稍深一點的粉藕色 */
  height: 600px;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
}

.featured-products {
  flex: 1;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 5%;
}

.featured-product {
  width: 30%;
  cursor: pointer;
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.featured-product:hover {
  transform: scale(1.05);
}


/* 商品 */
.product-image-container {
  width: 250px;
  height: 250px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.product-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-name {
  text-align: center;
  font-weight: bold;
  color: #4a3636;
  font-size: 1.2em;
}


.shop-now-section {
  width: 200px;
  background-color: #e8a798; /* 更深一點的粉藕色偏橘色 */
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.shop-now-section:hover {
  background-color: #e59985; /* 懸停時稍微變深 */
}

.shop-now-section span {
  font-size: 1.5em;
  font-weight: bold;
  color: #ffffff;
  text-transform: uppercase;
  writing-mode: vertical-rl;
  text-orientation: upright;
}

.site-philosophy {
  background-color: #e8cccc;
  padding: 40px 20px;
  text-align: center;
  color: #4a3636;
}

.site-philosophy h2 {
  margin-bottom: 20px;
  font-size: 2em;
}

.site-philosophy p {
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
  font-size: 1.2em;
}

/* 關於我們 */
.club-article { 
  display: flex;
  background-color: #fdfdfd;
  padding: 50px;
  margin-top: 50px;
}

.article-image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cookie-border {
  width: 400px;
  height: 400px;
  border: 15px solid #f0d0b0;
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cloud-shape {
  width: 350px;
  height: 350px;
  background-image: url('Capybaras.gif'); /* 替換為您的圖片路徑 */
  background-size: cover;
  background-position: center;
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
}

.article-content {
  flex: 1;
  padding-left: 50px;
}

.article-content h2 {
  font-size: 2.5em;
  color: #4a3636;
  margin-bottom: 20px;
}

.article-content p {
  font-size: 1.1em;
  line-height: 1.6;
  color: #68556a;
  margin-bottom: 15px;
}

.article-content button {
  background-color: #e8a798;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1.1em;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.article-content button:hover {
  background-color: #e59985;
  }

@media (max-width: 1200px) {
  .featured-products-wrapper {
    flex-direction: column;
  }

  .featured-products {
    margin-bottom: 20px;
  }

  .shop-now-section {
    width: 100%;
    height: 100px;
  }

  .shop-now-section span {
    writing-mode: horizontal-tb;
  }
}

@media (max-width: 1024px) {
  .mosaic-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .featured-products {
    flex-wrap: wrap;
  }
  
  .featured-product {
    width: 45%;
    margin-bottom: 20px;
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

  .cookie-border {
    width: 300px;
    height: 300px;
  }

  .cloud-shape {
    width: 250px;
    height: 250px;
  }
}



@media (max-width: 768px) {
  .mosaic-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .product-image-container {
    width: 200px;
    height: 200px;
  }

  .featured-product {
    width: 100%;
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
  .mosaic-grid {
    grid-template-columns: 1fr;
  }
  
  .mosaic-item {
    grid-column: span 1 !important;
    grid-row: span 1 !important;
  }
  
  .product-image-container {
    width: 150px;
    height: 150px;
  }
}
</style>