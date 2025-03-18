<script setup>
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '~/storage/userState';
import axios from 'axios'
const store = useUserStore();
const favoritesList = ref([]);
const isLoading = ref(true);
const pagination = ref({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
});

const fetchFavorites = async (page = 1) => {
    try {
        isLoading.value = true;
        const auth_token = localStorage.getItem('auth_token');

        const response = await axios.get(`http://38.180.227.189:9000/api/users/favorites`, {
            params: {
                page,
                limit: pagination.value.limit,
                withDetails: true
            },
            headers: {
                'Authorization': `Bearer ${auth_token}`
            }
        });

        // Используем response.data для axios вместо data.value
        if (response.data && response.data.success) {
            favoritesList.value = response.data.data;
            pagination.value = response.data.pagination;
        }
    } catch (error) {
        console.error('Ошибка при получении избранных лотов:', error);
        UNotification.show({
            color: 'red',
            title: 'Ошибка',
            text: 'Не удалось загрузить избранные лоты',
            timeout: 3000
        });
    } finally {
        isLoading.value = false;
    }
};

const removeFavorite = async (lotId) => {
    try {
        const auth_token = localStorage.getItem('auth_token');

        const response = await axios.post('http://38.180.227.189:9000/api/users/favorites',
            {
                lotId,
                action: 'remove'
            },
            {
                headers: {
                    'Authorization': `Bearer ${auth_token}`
                }
            }
        );

        if (response.data.success) {
            // Удаляем лот из списка
            favoritesList.value = favoritesList.value.filter(lot => lot._id !== lotId);
            pagination.value.total -= 1;

            UNotification.show({
                color: 'green',
                title: 'Удалено из избранного',
                text: 'Лот успешно удален из избранного',
                timeout: 2000
            });
        }
    } catch (error) {
        console.error('Ошибка при удалении из избранного:', error);
        UNotification.show({
            color: 'red',
            title: 'Ошибка',
            text: 'Не удалось удалить лот из избранного',
            timeout: 3000
        });
    }
};

const changePage = (newPage) => {
    pagination.value.page = newPage;
    fetchFavorites(newPage);
};

const formatDateTime = (date) => {
    return new Date(date).toLocaleDateString('uk-UA', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const formatPrice = (price) => {
    if (!price) return '0';
    return price.toLocaleString('uk-UA');
};

const getTimeLeftFormatted = (timeLeftObj) => {
    if (!timeLeftObj) return 'Аукцион завершен';

    const { days, hours, minutes } = timeLeftObj;

    if (days > 0) {
        return `${days} д ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } else {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
};

const isAuthenticated = computed(() => {
    return !!store.user;
});

onMounted(() => {
    if (isAuthenticated) {
        fetchFavorites();
    } else {
        // Перенаправляем на страницу входа, если пользователь не авторизован
        navigateTo('/auth/login');
    }
});
</script>

<template>
    <div class="w-full mx-auto p-4">
        <UBreadcrumb :links="[
            { label: '', icon: 'i-heroicons-home', to: '/' },
            { label: 'Личный кабинет', to: '/user/profile' },
            { label: 'Избранные лоты' }
        ]" class="mb-6" />

        <h1 class="text-2xl font-bold mb-6">Мои избранные лоты</h1>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-12">
            <UIcon name="i-heroicons-arrow-path-20-solid" class="w-8 h-8 animate-spin" />
        </div>

        <!-- Empty State -->
        <UCard v-else-if="favoritesList.length === 0" class="text-center py-8">
            <UIcon name="i-heroicons-heart" class="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 class="text-lg font-medium mb-2">У вас нет избранных лотов</h3>
            <p class="text-gray-500 mb-4">Добавляйте интересные лоты в избранное, чтобы быстро находить их позже</p>
            <UButton to="/" color="primary">Перейти к аукциону</UButton>
        </UCard>

        <!-- Lots Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <UCard v-for="lot in favoritesList" :key="lot._id" class="overflow-hidden flex flex-col">
                <!-- Lot Image -->
                <NuxtLink :to="`/lot/${lot._id}`" class="block relative aspect-square overflow-hidden">
                    <img :src="`http://38.180.227.189:9000${lot.photos?.[0]?.url || '/images/placeholder.jpg'}`"
                        :alt="lot.title" class="w-full h-full object-cover transition-transform hover:scale-105" />
                    <div class="absolute top-2 right-2">
                        <UButton icon="i-heroicons-heart" color="white" variant="solid" size="xs"
                            class="bg-black/30 hover:bg-black/50 text-red-500"
                            @click.prevent="removeFavorite(lot._id)" />
                    </div>
                </NuxtLink>

                <!-- Lot Info -->
                <div class="flex-1 p-3">
                    <NuxtLink :to="`/lot/${lot._id}`" class="block">
                        <h3 class="text-lg font-medium line-clamp-2 h-14 mb-2">{{ lot.title }}</h3>
                    </NuxtLink>

                    <div class="flex justify-between items-center mb-2">
                        <div class="text-xs text-gray-500">{{ formatDateTime(lot.createdAt) }}</div>
                        <UBadge v-if="lot.status === 'active'" color="green" size="xs">Активный</UBadge>
                        <UBadge v-else-if="lot.status === 'completed'" color="yellow" size="xs">Завершен</UBadge>
                        <UBadge v-else color="gray" size="xs">{{ lot.status }}</UBadge>
                    </div>

                    <div class="flex justify-between items-center mb-3">
                        <div class="text-sm">
                            <span class="text-gray-500">Ставок:</span> {{ lot.bidsCount || 0 }}
                        </div>
                        <div class="text-sm" v-if="lot.timeLeft">
                            <span class="text-gray-500">Осталось:</span> {{ getTimeLeftFormatted(lot.timeLeft) }}
                        </div>
                    </div>

                    <div class="font-bold text-primary-500 text-lg mb-2">
                        {{ formatPrice(lot.currentPrice) }} грн
                    </div>
                </div>

                <!-- Actions -->
                <div class="p-3 pt-0">
                    <UButton :to="`/lot/${lot._id}`" size="sm" color="primary" block>
                        Перейти к лоту
                    </UButton>
                </div>
            </UCard>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.pages > 1" class="flex justify-center mt-8">
            <UPagination v-model="pagination.page" :page-count="pagination.pages" :total="pagination.total"
                :page-size="pagination.limit" @click="page => changePage(page)" />
        </div>
    </div>
</template>
