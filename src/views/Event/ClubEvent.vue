<template>
  <div class="mt-8">
    <n-h2 prefix="bar">俱樂部活動</n-h2>

    <n-spin :show="loading">
      <n-result
        v-if="error"
        status="error"
        :title="error"
        :description="'獲取活動失敗，請稍後再試。'"
      />
      <n-empty v-else-if="events.length === 0" description="該俱樂部目前沒有活動。" />
      <n-grid v-else :x-gap="12" :y-gap="8" :cols="2">
        <n-gi v-for="event in events" :key="event.id">
          <n-card :title="event.eventName" size="small">
            <template #header-extra>
              <n-space>
                <n-button v-if="canUserEdit(event)" size="tiny" @click="editEvent(event)" type="primary">
                  編輯
                </n-button>
                <n-button v-if="canUserEdit(event)" size="tiny" @click="confirmDelete(event)" type="error">
                  刪除
                </n-button>
              </n-space>
            </template>
            <n-space vertical>
              <span>創建者: {{ event.creatorName }}</span>
              <span>開始時間: {{ formatDate(event.startTime) }}</span>
            </n-space>
            <template #footer>
              <n-button text @click="goToEventDetail(event.id)">
                查看詳情
              </n-button>
            </template>
          </n-card>
        </n-gi>
      </n-grid>
    </n-spin>

    <!-- 編輯模態框 -->
    <n-modal v-model:show="showEditModal">
      <n-card
        style="width: 600px"
        title="編輯活動"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <n-form>
          <n-form-item label="活動名稱">
            <n-input v-model:value="editingEvent.eventName" placeholder="活動名稱" />
          </n-form-item>
          <n-form-item label="活動詳情">
            <n-input
              v-model:value="editingEvent.description"
              type="textarea"
              placeholder="活動詳情"
            />
          </n-form-item>
        </n-form>
        <template #footer>
          <n-button @click="updateEvent" type="primary">保存</n-button>
          <n-button @click="showEditModal = false">取消</n-button>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from '@/plugins/axios';
import AddClubEventForm from './AddClubEventForm.vue';
import useUserStore from "@/stores/userstore";
import { useRouter } from 'vue-router';
import { useDialog, useMessage } from 'naive-ui';
import {
  NH2, NButton, NCard, NEmpty, NForm, NFormItem, 
  NGi, NGrid, NInput, NModal, NResult, NSpace, NSpin
} from 'naive-ui';

const props = defineProps({
  clubId: {
    type: Number,
    required: true
  },
  isMember: {
    type: Boolean,
    required: true
  }
});

const router = useRouter();
const userStore = useUserStore();
const dialog = useDialog();
const message = useMessage();

const events = ref([]);
const loading = ref(true);
const error = ref(null);
const showEditModal = ref(false);
const editingEvent = ref({});

const fetchClubEvents = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get('/events');
    const clubEvents = response.data.filter(event =>
      event.source === 1 && Number(event.clubId) === Number(props.clubId)
    );
    
    // 獲取每個事件的 EventDetail
    events.value = await Promise.all(clubEvents.map(async (event) => {
      try {
        const detailResponse = await axios.get(`/eventDetail/${event.id}/show`);
        return {
          ...event,
          startTime: detailResponse.data.startTime
        };
      } catch (error) {
        console.error(`獲取事件 ${event.id} 的詳情失敗:`, error);
        return event;
      }
    }));
  } catch (err) {
    console.error('獲取俱樂部活動失敗:', err);
    error.value = '獲取活動失敗，請稍後再試。';
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '未設置時間';
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('zh-TW', options);
};


const canUserEdit = (event) => {
  return userStore.userId === event.eventCreatorId;
};

const editEvent = (event) => {
  editingEvent.value = { ...event };
  showEditModal.value = true;
};

const updateEvent = async () => {
  try {
    const response = await axios.put(`/events/${editingEvent.value.id}/edit`, {
      source: 1,
      eventName: editingEvent.value.eventName,
      eventCreator: { id: userStore.userId },
      description: editingEvent.value.description,
      club: { id: props.clubId }
    });
    if (response.status === 200) {
      const index = events.value.findIndex(e => e.id === editingEvent.value.id);
      if (index !== -1) {
        events.value[index] = { ...events.value[index], ...editingEvent.value };
      }
      showEditModal.value = false;
      message.success('活動更新成功');
    }
  } catch (error) {
    console.error('更新活動失敗:', error);
    message.error('更新活動失敗');
  }
};

const goToEventDetail = (eventId) => {
  router.push({ name: 'event-detail-link', params: { id: eventId } });
};

const confirmDelete = (event) => {
  dialog.warning({
    title: '確認刪除',
    content: '您確定要刪除這個活動嗎？此操作不可撤銷。',
    positiveText: '確認刪除',
    negativeText: '取消',
    onPositiveClick: () => deleteEvent(event),
    onNegativeClick: () => {}
  });
};

const deleteEvent = async (event) => {
  try {
    const response = await axios.delete(`/events/${event.id}`);
    if (response.status === 200) {
      events.value = events.value.filter(e => e.id !== event.id);
      message.success('活動已成功刪除');
    }
  } catch (error) {
    console.error('刪除活動失敗:', error);
    message.error('刪除活動失敗，請稍後再試');
  }
};

onMounted(() => {
  console.log("ClubEvents mounted with clubId:", props.clubId);
  fetchClubEvents();
});

// 當 clubId 改變時重新獲取數據
watch(() => props.clubId, fetchClubEvents);
</script>

<style scoped>
.mt-8 {
  margin-top: 2rem;
}
</style>