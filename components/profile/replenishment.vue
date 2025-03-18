<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/storage/userState';

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const copyToClipboard = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text);
        showCopiedMessage.value = true;
        setTimeout(() => {
            showCopiedMessage.value = false;
        }, 2000);
    } catch (err) {
        console.error('Не удалось скопировать текст:', err);
    }
};

const showCopiedMessage = ref(false);

const cards = ref([
    { bank: 'Monobank', number: '4441 1110 3081 5447' },
    { bank: 'ПриватБанк', number: '5457 0822 5340 4094' }
]);
</script>

<template>
    <div class="space-y-4 md:space-y-5">
        <p class="text-[#23262F] font-[600] text-[28px] md:text-[36px] mb-6 md:mb-12">Поповнення рахунку</p>

        <div class="flex flex-col space-y-2">
            <span class="text-[18px] md:text-[20px] text-[#23262F] font-[600]">Ваш баланс</span>
            <p class="text-[#FF3400] text-[18px] md:text-[20px] font-[600]">
                {{ user.balance.amount.toFixed(2) }} {{ user.balance.currency }}
            </p>
        </div>

        <p class="text-[16px] md:text-[20px]">
            Ви можете поповнити баланс свого акаунту, здійснивши переказ на одну з наступних карт:
        </p>

        <div v-for="card in cards" :key="card.bank" class="bg-gray-100 p-3 md:p-4 rounded-lg">
            <p class="text-[16px] md:text-[18px] text-[#FF3400] font-[600]">{{ card.bank }}:</p>
            <div class="flex flex-row items-center justify-between">
                <p class="text-[16px] md:text-[18px] font-mono">{{ card.number }}</p>
                <UTooltip text="Копіювати в буфер обміну">
                    <button @click="copyToClipboard(card.number)" class="p-2 hover:bg-gray-200 rounded-full transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="lucide lucide-files cursor-pointer">
                            <path d="M20 7h-3a2 2 0 0 1-2-2V2" />
                            <path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z" />
                            <path d="M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8" />
                        </svg>
                    </button>
                </UTooltip>
            </div>
        </div>

        <div v-if="showCopiedMessage"
            class="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">
            Номер карти скопійовано
        </div>

        <p class="text-[14px] md:text-[18px] mt-4">
            <span class="font-semibold">Важливо!</span> Під час переказу вкажіть у призначенні платежу ваш ID акаунту
            (ID: #0000{{ user.id }}), щоб кошти були зараховані автоматично.
            Поповнення балансу може займати до 24 годин.
        </p>
    </div>
</template>
