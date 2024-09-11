<template>
  <div class="event-detail-container">
    <n-card :bordered="false" class="main-card">
      <n-space vertical size="large">
        <n-page-header @back="back" class="custom-page-header">
          <template #title>
            <n-text :style="{ color: '#FFC0CB', fontSize: '32px', fontWeight: 'bold' }">
              {{ event.eventName }}
            </n-text>
          </template>
        </n-page-header>

        <n-spin :show="loading">
          <n-space v-if="eventDetail && event" vertical size="large">
            <n-grid :cols="24" :x-gap="12">
              <n-gi :span="8">
                <n-card class="event-photo-card" :bordered="false">
                  <n-image
                    :src="coverPhotoUrl"
                    :preview-disabled="true"
                    object-fit="cover"
                    width="300"
                    height="300"
                    class="square-photo"
                  />
                </n-card>
              </n-gi>
              <n-gi :span="16">
                <n-card title="活動詳情" class="detail-card">
                  <n-descriptions :column="1" bordered>
                    <n-descriptions-item label="地點">
                      {{ eventDetail.location }}
                    </n-descriptions-item>
                    <n-descriptions-item label="開始時間">
                      {{ formatDateTime(eventDetail.startTime) }}
                    </n-descriptions-item>
                    <n-descriptions-item label="結束時間">
                      {{ formatDateTime(eventDetail.endTime) }}
                    </n-descriptions-item>
                    <n-descriptions-item label="費用">
                      ${{ eventDetail.fee }}
                    </n-descriptions-item>
                    <n-descriptions-item label="人數">
                      {{ approvedParticipants.length }} / {{ eventDetail.participantMax }}
                    </n-descriptions-item>
                  </n-descriptions>
                  <n-space justify="end" style="margin-top: 16px;">
                    <n-button @click="handleParticipation" 
                              :disabled="!canParticipate" 
                              :loading="loading"
                              :style="{ backgroundColor: '#E6E6FA', color: '#000000' }">
                      {{ participationButtonText }}
                    </n-button>
                  </n-space>
                </n-card>
              </n-gi>
            </n-grid>

            <n-card title="活動描述" class="description-card">
              <n-text>{{ eventDetail.description }}</n-text>
            </n-card>

            <n-card title="活動統計" class="stats-card">
              <n-grid :cols="3" :x-gap="12">
                <n-gi>
                  <n-statistic label="已報名">
                    {{ approvedParticipants.length }}
                  </n-statistic>
                </n-gi>
                <n-gi>
                  <n-statistic label="人數上限">
                    {{ eventDetail.participantMax }}
                  </n-statistic>
                </n-gi>
                <n-gi>
                  <n-statistic label="成團人數">
                    {{ eventDetail.participantMin }}
                  </n-statistic>
                </n-gi>
              </n-grid>
            </n-card>

            <n-card title="活動相簿" class="photo-card">
              <EventPhoto 
                :workshopId="route.params.id" 
                :eventCreatorId="event.eventCreatorId" 
              />
            </n-card>

            <n-card title="參加者" class="participants-card">
              <n-scrollbar style="max-height: 300px">
                <n-space v-if="approvedParticipants.length > 0" justify="start" align="center" :wrap="true">
                  <div v-for="participant in approvedParticipants" :key="participant.userId" class="participant-item">
                    <n-avatar
                      :src="participant.photoUrl || defaultAvatarUrl"
                      :fallback-src="defaultAvatarUrl"
                      :size="50"
                    />
                    <span class="participant-name">{{ participant.userName }}</span>
                  </div>
                </n-space>
                <n-empty v-else description="暫無參加者" />
              </n-scrollbar>
            </n-card>
          </n-space>
          <n-result v-else-if="error" status="error" :title="error" />
        </n-spin>
      </n-space>
    </n-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '@/plugins/axios';
import useUserStore from "@/stores/userstore";
import EventPhoto from './EventPhoto.vue';
import {
  NCard, NSpin, NSpace, NButton, NResult, useMessage,
  NEmpty, NPageHeader, NGrid, NGi, NTag, NStatistic, NScrollbar,
  NImage, NEllipsis, NText, NDescriptions, NDescriptionsItem, NAvatar
} from 'naive-ui';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const event = ref({});
const eventDetail = ref(null);
const loading = ref(true);
const error = ref(null);
const participationStatus = ref(null);
const approvedParticipants = ref([]);
const message = useMessage();
const coverPhotoUrl = ref('https://via.placeholder.com/300');
const defaultAvatarUrl = 'https://via.placeholder.com/50';

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
    if(participantsData!=null){
    approvedParticipants.value = await Promise.all(participantsData.map(async (participant) => {
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
    }));}
  } catch (error) {
    console.error('讀取參加者失敗:', error);
    // message.error('讀取參加者失敗');
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
    participationStatus.value = { status: -1 };
  }
};

const fetchCoverPhoto = async () => {
  try {
    const photosResponse = await axios.get(`/eventPhoto/event/${route.params.id}`);
    if (photosResponse.data && photosResponse.data.length > 0) {
      const coverPhoto = photosResponse.data.find(photo => photo.isCover) || photosResponse.data[0];
      coverPhotoUrl.value = `${import.meta.env.VITE_API_URL}/eventPhoto/${route.params.id}/${coverPhoto.id}`;
    }
  } catch (error) {
    console.error('獲取封面照片失敗:', error);
  }
};

const participationButtonText = computed(() => {
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
      participationStatus.value = {
        eventId: route.params.id,
        userId: userStore.userId,
        status: 0
      };
    }
  } catch (error) {
    console.error('加入活動失敗:', error);
    message.error('加入活動失敗');
  } finally {
    loading.value = false;
  }
};

const back = () => {
  router.go(-1);
};

onMounted(() => {
  fetchEventDetail();
  fetchEvent();
  checkParticipationStatus();
  fetchApprovedParticipants();
  fetchCoverPhoto();
});
</script>

<style scoped>
.event-detail-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.main-card {
  background-color: #f8f9fa;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.custom-page-header {
  background-color: white;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.event-photo-card {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.square-photo {
  border-radius: 8px;
  overflow: hidden;
}

.detail-card, .stats-card, .description-card, .photo-card, .participants-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;
}

.participant-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 8px;
}

.participant-name {
  margin-top: 4px;
  font-size: 12px;
  text-align: center;
}

.photo-card {
  padding: 20px;
}
</style>