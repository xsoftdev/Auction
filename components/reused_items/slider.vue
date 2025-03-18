<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/swiper-bundle.css'
import { ref, onMounted } from 'vue'

// Props
const props = defineProps({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    slidesCount: {
        type: Number,
        default: 10,
    },
})

// Extract category from link
const getCategory = () => {
    const path = props.link;
    return path.split('/').pop();
}

// Lots data
const lots = ref([]);
const loading = ref(true);
const error = ref(null);

// Swiper instance
const swiperInstance = ref(null);

// Fetch lots data
const fetchLots = async () => {
    const category = getCategory();
    loading.value = true;
    error.value = null;

    try {
        const response = await fetch(`http://38.180.227.189:9000/api/lots/${category}`);
        if (!response.ok) {
            throw new Error(`Ошибка при загрузке данных: ${response.status}`);
        }
        const data = await response.json();

        // Ensure we get an array of lots and limit to the specified count
        if (data.lots && Array.isArray(data.lots)) {
            lots.value = data.lots.slice(0, props.slidesCount);
        } else if (Array.isArray(data)) {
            lots.value = data.slice(0, props.slidesCount);
        } else {
            lots.value = [];
            console.warn('Unexpected data format received:', data);
        }
    } catch (err) {
        console.error('Failed to fetch lots:', err);
        error.value = err.message;
        lots.value = [];
    } finally {
        loading.value = false;
    }
};

// Fetch data when component mounts
onMounted(fetchLots);

// Custom navigation functions
const slideNext = () => {
    if (swiperInstance.value) {
        swiperInstance.value.slideNext();
    } else {
        console.warn('Swiper instance is not initialized yet.');
    }
};

const slidePrev = () => {
    if (swiperInstance.value) {
        swiperInstance.value.slidePrev();
    } else {
        console.warn('Swiper instance is not initialized yet.');
    }
};

// Helper for getting first photo URL or default image
const getPhotoUrl = (lot) => {
    if (lot.photos && lot.photos.length > 0) {
        return lot.photos[0]; // Assuming photos is an array of URLs
    }
    return '/images/exampleLots.png'; // Fallback image
};
</script>

<template>
    <div class="mb-20">
        <!-- Header with title and link -->
        <div class="slider-details flex flex-row items-center justify-between md:mb-10 mb-4">
            <h2 class="md:text-[36px] text-[24px] font-medium">{{ title }}</h2>
            <NuxtLink :to="link" class="flex flex-row items-center">
                <p class="text-gray-400 md:text-[20px] text-[16px] md:mr-6 mr-2">Переглянути всі</p>
                <img src="/icon/arrow-back.svg" alt="" class="md:w-8 w-6" />
            </NuxtLink>
        </div>

        <!-- Swiper Slider Container -->
        <div class="flex flex-row items-center w-full mx-auto">
            <!-- Previous button -->
            <button @click="slidePrev" class="flex-shrink-0 mr-2 md:mr-4 w-8 md:w-10 md:block hidden">
                <img src="/icon/slider-arrow.svg" class="rotate-[180deg]" alt="Previous" />
            </button>

            <!-- Loading state -->
            <div v-if="loading" class="flex-grow flex justify-center items-center py-10">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>

            <!-- Error state -->
            <div v-else-if="error" class="flex-grow text-center text-red-500 py-8">
                {{ error }}
            </div>

            <!-- Empty state with call-to-action -->
            <div v-else-if="lots.length === 0" class="flex-grow flex flex-col items-center justify-center py-10 px-4">
                <p class="text-gray-600 text-lg mb-4">В цій категорії поки що немає лотів</p>
                <NuxtLink to="/clientarea/create_lot" class="bg-scarlet-600 hover:bg-scarlet-700 text-white font-medium py-3 px-6 rounded-md transition duration-300 flex items-center">
                    <span class="mr-2">Додайте свий лот</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                </NuxtLink>
            </div>

            <!-- Swiper Component with data -->
            <Swiper v-else @swiper="swiperInstance = $event" :slides-per-view="1" :space-between="20" :breakpoints="{
                480: { slidesPerView: 2, spaceBetween: 12 },
                768: { slidesPerView: 3, spaceBetween: 16 },
                1024: { slidesPerView: 4, spaceBetween: 20 },
                1280: { slidesPerView: 5, spaceBetween: 24 }
            }" class="flex-grow w-full">
                <SwiperSlide v-for="lot in lots" :key="lot.id || lot._id" class="h-auto">
                    <div class="p-1 h-full">
                        <ReusedItemsProduct :image-src="getPhotoUrl(lot)" :title="lot.title" :price="lot.currentPrice"
                            :truncate-length="48" :id="lot.id || lot._id" class="h-full w-full" />
                    </div>
                </SwiperSlide>
            </Swiper>

            <!-- Next button -->
            <button @click="slideNext" class="flex-shrink-0 ml-2 md:ml-4 w-8 md:w-10 md:block hidden">
                <img src="/icon/slider-arrow.svg" alt="Next" />
            </button>
        </div>
    </div>
</template>

<style scoped>
/* Ensure swiper container takes full width */
:deep(.swiper) {
    width: 100%;
}

/* Ensure slides have consistent sizing */
:deep(.swiper-slide) {
    height: auto;
    display: flex;
}
</style>