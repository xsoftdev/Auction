<script setup lang="ts">
import { useUserStore } from '@/storage/userState';

const statusStore = ['Активні', "Збережені", "Куплені", "Завершені"];
const priceStore = ['Ціна спадання', 'Ціна зростання'];

const selectedPrice = ref(priceStore[0]);
const selectedStatus = ref(statusStore[0]);

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

// Вычисляемое свойство для сортировки лотов
const sortedLots = computed(() => {
    let lots = [...user.value.sellingLots];

    // Сортировка по цене
    if (selectedPrice.value === 'Ціна спадання') {
        lots.sort((a, b) => b.price - a.price);
    } else {
        lots.sort((a, b) => a.price - b.price);
    }

    // Фильтрация по статусу
    switch (selectedStatus.value) {
        case 'Активні':
            return lots.filter(lot => lot.status === 'active');
        case 'Збережені':
            return lots.filter(lot => lot.status === 'saved');
        case 'Куплені':
            return lots.filter(lot => lot.status === 'purchased');
        case 'Завершені':
            return lots.filter(lot => lot.status === 'completed');
        default:
            return lots;
    }
});
</script>

<template>
    <p class="text-[#23262F] font-[600] text-[28px] md:text-[36px] mb-6 md:mb-12">Продаж</p>
    <!-- Адаптивная сетка для фильтров -->
    <div class="grid md:grid-cols-2 grid-cols-1 gap-4 md:gap-8 mb-5">
        <div class="flex flex-col md:flex-row items-start md:items-center md:justify-between mb-2 md:mb-6">
            <p class="text-[16px] md:text-[20px] mb-2 md:mb-0">Сортувати за</p>
            <USelect v-model="selectedStatus" :options="statusStore" class="w-full md:w-[200px]" size="md" />
        </div>
        <div class="flex flex-col md:flex-row items-start md:items-center md:justify-between mb-2 md:mb-6">
            <p class="text-[16px] md:text-[20px] mb-2 md:mb-0">Сортувати за</p>
            <USelect v-model="selectedPrice" :options="priceStore" class="w-full md:w-[200px]" size="md" />
        </div>
    </div>
    <!-- Адаптивная сетка для товаров -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <template v-if="sortedLots.length">
            <ReusedItemsProduct v-for="lot in sortedLots" :key="lot._id"
                :image-src="lot.photos?.[0] ? `http://38.180.227.189:9000${lot.photos?.[0].url}` : '/images/exampleLots.png'"
                :title="lot.title" :truncate-length="48" :id="lot.id" />
        </template>
        <p v-else class="col-span-1 sm:col-span-2 md:col-span-3 text-center text-gray-500 py-8">
            Немає доступних лотів
        </p>
    </div>
</template>
