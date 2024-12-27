<template>
  <BaseHero />
  <ReusedItemsSlider :title="'Топ лоти'" :link="'/lots?key=top'" />
  <ReusedItemsSlider :title="'Нові'" :link="'/lots?key=new'" />
  <ReusedItemsSlider :title="'Популярні Лоти'" :link="'/lots?key=popular'" />
  <ReusedItemsSlider :title="'Від 1 грн'" :link="'/lots?key=1grn'" />
</template> 