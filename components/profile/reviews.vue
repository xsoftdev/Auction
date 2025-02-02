<script setup lang="ts">
import { ref, computed } from "vue";

const statusStore = ['Всі відгуки', "Позитивний", "Негативний", "Нейтральний"];
const reviews = [
    {
        username: "Владислав Зайцев",
        avatar: "https://i.pravatar.cc/50", // Заглушка для аватара
        status: "Позитивний",
        stars: 5,
        review: "KaiB was amazing with our cats!! 🌟🌟🌟 This was our first time using a pet-sitting service, so we were naturally quite anxious. We took a chance on Kai and completely lucked out! We booked Kai to come twice a day for three days. Kai spent a considerable amount of time playing and engaging with our cats. She also sent us very funny and detailed reports at the end of each session. She truly gave us peace of mind while on holiday, knowing our furbabies were in good hands. We also kept looking forward to her cute updates! You can tell she’s a natural with animals. I'd definitely book her again. Highly recommended!"
    },
    {
        username: "Владислав Зайцев",
        avatar: "https://i.pravatar.cc/50",
        status: "Негативний",
        stars: 1,
        review: "KaiB was amazing with our cats!! 🌟🌟🌟 This was our first time using a pet-sitting service, so we were naturally quite anxious. We took a chance on Kai and completely lucked out! We booked Kai to come twice a day for three days. Kai spent a considerable amount of time playing and engaging with our cats. She also sent us very funny and detailed reports at the end of each session. She truly gave us peace of mind while on holiday, knowing our furbabies were in good hands. We also kept looking forward to her cute updates! You can tell she’s a natural with animals. I'd definitely book her again. Highly recommended!"
    },
    {
        username: "Владислав Зайцев",
        avatar: "https://i.pravatar.cc/50",
        status: "Нейтральний",
        stars: 3,
        review: "KaiB was amazing with our cats!! 🌟🌟🌟 This was our first time using a pet-sitting service, so we were naturally quite anxious. We took a chance on Kai and completely lucked out! We booked Kai to come twice a day for three days. Kai spent a considerable amount of time playing and engaging with our cats. She also sent us very funny and detailed reports at the end of each session. She truly gave us peace of mind while on holiday, knowing our furbabies were in good hands. We also kept looking forward to her cute updates! You can tell she’s a natural with animals. I'd definitely book her again. Highly recommended!"
    }
];

const selectedStatus = ref(statusStore[0]);

const filteredReviews = computed(() =>
    selectedStatus.value === "Всі відгуки"
        ? reviews
        : reviews.filter((review) => review.status === selectedStatus.value)
);

</script>

<template>
    <p class="text-[#23262F] font-[600] text-[36px] mb-12">Відгуки</p>
    <div class="flex flex-row items-center justify-between mb-6">
        <p class="text-[20px]">Сортувати за</p>
        <USelect v-model="selectedStatus" :options="statusStore" class="w-[200px]" />
    </div>
    <div class="space-y-4">
        <div v-for="review in filteredReviews" :key="review.username"
            class=" p-4 rounded-2xl flex flex-col space-y-4 border border-gray-200">
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
    </div>
</template>
