<template>
    <section id="hero" class="flex flex-col lg:flex-row items-center gap-4 lg:gap-12 mb-20">
        <!-- Sub Banners -->
        <div class="flex flex-col gap-4 lg:gap-8 hidden lg:flex">
            <img src="/images/sub-banner-1.jpg" alt="" class="max-w-[450px] max-h-[240px] object-cover">
            <img src="/images/sub-banner2.jpg" alt="" class="max-w-[450px] max-h-[240px] object-cover">
        </div>

        <!-- Main Banner -->
        <div class="w-full lg:w-auto">
            <img src="/images/main-banner.jpg" alt="" class="w-full lg:w-auto object-cover">
        </div>
    </section>
</template>

<style>
@media (max-width: 1024px) {
    #hero {
        flex-direction: column;
        gap: 16px;
    }
}

@media (max-width: 640px) {
    #hero .hidden {
        display: none;
    }
}
</style>
