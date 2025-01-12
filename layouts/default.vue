<template>
    <BaseContainer>
        <BaseHeader />
        <slot />
        <BaseFooter />
    </BaseContainer>
    <div class="controls fixed bottom-0 bg-white h-20 w-full rounded-t-3xl z-50 md:hidden">
        <div class="flex flex-row items-center justify-between p-5">
            <div class="flex flex-col items-center">
                <img src="/icon/Home.svg" alt="" class="w-6">
                <p>Головна</p>
            </div>
            <div class="flex flex-col items-center">
                <img src="/icon/Category.svg" alt="" class="w-6">
                <p>Категорії</p>
            </div>
            <div class="flex flex-col items-center">
                <img src="/icon/plus-add.svg" alt="" class="w-8">
                <p>Продати</p>
            </div>
            <div class="flex flex-col items-center">
                <img src="/icon/Heart.svg" alt="" class="w-6">
                <p>Обрані</p>
            </div>
            <div class="flex flex-col items-center">
                <img src="/icon/Profile.svg" alt="" class="w-6">
                <p>Профіль</p>
            </div>
        </div>
        
    </div>
</template>