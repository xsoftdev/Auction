<script setup lang="ts">
import { RouterLink } from 'vue-router';

</script>

<template>
    <section class="pt-10 mb-10">
        <nav class="flex items-center flex-row justify-between">
            <NuxtLink to="/lots?key=new" class="text-[24px]">
                <p><span class="text-[#FF3400]">Нові</span> лоти</p>
            </NuxtLink>
            <NuxtLink to="/news" class="text-[24px]">
                <p>Статті та новини</p>
            </NuxtLink>
            <NuxtLink to="/lots?key=1grn" class="text-[24px]">
                <p> Лоти від <span class="text-[#FF3400]">1 грн</span></p>
            </NuxtLink>
            <NuxtLink to="https://www.facebook.com/share/g/14pKP8gTy6/" class="text-[24px]">
                <p>Наш форум</p>
            </NuxtLink>
            <NuxtLink to="/lots?key=top" class="text-[24px]">
                <p> <span class="text-[#FF3400]">ТОП</span> Лоти</p>
            </NuxtLink>
            <NuxtLink to="" class="text-[24px]">
                <p>Контакти</p>
            </NuxtLink>
        </nav>
    </section>
</template>