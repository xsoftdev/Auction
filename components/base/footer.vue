<template>
    <footer id="footer" class="pt-12 mb-12 flex flex-col lg:flex-row items-start justify-between">
        <!-- Logo and Description -->
        <div class="company-details max-w-[390px] mb-8 lg:mb-0 lg:block hidden">
            <NuxtLink to="/" class="logo">
                <img src="/images/logo.png" alt="Logo"/>
            </NuxtLink>
            <div class="description text-[#9A9A9A] text-[14px] sm:text-[16px] lg:text-[18px] mt-5">
                Тут трішки інформації про вас. Тут трішки інформації про вас. Тут трішки інформації про вас. Тут трішки
                інформації про вас. Тут трішки інформації про вас.
            </div>
        </div>

        <!-- Information List -->
        <ul class="list mb-8 lg:mb-0">
            <li class="font-semibold text-[18px] sm:text-[20px] lg:text-[24px] mb-6">Інформація</li>
            <li class="mb-4">
                <NuxtLink to="/lots?key=new">Нові лоти</NuxtLink>
            </li>
            <li class="mb-4">
                <NuxtLink to="/news">Статті та новини</NuxtLink>
            </li>
            <li class="mb-4">
                <NuxtLink to="/lots?key=1grn">Лоти від 1 грн</NuxtLink>
            </li>
            <li class="mb-4">
                <NuxtLink to="https://www.facebook.com/share/g/14pKP8gTy6/">Наш форум</NuxtLink>
            </li>
            <li class="mb-4">
                <NuxtLink to="/lots?key=top">ТОП Лоти</NuxtLink>
            </li>
        </ul>

        <!-- Support List -->
        <ul class="list mb-8 lg:mb-0">
            <li class="font-semibold text-[18px] sm:text-[20px] lg:text-[24px] mb-6">Тех.підтримка</li>
            <li class="mb-4">
                <NuxtLink to="/support">Звернутись в підтримку</NuxtLink>
            </li>
            <li class="mb-4">
                <NuxtLink to="/privacy">Політика конфіденційності</NuxtLink>
            </li>
        </ul>

        <!-- Contacts List -->
        <ul class="list">
            <li class="font-semibold text-[18px] sm:text-[20px] lg:text-[24px] mb-6">Контакти</li>
            <li class="mb-4">
                <a href="mailto:Abaitsua@gmail.com">Abaitsua@gmail.com</a>
            </li>
            <li class="mb-4 flex space-x-4">
                <NuxtLink to="https://facebook.com">
                    <img src="/icon/fb.svg" alt="Facebook" class="w-6 h-6" />
                </NuxtLink>
                <NuxtLink to="https://instagram.com">
                    <img src="/icon/insta.svg" alt="Instagram" class="w-6 h-6" />
                </NuxtLink>
            </li>
        </ul>
    </footer>
</template>

<style>
/* Adjust spacing and margins for mobile */
@media (max-width: 640px) {
    #footer {
        padding: 16px;
        border-top: 1px solid #E0E2E6;
    }
    .list {
        margin-bottom: 16px;
    }
    .description {
        font-size: 14px;
    }
}
</style>
