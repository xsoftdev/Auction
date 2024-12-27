<template>
    <footer id="footer" class="pt-12 mb-12  flex flex-row items-start justify-between">
        <div class="company-details max-w-[390px]">
            <NuxtLink to="/" class="logo">
                <img src="/images/logo.png" />
            </NuxtLink>
            <div class="description text-[#9A9A9A] text-[18px] mt-5">
                Тут трішки інформації про васТут трішки інформації про васТут трішки інформації про васТут трішки
                інформації про васТут трішки інформації про васТут трішки інформації про васТут трішки інформації про
                вас
            </div>
        </div>
        <ul class="list">
            <li class="font-semibold text-[24px] mb-6">Інформація</li>
            <li class="mb-4">
                <NuxtLink to="/lots?key=new">
                    Нові лоти
                </NuxtLink>
            </li>
            <li class="mb-4">
                <NuxtLink to="/news">
                    Статті та новини
                </NuxtLink>
            </li>
            <li class="mb-4">
                <NuxtLink to="/lots?key=1grn">
                    Лоти від 1 грн
                </NuxtLink>
            </li>
            <li class="mb-4">
                <NuxtLink to="https://www.facebook.com/share/g/14pKP8gTy6/">
                    Наш форум
                </NuxtLink>
            </li>
            <li class="mb-4">
                <NuxtLink to="/lots?key=top">
                    ТОП Лоти
                </NuxtLink>
            </li>
        </ul>
        <ul class="list">
            <li class="font-semibold text-[24px] mb-6">Тех.підтримка</li>
            <li class="mb-4">
                <NuxtLink to="/lots?key=new">
                    Звернутись в підтримку
                </NuxtLink>
            </li>
            <li class="mb-4">
                <NuxtLink to="/news">
                    Політика конфіденційності
                </NuxtLink>
            </li>
        </ul>
        <ul class="list">
            <li class="font-semibold text-[24px] mb-6">Контакти</li>
            <li class="mb-4">
                <a href="email:Abaitsua@gmail.com">
                    Abaitsua@gmail.com
                </a>
            </li>
            <li class="mb-4">
                <NuxtLink to="/news">           
                    <img src="/icon/fb.svg" alt="">
                </NuxtLink>
            </li>
        </ul>
    </footer>
</template>