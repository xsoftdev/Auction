<script setup lang="ts">
const statusStore = ['Активні', "Збережені", "Куплені", "Завершені"];
const priceStore = ['Ціна спадання', 'Ціна зростання'];

const selectedPrice = ref(priceStore[0])
const selectedStatus = ref(statusStore[0]);
</script>
<template>
    <p class="text-[#23262F] font-[600] text-[36px] mb-12">Продаж</p>
    <div class="grid grid-cols-2 gap-8 mb-5">
        <div class="flex flex-row items-center justify-between mb-6">
            <p class="text-[20px]">Сортувати за</p>
            <USelect v-model="selectedStatus" :options="statusStore" class="w-[200px]" />
        </div>
        <div class="flex flex-row items-center justify-between mb-6">
            <p class="text-[20px]">Сортувати за</p>
            <USelect v-model="selectedPrice" :options="priceStore" class="w-[200px]" />
        </div>
    </div>
    <div class="grid grid-cols-3 gap-4">
        <template v-for="idx in 5">
            <ReusedItemsProduct :image-src="'/images/exampleLots.png'"
                :title="'10000 Драм 10 лет Кассационному Суду Армения золото'" :price="32500" :truncate-length="48"
                :id="`${idx + 1}`" />
        </template>
    </div>
</template>