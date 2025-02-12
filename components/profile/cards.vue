<template>
    <div class="grid lg:grid-cols-2 grid-cols-1 gap-4">
        <div v-for="(card, index) in cards" :key="index"
            class="flex items-start gap-4 p-6 bg-white rounded-lg shadow-sm col-span-1 border-[#E5E5E5] border-[1px] rounded-[8px]">
            <div class="flex-shrink-0">
                <img src="/icon/medal.svg" alt="Medal icon" class="lg:w-[72px] w-[40px]" />
            </div>

            <div class="flex-grow">
                <h3 class="lg:text-[20px] text-[16px] font-medium text-gray-900 mb-2">
                    {{ card.title }}
                </h3>
                <p class="lg:text-[20px] text-[16px] text-black_haze-500 mb-4">
                    {{ card.description }}
                </p>

                <div class="flex items-center gap-3">
                    <p class="text-[18px]">
                        <span class="text-scarlet-600">{{ card.price }}</span> грн
                    </p>
                    <button class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        @click="handleSelect(card)">
                        {{ card.buttonText }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PlacementCards',
    data() {
        return {
            cards: [
                {
                    title: "Розмістити в перших місцях Вашої категорії",
                    description: "Ваш лот буде відображатись першим в результатах пошуку та при перегляді категорій",
                    price: "16",
                    buttonText: "Вибрати",
                },
                {
                    title: "Розмістити на головній сторінці",
                    description: "Ваш лот буде відображатись першим в результатах пошуку та при перегляді категорій",
                    price: "59",
                    buttonText: "Вибрати",
                },
                {
                    title: "Розмістити в перших місцях Вашої категорії",
                    description: "Ваш лот буде відображатись першим в результатах пошуку та при перегляді категорій",
                    price: "16",
                    buttonText: "Вибрати",
                },
                {
                    title: "Розмістити на головній сторінці",
                    description: "Ваш лот буде відображатись першим в результатах пошуку та при перегляді категорій",
                    price: "59",
                    buttonText: "Вибрати",
                },
            ]
        }
    },
    methods: {
        handleSelect(card) {
            this.$emit('select', card)
        },
        handlePreview(card) {
            this.$emit('preview', card)
        }
    }
}
</script>