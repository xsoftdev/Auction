<!-- pages/lots.vue -->
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useCategoryStore } from '~/storage/partitionState';

// Initialize store
const categoryStore = useCategoryStore();

// Route
const route = useRoute();
const key = computed(() => {
    // Extract key from route path or query
    const pathKey = route.params.key || route.path.split('/').pop();
    return pathKey || route.query.key || null;
});

// State
const category = computed(() => categoryStore.category);
const lots = computed(() => categoryStore.lots);
const isLoading = computed(() => categoryStore.isLoading);
const storeError = computed(() => categoryStore.error);

const isInitialLoad = ref(true);
const error = ref(null);
const isFiltersMobileOpen = ref(false);

// Минимальное время отображения лоадера (в миллисекундах)
const MIN_LOADING_TIME = 800;

// Filters state
const filters = ref({
    minPrice: null as number | null,
    maxPrice: null as number | null,
    quality: 'Всі' as string,
    delivery: 'Всі' as string,
    sort: 'newest' // newest, price-asc, price-desc
});

// Options for filters
const qualityOptions = ["Всі", "б/в", "Новий"];
const deliveryOptions = ["Всі", "Нова пошта", "Укрпошта", "Meest", "Інше"];
const sortOptions = [
    { label: 'Спочатку нові', value: 'newest' },
    { label: 'Від дешевих до дорогих', value: 'price-asc' },
    { label: 'Від дорогих до дешевих', value: 'price-desc' }
];

// Fetch category data using the store
const fetchCategory = async () => {
    try {
        if (!key.value) {
            error.value = 'Відсутній параметр ключа категорії';
            return;
        }

        // Use the store action to fetch category by key
        await categoryStore.fetchCategoryById(key.value.toString());

        if (categoryStore.error) {
            error.value = categoryStore.error;
        }
    } catch (e) {
        error.value = e.message;
    }
};

// Watch route changes
watch(() => route.path, () => {
    // Reset when navigating between different categories
    if (key.value) {
        isInitialLoad.value = true;
        categoryStore.resetCategory();
        categoryStore.resetLots();
        fetchCategory();
    } else {
        error.value = 'Відсутній параметр ключа категорії';
    }
}, { immediate: true });

// Initial data fetch
onMounted(async () => {
    // Reset any previous state
    categoryStore.resetCategory();
    categoryStore.resetLots();

    if (key.value) {
        await fetchCategory();
    } else {
        error.value = 'Відсутній параметр ключа категорії';
    }
});

// Breadcrumbs
const breadcrumbs = computed(() => {
    return [{
        label: '',
        icon: 'i-heroicons-home',
        to: '/'
    }, {
        label: category.value?.name || 'Категорія',
        icon: '',
    }];
});

// Reset filters
const resetFilters = () => {
    filters.value = {
        minPrice: null,
        maxPrice: null,
        quality: 'Всі',
        delivery: 'Всі',
        sort: 'newest'
    };
};

// Toggle mobile filters
const toggleMobileFilters = () => {
    isFiltersMobileOpen.value = !isFiltersMobileOpen.value;
};
</script>

<template>
    <div class="md:container mx-auto px-4 pb-8">
        <!-- Breadcrumbs -->
        <div class="mb-6">
            <UBreadcrumb :links="breadcrumbs" />
        </div>

        <!-- Category Title -->
        <h1 v-if="category" class="text-2xl md:text-3xl font-bold mb-8">{{ category.name }}</h1>

        <!-- Error Banner when no key is provided -->
        <UAlert v-if="error && error.includes('ключа категорії')" color="yellow" title="Внимание"
            icon="i-heroicons-exclamation-triangle" class="mb-6">
            {{ error }}
            <template #footer>
                <p class="text-sm">Пожалуйста, выберите категорию или перейдите на
                    <NuxtLink to="/" class="text-primary hover:underline">главную страницу</NuxtLink>
                </p>
            </template>
        </UAlert>

        <!-- Mobile Filter Toggle Button -->
        <div v-if="!error || !error.includes('ключа категорії')" class="md:hidden mb-4">
            <UButton block color="primary" variant="soft" @click="toggleMobileFilters">
                <UIcon name="i-heroicons-funnel" class="mr-2" />
                {{ isFiltersMobileOpen ? 'Сховати фільтри' : 'Показати фільтри' }}
            </UButton>
        </div>

        <!-- Filters Section -->
        <div v-if="!error || !error.includes('ключа категорії')" class="bg-white rounded-lg shadow p-4 md:p-6 mb-8"
            :class="{
                'block': isFiltersMobileOpen,
                'hidden': !isFiltersMobileOpen,
                'md:block': true
            }">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <!-- Price Range -->
                <div class="space-y-2">
                    <label class="text-sm text-gray-600">Ціна</label>
                    <div class="flex gap-2">
                        <UInput v-model="filters.minPrice" type="number" placeholder="Від" class="w-full" />
                        <UInput v-model="filters.maxPrice" type="number" placeholder="До" class="w-full" />
                    </div>
                </div>

                <!-- Quality Filter -->
                <div class="space-y-2">
                    <label class="text-sm text-gray-600">Стан</label>
                    <USelect v-model="filters.quality" :options="qualityOptions" placeholder="Виберіть стан"
                        class="w-full" />
                </div>

                <!-- Delivery Filter -->
                <div class="space-y-2">
                    <label class="text-sm text-gray-600">Доставка</label>
                    <USelect v-model="filters.delivery" :options="deliveryOptions" placeholder="Спосіб доставки"
                        class="w-full" />
                </div>

                <!-- Sort -->
                <div class="space-y-2">
                    <label class="text-sm text-gray-600">Сортування</label>
                    <USelect v-model="filters.sort" :options="sortOptions" class="w-full" />
                </div>
            </div>

            <!-- Reset Filters -->
            <div class="mt-4 flex justify-end">
                <UButton color="gray" variant="soft" @click="resetFilters">
                    Скинути фільтри
                </UButton>
            </div>
        </div>

        <!-- Loading State - Improved Loader -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center my-8 py-12">
            <UIcon name="i-heroicons-arrow-path-20-solid" class="w-12 h-12 animate-spin text-primary mb-4" />
            <p class="text-gray-600 mt-2">{{ isInitialLoad ? 'Завантаження лотів...' : 'Оновлення результатів...' }}</p>
        </div>

        <!-- Error State (other errors) -->
        <UAlert v-else-if="error && !error.includes('ключа категорії')" color="red" title="Помилка"
            icon="i-heroicons-exclamation-triangle" class="my-8">
            {{ error }}
        </UAlert>

        <!-- Lots Grid -->
        <div v-else-if="lots.length > 0"
            class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            <ReusedItemsProduct v-for="lot in lots" :key="lot._id" :id="lot._id"
                :image-src="`http://38.180.227.189:9000${lot.photos[0]?.url}`" :title="lot.title"
                :price="lot.startPrice" class="w-full" />
        </div>

        <!-- No Results -->
        <div v-else-if="!error" class="text-center py-8">
            <UIcon name="i-heroicons-inbox" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-500">Лоти не знайдені</p>
            <p class="text-gray-400 text-sm mt-2">Спробуйте змінити параметри фільтрації</p>
        </div>
    </div>
</template>
