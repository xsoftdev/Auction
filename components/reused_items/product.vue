<script setup lang="ts">
const props = defineProps({
    imageSrc: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: 'грн.',
    },
    truncateLength: {
        type: Number,
        default: 50,
    },
    id: {
        type: String,
        required: true
    }
});

const truncateText = (text: string, length: number) => {
    return text.length > length ? text.slice(0, length) + '...' : text;
};
</script>

<template>
    <NuxtLink :to="`/active-lots/${id}`">
        <div class="max-w-[240px] rounded-[16px] border border-[#EFF0F6] bg-[#FFFFFF] p-5">
            <img :src="imageSrc" alt="Lot Image" class="md:mb-8 mb-4">

            <p class="md:text-[20px] text-[14px] mb-5">
                {{ truncateText(title, truncateLength) }}
            </p>

            <p class="md:text-[24px] text-[20px]">
                <span class="text-primary-500">{{ price }}</span> {{ currency }}
            </p>
        </div>
    </NuxtLink>
</template>