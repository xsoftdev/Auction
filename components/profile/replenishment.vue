<script setup lang="ts">
import { ref } from 'vue';

const copyToClipboard = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text);
    } catch (err) {
    }
};

const cards = ref([
    { bank: 'Monobank', number: '4441 1110 3081 5447' },
    { bank: 'ПриватБанк', number: '5457 0822 5340 4094' }
]);
</script>

<template>
    <div class="space-y-5">
        <p class="text-[#23262F] font-[600] text-[36px] mb-12">Поповнення рахунку</p>

        <span class="text-[20px] text-[#23262F] font-[600]">Ваш баланс</span>
        <p class="text-[#FF3400] text-[20px] font-[600]">0.00 грн</p>
        <p class="text-[20px]">
            Ви можете поповнити баланс свого акаунту, здійснивши переказ на одну з наступних карт:
        </p>

        <div v-for="card in cards" :key="card.bank" class="bg-gray-100 p-4 rounded-lg">
            <p class="text-[18px] text-[#FF3400] font-[600]">{{ card.bank }}:</p>
            <div class="flex flex-row items-center">
                <p class="text-[18px] font-mono mr-5">{{ card.number }}</p>
                <UTooltip text="Копіювати в буфер обміну">
                    <button @click="copyToClipboard(card.number)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="lucide lucide-files cursor-pointer hover:text-gray-600 transition">
                            <path d="M20 7h-3a2 2 0 0 1-2-2V2" />
                            <path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z" />
                            <path d="M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8" />
                        </svg>
                    </button>
                </UTooltip>
            </div>
        </div>

        <p class="text-[18px]">
            Важливо! Під час переказу вкажіть у призначенні платежу ваш ID акаунту, щоб кошти були зараховані
            автоматично.
            Поповнення балансу може займати до 24 годин.
        </p>
    </div>
</template>
