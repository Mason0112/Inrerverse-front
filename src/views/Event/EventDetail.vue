<template>
  <n-card class="container">
    <template #header>
      <n-h1>活動詳情</n-h1>
    </template>

    <n-spin :show="loading">
      <n-space v-if="eventDetail && event" vertical size="large">
        <n-h2>{{ event.eventName }}</n-h2>
        <n-descriptions bordered>
          <n-descriptions-item label="地點">
            {{ eventDetail.location }}
          </n-descriptions-item>
          <n-descriptions-item label="開始時間">
            {{ formatDateTime(eventDetail.startTime) }}
          </n-descriptions-item>
          <n-descriptions-item label="結束時間">
            {{ formatDateTime(eventDetail.endTime) }}
          </n-descriptions-item>
          <n-descriptions-item label="描述">
            {{ eventDetail.description }}
          </n-descriptions-item>
          <n-descriptions-item label="人數上限">
            {{ eventDetail.participantMax }}
          </n-descriptions-item>
          <n-descriptions-item label="成團人數">
            {{ eventDetail.participantMin }}
          </n-descriptions-item>
          <n-descriptions-item label="費用">
            ${{ eventDetail.fee }}
          </n-descriptions-item>
          <n-descriptions-item label="已參加人數">
            {{ approvedParticipants.length }} / {{ eventDetail.participantMax }}
          </n-descriptions-item>
        </n-descriptions>


        <n-space justify="end">
          <n-button @click="handleParticipation" type="primary" :disabled="!canParticipate" :loading="loading">
            {{ participationButtonText }}
          </n-button>
        </n-space>

        <!-- 相簿 -->
        <EventPhoto :workshopId="route.params.id" :eventCreatorId="event.eventCreatorId" />

        <!-- 已批准的參加者列表 -->
        <n-card title="參加者" v-if="approvedParticipants.length > 0">
          <n-list>
            <n-list-item v-for="participant in approvedParticipants" :key="participant.userId">
              <n-thing>
                <template #avatar>
                  <div class="avatar-container">
                    <img v-if="participant.photoUrl" :src="participant.photoUrl" :alt="participant.userName"
                      class="avatar-image">
                    <div v-else class="avatar-default">
                      <span>{{ participant.userName.charAt(0).toUpperCase() }}</span>
                    </div>
                  </div>
                </template>
                <template #header>
                  {{ participant.userName }}
                </template>
              </n-thing>
            </n-list-item>
          </n-list>
        </n-card>
        <n-empty v-else description="暫無參加者" />
      </n-space>
      <n-result v-else-if="error" status="error" :title="error" />
    </n-spin>

    <template #footer>
      <n-button @click="back" type="primary">
        返回列表
      </n-button>
    </template>
  </n-card>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '@/plugins/axios';
import useUserStore from "@/stores/userstore";
import EventPhoto from './EventPhoto.vue';
import {
  NCard, NSpin, NSpace, NH1, NH2, NDescriptions,
  NDescriptionsItem, NButton, NResult, useMessage,
  NList, NListItem, NEmpty, NThing
} from 'naive-ui';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const event = ref({});
const eventDetail = ref(null);
const loading = ref(true);
const error = ref(null);
const joining = ref(false);
const hasJoined = ref(false);
const participationStatus = ref(null);
const approvedParticipants = ref([]);
const message = useMessage();

const fetchEventDetail = async () => {
  try {
    const response = await axios.get(`/eventDetail/${route.params.id}/show`);
    eventDetail.value = response.data;
    loading.value = false;
  } catch (error) {
    console.error('獲取活動詳情失敗:', error);
    error.value = '獲取活動詳情失敗';
    loading.value = false;
  }
};

