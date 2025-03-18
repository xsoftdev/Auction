<script setup lang="ts">
import { ref, computed } from "vue";
import { useUserStore } from '@/storage/userState';

const statusStore = ['Всі відгуки', "Позитивний", "Негативний", "Нейтральний"];
const selectedStatus = ref(statusStore[0]);

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const getReviewStatus = (rating: number) => {
    if (rating >= 4) return "Позитивний";
    if (rating <= 2) return "Негативний";
    return "Нейтральний";
};

const filteredReviews = computed(() => {
    if (!user.value.reviews) return [];

    const reviews = user.value.reviews.map(review => ({
        username: review.author,
        avatar: "https://i.pravatar.cc/50",
        status: getReviewStatus(review.rating),
        stars: review.rating,
        review: review.comment,
        createdAt: review.createdAt
    }));

    return selectedStatus.value === "Всі відгуки"
        ? reviews
        : reviews.filter((review) => review.status === selectedStatus.value);
});
</script>

<template>
    <p class="text-[#23262F] font-[600] text-[36px] mb-12">Відгуки</p>
    <div class="flex flex-row items-center justify-between mb-6">
        <p class="text-[20px]">Сортувати за</p>
        <USelect v-model="selectedStatus" :options="statusStore" class="w-[200px]" />
    </div>
    <div class="space-y-4">
        <template v-if="filteredReviews.length">
            <div v-for="review in filteredReviews" :key="review.createdAt"
                class="p-4 rounded-2xl flex flex-col space-y-4 border border-gray-200">
                <div class="flex items-center space-x-4">
                    <img :src="review.avatar" alt="avatar" class="w-12 h-12 rounded-full">
                    <div class="flex flex-row items-center justify-between w-full">
                        <p class="font-semibold text-[18px]">{{ review.username }}</p>
                        <div class="flex items-center space-x-2">
                            <span class="px-3 py-1 rounded-xl text-sm" :class="{
                                'bg-[#3FB117] text-white': review.status === 'Позитивний',
                                'bg-[#FF3400] text-white': review.status === 'Негативний',
                                'bg-[#828282] text-white': review.status === 'Нейтральний'
                            }">
                                {{ review.status }}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="flex">
                    <span v-for="star in 5" :key="star" class="text-gray-300 text-2xl">
                        <span v-if="star <= review.stars" class="text-yellow-500">
                            <img src="/icon/stars-active.svg" alt="">
                        </span>
                        <span v-else>
                            <img src="/icon/stars-inactive.svg" alt="">
                        </span>
                    </span>
                </div>
                <p class="text-gray-700 text-[14px] leading-relaxed">
                    {{ review.review }}
                </p>
            </div>
        </template>
        <p v-else class="text-center text-gray-500 py-8">
            Немає відгуків
        </p>
    </div>
</template>
