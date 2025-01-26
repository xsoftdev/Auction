<template>
    <h2 class="md:mb-10 mb-4 text-[24px] font-medium">Товари, що вам сподобалися</h2>
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-4 md:mb-32 mb-4">
        <template v-for="idx in 5" :key="idx">
            <ReusedItemsProduct
                :image-src="'/images/exampleLots.png'"
                :title="'10000 Драм 10 лет Кассационному Суду Армения золото'"
                :price="32500"
                :truncate-length="48"
                :id="`${idx + 1}`"
            />
        </template>
    </div>
</template>

<style scoped>
.grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
}

@media (min-width: 640px) {
    .grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 768px) {
    .grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (min-width: 1024px) {
    .grid {
        grid-template-columns: repeat(4, 1fr);
    }
}

@media (min-width: 1280px) {
    .grid {
        grid-template-columns: repeat(5, 1fr);
    }
}
</style>
