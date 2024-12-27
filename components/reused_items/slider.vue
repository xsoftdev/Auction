<script setup lang="ts">
const containerRef = ref()
const slides = ref(Array.from({ length: 10 }))
const swiper = useSwiper(containerRef)

onMounted(() => {
    console.log(swiper.instance)
})

const props = defineProps({
    title: {
        type: String,
    },
    link: {
        type: String
    },
    slidesCount: {
        type: Number,
        default: 10
    }
})
</script>

<template>
    <div class="mb-20">
        <div class="slider-details flex flex-row items-center justify-between mb-10">
            <h2 class="text-[36px] font-medium">{{ title }}</h2>
            <NuxtLink :to="link" class="flex flex-row items-center">
                <p class="text-gray-400 text-[20px] mr-6">Переглянути всі</p> <img src="/icon/arrow-back.svg" alt="">
            </NuxtLink>
        </div>
        <div class="flex flex-row items-center max-w-[1420px] mx-auto">
            <button @click="swiper.prev()" class="mr-5">
                <img src="/icon/slider-arrow.svg" class="rotate-[180deg]">
            </button>
            <ClientOnly>
                <swiper-container :slides-per-view="3" :space-between="20" :breakpoints="{
                    640: { slidesPerView: 2, spaceBetween: 10 },
                    768: { slidesPerView: 3, spaceBetween: 15 },
                    1024: { slidesPerView: 4, spaceBetween: 20 },
                    1280: { slidesPerView: 5, spaceBetween: 30 }
                }" ref="containerRef" class="max-w-[1320px]">
                    <swiper-slide v-for="(slide, idx) in slidesCount" :key="idx">
                        <ReusedItemsProduct 
                        :image-src="'/images/exampleLots.png'" 
                        :title="'10000 Драм 10 лет Кассационному Суду Армения золото'" 
                        :price="32500" 
                        :truncate-length="48"
                        :id="`${idx + 1}`"
                        />
                    </swiper-slide>
                </swiper-container>
            </ClientOnly>
            <button @click="swiper.next()" class="ml-5">
                <img src="/icon/slider-arrow.svg" alt="">
            </button>
        </div>
    </div>
</template>