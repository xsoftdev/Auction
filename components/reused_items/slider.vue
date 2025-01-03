<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/swiper-bundle.css'
import { ref } from 'vue'

// Props
const props = defineProps({
  title: {
    type: String,
  },
  link: {
    type: String,
  },
  slidesCount: {
    type: Number,
    default: 10,
  },
})

// Slides data
const slides = Array.from({ length: props.slidesCount })

// Swiper instance
const swiperInstance = ref(null)

// Custom navigation functions
const slideNext = () => {
    console.log(swiperInstance.value)
  if (swiperInstance.value) {
    swiperInstance.value.slideNext()
  } else {
    console.warn('Swiper instance is not initialized yet.')
  }
}

const slidePrev = () => {
  if (swiperInstance.value) {
    swiperInstance.value.slidePrev()
  } else {
    console.warn('Swiper instance is not initialized yet.')
  }
}
</script>

<template>
  <div class="mb-20">
    <!-- Header with title and link -->
    <div class="slider-details flex flex-row items-center justify-between md:mb-10 mb-4">
      <h2 class="md:text-[36px] text-[24px] font-medium">{{ title }}</h2>
      <NuxtLink :to="link" class="flex flex-row items-center">
        <p class="text-gray-400 md:text-[20px] text-[16px] md:mr-6 mr-2">Переглянути всі</p>
        <img src="/icon/arrow-back.svg" alt="" class="md:w-8 w-6"/>
      </NuxtLink>
    </div>

    <!-- Swiper Slider -->
    <div class="flex flex-row items-center max-w-[1420px] mx-auto">
      <!-- Previous button -->
      <button @click="slidePrev" class="mr-5 w-10 md:block hidden">
        <img src="/icon/slider-arrow.svg" class="rotate-[180deg]" alt="Previous" />
      </button>

      <!-- Swiper Component -->
      <Swiper
        @swiper="swiperInstance = $event"
        :slides-per-view="3"
        :space-between="20"
        :breakpoints="{
          320: { slidesPerView: 2, spaceBetween: 10 },
          768: { slidesPerView: 3, spaceBetween: 15 },
          1024: { slidesPerView: 4, spaceBetween: 20 },
          1280: { slidesPerView: 5, spaceBetween: 30 }
        }"
        class="max-w-[1320px]"
      >
        <SwiperSlide
          v-for="(slide, idx) in slides"
          :key="idx"
        >
          <ReusedItemsProduct
            :image-src="'/images/exampleLots.png'"
            :title="'10000 Драм 10 лет Кассационному Суду Армения золото'"
            :price="32500"
            :truncate-length="48"
            :id="`${idx + 1}`"
          />
        </SwiperSlide>
      </Swiper>

      <!-- Next button -->
      <button @click="slideNext" class="ml-5 w-10 md:block hidden">
        <img src="/icon/slider-arrow.svg" alt="Next" />
      </button>
    </div>
  </div>
</template>
