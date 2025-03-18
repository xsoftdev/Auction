<script setup lang="ts">
import { useCategoryStore } from '~/storage/partitionState';
const partitionStore = useCategoryStore();
onMounted(() => {
    partitionStore.fetchCategories();
});
</script>
<template>
    <div>
        <UNotifications />
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>
<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

* {
    box-sizing: border-box;
    padding: 0;
    margin: 0;

    font-family: "Montserrat", serif;

}

body {
    background: #F5F6F8;
}
</style>
