<template>
  <div class="container mx-auto p-4">
    <h1 class="text-4xl font-bold text-center text-pink-400 mb-8">所有俱樂部</h1>
    <div class="flex justify-end mb-4">

      <router-link :to="{ name: 'club-form-link' }" class="new-club-button">新增俱樂部</router-link>

      <router-link :to="{ name: 'club-favorite-link' }" class="new-club-button">我的收藏</router-link>
      
    </div>
    <!-- 搜索和排序控件 -->
    <div class="flex justify-between items-center mb-4">
      <div class="ts-input is-end-icon custom-input search-input">
        <input v-model="searchQuery" type="text" placeholder="搜索俱樂部..." @input="filterClubs">
        <i class="search icon"></i>
      </div>
      <div class="ts-select custom-select sort-select">
        <select v-model="sortOption" @change="sortClubs">
          <option value="nameAsc">名稱 (A-Z)</option>
          <option value="nameDesc">名稱 (Z-A)</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="ts-loading is-center"></div>
    <div v-else-if="error" class="ts-box is-negative bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <div class="ts-content">
        <strong>錯誤：</strong>{{ error }}
      </div>
    </div>
    <div v-else class="club-grid">
      <div v-for="club in filteredClubs" :key="club.id" class="club-card">
        <router-link :to="{ name: 'club-detail-link', params: { id: club.id } }">
          <div class="club-image">
            <img v-if="club.photo" :src="getPhotoUrl(club.photo)" :alt="club.clubName">
            <div v-else class="no-photo">
              無照片
            </div>
          </div>
        </router-link>
        <div class="club-content">
          <h2 class="club-name">
            <router-link :to="{ name: 'club-detail-link', params: { id: club.id } }">
              {{ club.clubName }}
            </router-link>
          </h2>
          <div v-if="!club.isPublic" class="review-status">
            須審核
          </div>
        </div>
        <div class="club-footer">
          <button @click="joinClub(club)" class="join-button">
            加入
          </button>
          <button @click="toggleFavorite(club)" class="favorite-button" :class="{ 'is-favorite': club.isFavorite }">
            {{ club.isFavorite ? '❤' : '♡' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from "@/plugins/axios";
import useUserStore from "@/stores/userstore";

const clubs = ref([]);
const filteredClubs = ref([]);
const searchQuery = ref('');
const sortOption = ref('nameAsc');
const loading = ref(true);
const error = ref(null);
const userStore = useUserStore();

const fetchClubs = async () => {
  try {
    const response = await axios.get('/clubs/all');
    clubs.value = response.data.map(club => ({
      ...club,
      isFavorite: false // 初始化收藏状态
    }));
    await fetchFavorites();
    filterClubs();
    loading.value = false;
  } catch (err) {
    console.error('Error fetching clubs:', err);
    error.value = err.message;
    loading.value = false;
  }
};

const fetchFavorites = async () => {
  try {
    const response = await axios.get(`/clubFavorite/user/${userStore.userId}`);
    const favorites = new Set(response.data.map(fav => fav.clubId));
    clubs.value.forEach(club => {
      club.isFavorite = favorites.has(club.id);
    });
  } catch (err) {
    console.error('Error fetching favorites:', err);
  }
};

const filterClubs = () => {
  filteredClubs.value = clubs.value.filter(club =>
    club.clubName.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
  sortClubs();
};

const sortClubs = () => {
  filteredClubs.value.sort((a, b) => {
    switch (sortOption.value) {
      case 'nameAsc':
        return a.clubName.localeCompare(b.clubName);
      case 'nameDesc':
        return b.clubName.localeCompare(a.clubName);
      default:
        return 0;
    }
  });
};

const getPhotoUrl = (photoId) => {
  if (!photoId) return null;
  return `${import.meta.env.VITE_API_URL}/clubs/photo/${photoId}`;
};

const joinClub = async (club) => {
  const clubMemberDTO = {
    clubId: club.id,
    userId: userStore.userId,
    status: club.isPublic === 1 ? 1 : 0
  };
  try {
    const response = await axios.post('/clubMember', clubMemberDTO);
    if (club.isPublic === 1) {
      alert('已成功加入俱樂部！');
    } else {
      alert('已成功提交申請！等待審核中。');
    }
  } catch (error) {
    console.error('Error joining club:', error);
    alert('無法加入俱樂部，請稍後再試。');
  }
};

const toggleFavorite = async (club) => {
  try {
    if (club.isFavorite) {
      await axios.delete(`/clubFavorite/user/${userStore.userId}/club/${club.id}`);
    } else {
      await axios.post('/clubFavorite/add', {
        userId: userStore.userId,
        clubId: club.id
      });
    }
    club.isFavorite = !club.isFavorite;
  } catch (error) {
    console.error('Error toggling favorite:', error);
    alert('操作失敗，請稍後再試。');
  }
};

onMounted(fetchClubs);
</script>

<style scoped>
.club-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.club-card {
  display: flex;
  flex-direction: column;
  height: 500px;
  border: 1px solid #fcd9e6;
  border-radius: 0.5rem;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  background-color: #fff0f5;
}

.club-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 6px rgba(252, 217, 230, 0.5);
}

.club-image {
  position: relative;
  height: 300px;
  overflow: hidden;
}

.club-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-photo {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fde8ef;
  color: #f8a5c2;
  font-size: 1.2rem;
}

.club-content {
  flex-grow: 1;
  padding: 1rem;
}

.club-name {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #e3bdbd;
}

.club-name a {
  color: #e3bdbd;
  text-decoration: none;
  transition: color 0.3s ease;
}

.club-name a:hover {
  color: #d3a9a9;
}

.review-status {
  color: white;
  background-color: rgba(248, 165, 194, 0.7);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: bold;
  display: inline-block;
  margin-top: 0.5rem;
}

.club-footer {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.join-button,
.favorite-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.join-button {
  flex-grow: 1;
  background-color: #e3bdbd;
  color: white;
  font-weight: bold;
  margin-right: 0.5rem;
}

.join-button:hover {
  background-color: #d3a9a9;
}

.favorite-button {
  background-color: #ffd1dc;
  color: #ff69b4;
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  padding: 0;
  line-height: 1;
}

.favorite-button:hover {
  background-color: #ffb6c1;
}

.favorite-button.is-favorite {
  background-color: #ff69b4;
  color: white;
}

.favorite-button.is-favorite {
  background-color: #ff69b4;
  color: white;
}

.new-club-button {
  padding: 0.75rem 1.5rem;
  background-color: #aa6788;
  color: white;
  border: none;
  border-radius: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  text-decoration: none;
  display: inline-block;
  box-shadow: 0 4px 6px rgba(255, 105, 180, 0.4);
}

.new-club-button:hover {
  background-color: #cb6ea1;
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(255, 105, 180, 0.6);
}

.custom-input {
  width: 78%;
}

.sort-select {
  width: 20%;
}
</style>