const fetchApprovedParticipants = async () => {
  try {
    const response = await axios.get(`/eventParticipant/event/${route.params.id}/approved-participants`);
    const participantsData = response.data;

    // 獲取每個參加者的頭像
    const participantsWithPhotos = await Promise.all(participantsData.map(async (participant) => {
      try {
        const photoResponse = await axios.get(`/user/secure/profile-photo/${participant.userId}`);
        return {
          ...participant,
          photoUrl: photoResponse.data || null
        };
      } catch (err) {
        console.error(`Error fetching photo for user ${participant.userId}:`, err);
        return participant;
      }
    }));

    approvedParticipants.value = participantsWithPhotos;
  } catch (error) {
    console.error('讀取參加者失敗:', error);
    message.error('讀取參加者失敗');
  }
};

const fetchEvent = async () => {
  try {
    const response = await axios.get(`/events/${route.params.id}`);
    event.value = response.data;
    console.log("Event data:", event.value);
  } catch (error) {
    console.error('獲取活動名稱失敗:', error);
    error.value = '獲取活動名稱失敗';
  }
};

const checkParticipationStatus = async () => {
  try {
    const response = await axios.get(`/eventParticipant/event/${route.params.id}/user/${userStore.userId}/status`);
    participationStatus.value = response.data;
  } catch (error) {
    console.error('檢查參與狀態失敗:', error);
    message.error('檢查參與狀態失敗');
    participationStatus.value = { status: -1 }; // 設置為未參加狀態
  }
};

const participationButtonText = computed(() => {
  console.log('計算按鈕文字, 當前狀態:', participationStatus.value?.status);  // 添加日誌
  if (!participationStatus.value || participationStatus.value.status === -1) return '加入活動';
  if (participationStatus.value.status === 0) return '待審核';
  if (participationStatus.value.status === 1) return '已加入';
  return '加入活動';
});

const canParticipate = computed(() => {
  return !participationStatus.value || participationStatus.value.status === -1;
});



const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '未設置';
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateTimeString).toLocaleString('zh-TW', options);
};

const canUserEdit = computed(() => {
  return userStore.userId === eventDetail.value?.event?.eventCreatorId;
});

const canJoin = computed(() => {
  return !canUserEdit.value && !hasJoined.value;
});

const joinButtonText = computed(() => {
  if (hasJoined.value) return '已加入';
  if (joining.value) return '加入中...';
  return '加入活動';
});

const joinEvent = async () => {
  if (!canJoin.value) return;

  joining.value = true;
  try {
    const response = await axios.post('/eventParticipant', {
      eventId: route.params.id,
      userId: userStore.userId
    });
    if (response.status === 201) {
      hasJoined.value = true;
    }
  } catch (error) {
    console.error('加入活動失敗:', error);
  } finally {
    joining.value = false;
  }
};

const handleParticipation = async () => {
  if (!canParticipate.value) return;

  loading.value = true;
  try {
    const response = await axios.post('/eventParticipant', {
      eventId: route.params.id,
      userId: userStore.userId
    });
    if (response.status === 201) {
      message.success('成功提交參加請求');
      // 立即更新本地狀態
      participationStatus.value = {
        eventId: route.params.id,
        userId: userStore.userId,
        status: 0  // 設置為待審核狀態
      };
    }
  } catch (error) {
    console.error('加入活動失敗:', error);
    message.error('加入活動失敗');
  } finally {
    loading.value = false;
  }
};

const isWorkshopMember = computed(() => {
  return participationStatus.value && participationStatus.value.status === 1;
});

const back = () => {
  router.go(-1);
};

onMounted(() => {
  fetchEventDetail();
  fetchEvent();
  checkParticipationStatus();
  fetchApprovedParticipants();
});
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.avatar-container {
  width: 40px;
  /* 設置固定寬度 */
  height: 40px;
  /* 設置固定高度 */
  border-radius: 50%;
  /* 圓形頭像 */
  overflow: hidden;
  /* 確保內容不會溢出容器 */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #d1d5db;
  /* 默認背景顏色 */
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* 確保圖片填滿容器並保持比例 */
}

.avatar-default {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  color: #374151;
}
</style>