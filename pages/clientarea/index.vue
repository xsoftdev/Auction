<script setup lang="ts">
import { useUserStore } from '~/storage/userState';
import { onBeforeMount, onMounted, ref } from 'vue';
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
    <div class="grid grid-cols-8 gap-4 justify-between mb-10">
        <!-- Sidebar with user info -->
        <aside class="col-span-2">
            <div class="user-info flex flex-row justify-between mb-5">
                <p class="text-[#23262F] text-[20px] font-semibold">
                    <!-- Показати ім'я користувача, якщо воно загружено -->
                    <span v-if="!loading">{{ userInit?.username }}</span>
                    <span v-else>Загрузка...</span>
                </p>
                <UBadge>05</UBadge>
            </div>
            <div class="user-id mb-5">
                <p class="text-[#777E90]">ID: #0000{{ userInit?.id }}</p>
            </div>
            <div class="tab-list flex flex-col justify-start items-start">
                <button @click="switchPage('info')" class="bg-[#D9D9D9] py-3 px-6 rounded-lg w-full text-left mb-5 text-[20px] duration-300 font-medium">Профіль користувача</button>

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
                        <button @click="switchPage('sales')" class="hover:bg-[#D9D9D9] py-3 px-6 rounded-lg w-full text-left mb-5 text-[20px] duration-300 font-medium">Продаж</button>
                        <button @click="switchPage('purchase')" class="hover:bg-[#D9D9D9] py-3 px-6 rounded-lg w-full text-left mb-5 text-[20px] duration-300 font-medium">Покупка</button>
                        <button @click="switchPage('reviews')" class="hover:bg-[#D9D9D9] py-3 px-6 rounded-lg w-full text-left mb-5 text-[20px] duration-300 font-medium">Відгуки</button>
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
                        <button @click="switchPage('history')" class="hover:bg-[#D9D9D9] py-3 px-6 rounded-lg w-full text-left mb-5 text-[20px] duration-300 font-medium">Історія платежів</button>
                        <button @click="switchPage('replenishment')" class="hover:bg-[#D9D9D9] py-3 px-6 rounded-lg w-full text-left mb-5 text-[20px] duration-300 font-medium">Поповнення рахунку</button>
                    </div>
                </transition>
                <button @click="switchPage('notification')" class="hover:bg-[#D9D9D9] py-3 px-6 rounded-lg w-full text-left mb-5 text-[20px] duration-300 font-medium">Повідомлення</button>

                <button class="py-3 px-6 hover:bg-[#D9D9D9] w-full text-left mb-5 rounded-lg text-[20px] duration-300 font-medium">Тех. <span class="text-[#FF3400]">Підтримка</span></button>
                <button class="mb-5 bg-[#333333] hover:bg-[#333333] hover:opacity-90 duration-300 text-white py-3 px-6 rounded-lg flex flex-row items-end w-full justify-between">
                    <p class="text-[20px] font-medium">Створити Лот</p>
                    <img src="/icon/Plus.svg" alt="">
                </button>
                <button @click="logout" class="text-[#FF3400] text-[20px] font-medium px-6 py-3 duration-300 hover:border-[#FF3400] border-[1px] w-full text-left rounded-lg">Вийти</button>
            </div>
        </aside>
        <div class="col-span-1" />
        <!-- Main content section -->
        <section class="col-span-5">
            <!-- Render content based on the current page -->
            <ProfileInfo v-if="currentPage === 'info'" />
            <ProfileReviews v-if="currentPage === 'reviews'" />
            <ProfileHistory v-if="currentPage === 'history'" />
            <ProfileReplenishment v-if="currentPage === 'replenishment'" />
            <ProfilePurchase v-if="currentPage === 'purchase'" />
            <ProfileSales v-if="currentPage === 'sales'" />
            <ProfileNotifications v-if="currentPage === 'notification'" />
            <!-- You can add more pages here as needed -->
        </section>
    </div>
</template>

<style scoped>
.accordion-enter-active,
.accordion-leave-active {
    transition: max-height 0.3s ease-in-out;
    overflow: hidden;
}

.accordion-enter,
.accordion-leave-to /* .accordion-leave-active in <2.1.8 */ {
    max-height: 0;
}
</style>
