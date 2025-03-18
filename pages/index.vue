<template>
    <BaseHero />
    <ReusedItemsSlider :title="'Топ лоти'" :link="'/lots/ending-soon'" />
    <ReusedItemsSlider :title="'Нові'" :link="'/lots/new'" />
    <ReusedItemsSlider :title="'Популярні Лоти'" :link="'/lots/popular'" />
    <ReusedItemsSlider :title="'Від 1 грн'" :link="'/lots/from-1-uah'" />
</template>
