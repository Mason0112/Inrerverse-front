<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-card class="event-approve-container">
      <n-h1>我主辦的活動/工作坊</n-h1>
      <n-spin :show="loading">
        <n-result v-if="error" status="error" :title="error" />
        <div v-else>
          <!-- 活動列表 -->
          <div v-if="!selectedEvent" class="event-list">
            <n-h2>您創建的活動</n-h2>
            <n-empty v-if="events.length === 0" description="您還沒有創建任何活動" />
            <n-list v-else>
              <n-list-item v-for="event in events" :key="event.id" @click="selectEvent(event)" class="event-item">
                <div class="event-info">
                  {{ event.eventName }} - {{ event.clubName || '工作坊' }}
                  <n-tag v-if="event.hasPendingMembers" type="warning" size="small" class="warning-tag">
                    待審核
                  </n-tag>
                </div>
              </n-list-item>
            </n-list>
          </div>

          <!-- 待審核參與者列表 -->
          <div v-else>
            <n-h2>{{ selectedEvent.eventName }} - {{ selectedEvent.clubName || '工作坊' }} - 待審核參與者</n-h2>
            <n-button @click="backToEventList" class="back-button">返回活動列表</n-button>
            <n-empty v-if="pendingParticipants.length === 0" description="沒有待審核的參與者" />
            <n-data-table v-else :columns="columns" :data="pendingParticipants" />
          </div>
        </div>
      </n-spin>
    </n-card>
  </n-config-provider>
</template>
  
  <script setup>
  import { ref, onMounted, h } from 'vue';
import axios from '@/plugins/axios';
import useUserStore from "@/stores/userstore";
import { 
  NConfigProvider, NCard, NSpin, NResult, NH1, NH2, NEmpty, NList, NListItem, 
  NButton, NDataTable,  NTag, useMessage,
} from 'naive-ui';

const userStore = useUserStore();
const message = useMessage();
const events = ref([]);
const selectedEvent = ref(null);
const pendingParticipants = ref([]);
const loading = ref(true);
const error = ref(null);

const themeOverrides = {
  common: {
    primaryColor: '#FFC0CB', // 淡粉紅
    primaryColorHover: '#FFB6C1', // 稍深的粉紅
    primaryColorPressed: '#FF69B4', // 更深的粉紅
  },
  Card: {
    color: '#FFF0F5', // 淡粉紅背景
  },
  Button: {
    textColor: '#8E44AD', // 淡紫色文字
    border: '1px solid #8E44AD',
    borderHover: '1px solid #9B59B6',
    borderPressed: '1px solid #8E44AD',
    colorHover: '#E8DAEF', // 淡紫色懸停背景
    colorPressed: '#D2B4DE', // 淡紫色按下背景
  },
  List: {
    color: '#FFE4E1', // 略深的粉色作為列表背景
  },
  ListItem: {
    colorHover: '#FFD1DC', // 懸停時的顏色
  }
};

const columns = [
  { title: '用戶ID', key: 'userId' },
  { title: '用戶名', key: 'userName' },
  {
    title: '操作',
    key: 'actions',
    render: (row) => {
      return h('div', [
        h(
          NButton,
          {
            size: 'small',
            onClick: () => approveParticipant(row.userId),
            loading: row.approving,
            disabled: row.deleting,
          },
          { default: () => row.approving ? '審核中...' : '批准' }
        ),
        h(
          NButton,
          {
            size: 'small',
            onClick: () => removeParticipant(row.userId),
            loading: row.deleting,
            disabled: row.approving,
            style: 'margin-left: 8px; background-color: #FF69B4;'
          },
          { default: () => row.deleting ? '刪除中...' : '刪除' }
        )
      ]);
    }
  }
];
  
const fetchUserEvents = async () => {
  try {
    const response = await axios.get(`/events/creator?creatorId=${userStore.userId}`);
    events.value = await Promise.all(response.data.map(async event => {
      const pendingParticipants = await fetchPendingParticipants(event.id);
      return {
        ...event,
        clubName: event.clubName || '工作坊',
        hasPendingMembers: pendingParticipants.length > 0
      };
    }));
    loading.value = false;
  } catch (err) {
    console.error('Error fetching user events:', err);
    error.value = '獲取活動列表時出錯';
    loading.value = false;
  }
};
  const backToEventList = () => {
    selectedEvent.value = null;
    pendingParticipants.value = [];
  };
  const selectEvent = async (event) => {
  selectedEvent.value = event;
  loading.value = true;
  try {
    const participants = await fetchPendingParticipants(event.id);
    pendingParticipants.value = participants.map(p => ({
      ...p,
      approving: false,
      deleting: false
    }));
  } catch (err) {
    console.error('Error fetching pending participants:', err);
    message.error('获取待审核参与者时出错');
  } finally {
    loading.value = false;
  }
};

const fetchPendingParticipants = async (eventId) => {
  try {
    const response = await axios.get(`/eventParticipant/event/${eventId}/pending-participants`);
    return response.data;
  } catch (err) {
    console.error('Error fetching pending participants:', err);
    return [];
  }
};

  //審核成功(status改為1)
  const approveParticipant = async (userId) => {
    const participant = pendingParticipants.value.find(p => p.userId === userId);
    if (!participant) return;
  
    participant.approving = true;
    try {
      await axios.put(`/eventParticipant/approve/${selectedEvent.value.id}/${userId}`);
      // 從列表中移除已批准的參與者
      pendingParticipants.value = pendingParticipants.value.filter(p => p.userId !== userId);
    } catch (err) {
      console.error('Error approving participant:', err);
      alert('審核參與者時出錯');
    } finally {
      participant.approving = false;
    }
  };
  
  //審核刪除
  const removeParticipant = async (userId) => {
  const participant = pendingParticipants.value.find(p => p.userId === userId);
  if (!participant) return;

  participant.deleting = true;
  try {
    await axios.delete(`/eventParticipant/event/${selectedEvent.value.id}/user/${userId}`);
    // 從列表中移除已刪除的參與者
    pendingParticipants.value = pendingParticipants.value.filter(p => p.userId !== userId);
  } catch (err) {
    console.error('Error removing participant:', err);
    alert('刪除參與者時出錯');
  } finally {
    participant.deleting = false;
  }
};

  onMounted(() => {
    fetchUserEvents();
  });
  </script>
  
  <style scoped>
  .event-approve-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  .event-list {
  border-radius: 8px;
  overflow: hidden; /* 確保圓角效果能夠應用到子元素 */
}

.event-item {
  cursor: pointer;
  transition: background-color 0.3s;
  padding: 10px;
}

.event-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.warning-tag {
  margin-left: 10px;
}

.event-item:hover {
  background-color: #FFD1DC; /* 與 themeOverrides 中的 ListItem.colorHover 保持一致 */
}
  
  .back-button {
    margin-bottom: 20px;
  }
  </style>