<template>
    <div class="mt-8">
        <h2 class="text-xl font-bold mb-4">俱樂部活動</h2>

        <!-- 只有成員可以看到添加活動表單 -->
        <AddClubEventForm v-if="isMember" :clubId="clubId" @eventAdded="onEventAdded" />

        <div v-if="loading" class="text-center text-gray-600">
            加載中...
        </div>
        <div v-else-if="error" class="text-center text-red-500">
            {{ error }}
        </div>
        <div v-else-if="events.length === 0" class="text-center text-gray-600">
            該俱樂部目前沒有活動。
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="event in events" :key="event.id" class="border rounded p-4 shadow">
                <h3 class="text-lg font-semibold mb-2">{{ event.eventName }}</h3>
                <p class="text-gray-600 mb-2">創建者: {{ event.creatorName }}</p>
                <p class="text-gray-600 mb-2">日期: {{ formatDate(event.added) }}</p>
                <router-link :to="{ name: 'event-detail-link', params: { id: event.id } }"
                    class="text-blue-500 hover:underline">
                    查看詳情
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from '@/plugins/axios';
import AddClubEventForm from './AddClubEventForm.vue';

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

const events = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchClubEvents = async () => {
    loading.value = true;
    error.value = null;
    try {
        // console.log("Fetching events for clubId:", props.clubId);//印
        const response = await axios.get('/events');
        // console.log("All events:", response.data);//印
        events.value = response.data.filter(event =>
            event.source === 1 && Number(event.clubId) === Number(props.clubId)
        );
        // console.log("qqqq:", events.value)
    } catch (err) {
        console.error('獲取俱樂部活動失敗:', err);
        error.value = '獲取活動失敗，請稍後再試。';
    } finally {
        loading.value = false;
    }
};

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('zh-TW', options);
};

const onEventAdded = (newEvent) => {
  events.value.unshift(newEvent);
};

onMounted(() => {
    console.log("ClubEvents mounted with clubId:", props.clubId);
    fetchClubEvents();
});

// 當 clubId 改變時重新獲取數據
watch(() => props.clubId, fetchClubEvents);
</script>