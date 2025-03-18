<script setup lang="ts">
import { useUserStore } from '~/storage/userState';
import { onBeforeMount, onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const userState = useUserStore();
const userInit = ref(null);
const loading = ref(true);
const authToken = ref<string | null>(null);

onBeforeMount(() => {
    authToken.value = localStorage.getItem('auth_token');
    if (!authToken.value) {
        router.replace('/');
    }
});

onMounted(async () => {
    if (authToken.value) {
        await userState.getUser();
        userInit.value = userState.user;
    }
    loading.value = false;
});

const isLotiOpen = ref(false);
const isWalletOpen = ref(false);
const toggleLoti = () => isLotiOpen.value = !isLotiOpen.value;
const toggleWallet = () => isWalletOpen.value = !isWalletOpen.value;

const currentPage = ref('info');
const switchPage = (page: string) => {
    currentPage.value = page;
    isLotiOpen.value = false;
    isWalletOpen.value = false;
};

// Кастомная мобильная навигация
const mobileActiveTab = ref('profile');

const mobileNavItems = [
    {
        key: 'profile',
        label: 'Профіль',
        icon: 'i-heroicons-user',
        click: () => switchPage('info')
    },
    {
        key: 'lots',
        label: 'Лоти',
        icon: 'i-heroicons-shopping-bag',
        click: () => toggleMobileLots()
    },
    {
        key: 'wallet',
        label: 'Гаманець',
        icon: 'i-heroicons-wallet',
        click: () => toggleMobileWallet()
    },
    {
        key: 'messages',
        label: 'Повідомлення',
        icon: 'i-heroicons-envelope',
        click: () => switchPage('notification')
    },
    {
        key: 'support',
        label: 'Тех. підтримка',
        icon: 'i-heroicons-wrench-screwdriver',
        click: () => window.location.href = 'https://t.me/auctionbaitsUA'
    },
    {
        key: 'lot-create',
        label: 'Створити Лот',
        icon: 'i-heroicons-plus-circle',
        click: () => router.push('/clientarea/create_lot')
    }
];

// Подменю для мобильной версии
const showMobileLots = ref(false);
const showMobileWallet = ref(false);

const toggleMobileLots = () => {
    showMobileLots.value = !showMobileLots.value;
    showMobileWallet.value = false;
    mobileActiveTab.value = 'lots';
};

const toggleMobileWallet = () => {
    showMobileWallet.value = !showMobileWallet.value;
    showMobileLots.value = false;
    mobileActiveTab.value = 'wallet';
};

const setActiveTab = (key: string) => {
    mobileActiveTab.value = key;
};

const logout = () => {
    localStorage.removeItem('auth_token');
    location.reload();
};

definePageMeta({
    layout: 'default'
})
</script>


<template>
    <!-- Desktop version -->
    <div class="hidden md:grid grid-cols-8 gap-4 justify-between mb-10">
        <!-- Sidebar with user info -->
        <aside class="col-span-2">
            <div class="user-info flex flex-row justify-between mb-5">
                <p class="text-[#23262F] text-[20px] font-semibold">
                    <span v-if="!loading">{{ userInit?.username }}</span>
                    <span v-else>Загрузка...</span>
                </p>
            </div>
            <div class="user-id mb-5">
                <p class="text-[#777E90]">ID: #0000{{ userInit?.id ? userInit.id.slice(-2) : '' }}</p>
            </div>
            <div class="tab-list flex flex-col justify-start items-start">
                <button @click="switchPage('info')"
                    class="bg-[#D9D9D9] py-3 px-6 rounded-lg w-full text-left mb-5 text-[20px] duration-300 font-medium">
                    Профіль користувача
                </button>

                <!-- Лоти Accordion -->
                <div class="accordion-header w-full">
                    <button @click="toggleLoti"
                        class="hover:bg-[#D9D9D9] py-3 px-6 rounded-lg w-full text-left mb-5 text-[20px] duration-300 font-medium flex flex-row justify-between items-center">
                        <p>Лоти</p>
                        <template v-if="!isLotiOpen">
                            <img src="/icon/chevron-left.svg" class="rotate-[180deg]">
                        </template>
                        <template v-else>
                            <img src="/icon/chevron-left.svg" class="rotate-[270deg]">
                        </template>
                    </button>
                </div>
                <transition name="accordion">
                    <div v-show="isLotiOpen" class="accordion-content">
                        <button @click="switchPage('sales')"
                            class="hover:bg-[#D9D9D9] py-3 px-6 rounded-lg w-full text-left mb-5 text-[20px] duration-300 font-medium">Продаж</button>
                        <button @click="switchPage('purchase')"
                            class="hover:bg-[#D9D9D9] py-3 px-6 rounded-lg w-full text-left mb-5 text-[20px] duration-300 font-medium">Покупка</button>
                        <button @click="switchPage('reviews')"
                            class="hover:bg-[#D9D9D9] py-3 px-6 rounded-lg w-full text-left mb-5 text-[20px] duration-300 font-medium">Відгуки</button>
                    </div>
                </transition>

                <!-- Гаманець Accordion -->
                <div class="accordion-header w-full">
                    <button @click="toggleWallet"
                        class="hover:bg-[#D9D9D9] py-3 px-6 rounded-lg w-full text-left mb-5 text-[20px] duration-300 font-medium flex flex-row justify-between items-center">
                        <p>Гаманець</p>
                        <template v-if="!isWalletOpen">
                            <img src="/icon/chevron-left.svg" class="rotate-[180deg]">
                        </template>
                        <template v-else>
                            <img src="/icon/chevron-left.svg" class="rotate-[270deg]">
                        </template>
                    </button>
                </div>
                <transition name="accordion">
                    <div v-show="isWalletOpen" class="accordion-content">
                        <button @click="switchPage('history')"
                            class="hover:bg-[#D9D9D9] py-3 px-6 rounded-lg w-full text-left mb-5 text-[20px] duration-300 font-medium">
                            Історія платежів
                        </button>
                        <button @click="switchPage('replenishment')"
                            class="hover:bg-[#D9D9D9] py-3 px-6 rounded-lg w-full text-left mb-5 text-[20px] duration-300 font-medium">
                            Поповнення рахунку
                        </button>
                    </div>
                </transition>
                <button @click="switchPage('notification')"
                    class="hover:bg-[#D9D9D9] py-3 px-6 rounded-lg w-full text-left mb-5 text-[20px] duration-300 font-medium">
                    Повідомлення
                </button>

                <button
                    class="py-3 px-6 hover:bg-[#D9D9D9] w-full text-left mb-5 rounded-lg text-[20px] duration-300 font-medium">
                    Тех. <span class="text-[#FF3400]">Підтримка</span>
                </button>
                <NuxtLink to="/clientarea/create_lot"
                    class="mb-5 bg-[#333333] hover:bg-[#333333] hover:opacity-90 duration-300 text-white py-3 px-6 rounded-lg flex flex-row items-end w-full justify-between">
                    <p class="text-[20px] font-medium">Створити Лот</p>
                    <img src="/icon/Plus.svg" alt="">
                </NuxtLink>
                <button @click="logout"
                    class="text-[#FF3400] text-[20px] font-medium px-6 py-3 duration-300 hover:border-[#FF3400] border-[1px] w-full text-left rounded-lg">
                    Вийти
                </button>
            </div>
        </aside>
        <div class="col-span-1" />
        <section class="col-span-5">
            <ProfileInfo v-if="currentPage === 'info'" />
            <ProfileReviews v-if="currentPage === 'reviews'" />
            <ProfileHistory v-if="currentPage === 'history'" />
            <ProfileReplenishment v-if="currentPage === 'replenishment'" />
            <ProfilePurchase v-if="currentPage === 'purchase'" />
            <ProfileSales v-if="currentPage === 'sales'" />
            <ProfileNotifications v-if="currentPage === 'notification'" />
        </section>
    </div>

    <!-- Мобильная версия с кастомной скроллируемой навигацией -->
    <div class="md:hidden">
        <div class="px-4 pt-6 pb-2">
            <!-- Информация о пользователе -->
            <div class="flex items-center justify-between mb-6">
                <div>
                    <p class="text-lg font-semibold">
                        <span v-if="!loading">{{ userInit?.username }}</span>
                        <span v-else>Загрузка...</span>
                    </p>
                    <p class="text-sm text-gray-500">ID: #0000{{ userInit?.id ? userInit.id.slice(-2) : '' }}</p>
                </div>
                <button @click="logout"
                    class="text-[#FF3400] text-sm font-medium px-4 py-2 border border-[#FF3400] rounded-lg">
                    Вийти
                </button>
            </div>
        </div>

        <!-- Кастомная горизонтальная навигация с возможностью скролла -->
        <div class="sticky top-0 z-10 bg-white shadow-sm">
            <div class="overflow-x-auto scrollbar-hide">
                <div class="flex border-b min-w-max">
                    <div v-for="item in mobileNavItems" :key="item.key" @click="item.click"
                        class="flex flex-col items-center justify-center px-4 py-3 font-medium transition-colors cursor-pointer whitespace-nowrap"
                        :class="mobileActiveTab === item.key ? 'text-[#333333] border-b-2 border-[#333333] -mb-px' : 'text-gray-500 hover:text-gray-900'">
                        <div :class="[item.icon, 'w-5 h-5 mb-1']"></div>
                        <span>{{ item.label }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Раскрывающиеся подменю для мобильной версии -->
        <div v-if="showMobileLots" class="bg-gray-50 mb-4">
            <div class="flex px-1 overflow-x-auto py-2 shadow-inner scrollbar-hide">
                <button @click="switchPage('sales')"
                    class="px-4 py-2 text-center whitespace-nowrap text-sm rounded-md mx-1"
                    :class="{ 'bg-white shadow text-[#333333]': currentPage === 'sales', 'text-gray-600': currentPage !== 'sales' }">
                    Продаж
                </button>
                <button @click="switchPage('purchase')"
                    class="px-4 py-2 text-center whitespace-nowrap text-sm rounded-md mx-1"
                    :class="{ 'bg-white shadow text-[#333333]': currentPage === 'purchase', 'text-gray-600': currentPage !== 'purchase' }">
                    Покупка
                </button>
                <button @click="switchPage('reviews')"
                    class="px-4 py-2 text-center whitespace-nowrap text-sm rounded-md mx-1"
                    :class="{ 'bg-white shadow text-[#333333]': currentPage === 'reviews', 'text-gray-600': currentPage !== 'reviews' }">
                    Відгуки
                </button>
            </div>
        </div>

        <div v-if="showMobileWallet" class="bg-gray-50 mb-4">
            <div class="flex px-1 overflow-x-auto py-2 shadow-inner scrollbar-hide">
                <button @click="switchPage('history')"
                    class="px-4 py-2 text-center whitespace-nowrap text-sm rounded-md mx-1"
                    :class="{ 'bg-white shadow text-[#333333]': currentPage === 'history', 'text-gray-600': currentPage !== 'history' }">
                    Історія платежів
                </button>
                <button @click="switchPage('replenishment')"
                    class="px-4 py-2 text-center whitespace-nowrap text-sm rounded-md mx-1"
                    :class="{ 'bg-white shadow text-[#333333]': currentPage === 'replenishment', 'text-gray-600': currentPage !== 'replenishment' }">
                    Поповнення рахунку
                </button>
            </div>
        </div>

        <!-- Контент -->
        <div class="px-4 pb-20">
            <ProfileInfo v-if="currentPage === 'info'" />
            <ProfileReviews v-if="currentPage === 'reviews'" />
            <ProfileHistory v-if="currentPage === 'history'" />
            <ProfileReplenishment v-if="currentPage === 'replenishment'" />
            <ProfilePurchase v-if="currentPage === 'purchase'" />
            <ProfileSales v-if="currentPage === 'sales'" />
            <ProfileNotifications v-if="currentPage === 'notification'" />
        </div>
    </div>
</template>

<style scoped>
.accordion-enter-active,
.accordion-leave-active {
    transition: max-height 0.3s ease-in-out;
    overflow: hidden;
}

.accordion-enter,
.accordion-leave-to {
    max-height: 0;
}

/* Скрыть полосу прокрутки, но оставить функциональность */
.scrollbar-hide {
    -ms-overflow-style: none;
    /* IE и Edge */
    scrollbar-width: none;
    /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari и Opera */
}
</style>
