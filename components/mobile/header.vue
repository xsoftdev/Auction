<script setup lang="ts">
import { ref, watch } from 'vue';
import { object, string, ref as yupRef, type InferType } from 'yup';
import type { FormSubmitEvent } from '#ui/types';

// Состояние меню
const menu = ref({
    links: false,
    search: false,
});

// Состояние модального окна
const modalType = ref<'auth' | 'reg' | ''>('');

// Методы управления меню
const toggleMenu = (menuType: 'links' | 'search') => {
    menu.value[menuType] = !menu.value[menuType];
};

// Методы управления модальным окном
const openModal = (type: 'auth' | 'reg') => {
    modalType.value = type;
};

const closeModal = () => {
    modalType.value = '';
};

// Наблюдатель для блокировки скролла
watch(
    () => ({ menu: menu.value, modal: modalType.value }),
    ({ menu, modal }) => {
        const isMenuOrModalOpen = menu.links || menu.search || modal;
        document.body.classList.toggle('overflow-hidden', isMenuOrModalOpen);
    },
    { deep: true }
);

// Схемы валидации
const schema = object({
    email: string()
        .email('Неправильне введення, example@example.com')
        .required("Обов'язкове поле"),
    password: string()
        .min(8, 'Має бути понад 8 символів')
        .required("Обов'язкове поле"),
});

const regSchema = object({
    name: string().required("Обов'язкове поле"),
    email: string()
        .email('Неправильне введення, example@example.com')
        .required("Обов'язкове поле"),
    password: string()
        .min(8, 'Має бути понад 8 символів')
        .required("Обов'язкове поле"),
    confirmPassword: string()
        .oneOf([yupRef('password')], 'Паролі мають співпадати')
        .required("Обов'язкове поле"),
});

// Типы данных для форм
type Schema = InferType<typeof schema>;
type RegSchema = InferType<typeof regSchema>;

// Обработка отправки формы
async function onSubmit(event: FormSubmitEvent<Schema | RegSchema>) {
    console.log('Данные формы:', event.data);
}
</script>

<template>
    <section id="mobile" class="pt-10 lg:hidden flex flex-row justify-between">
        <!-- Menu and Search Icons -->
        <div class="flex flex-row items-center gap-3">
            <template v-if="!menu.links">
                <img src="/icon/menu-variant.svg" alt="Menu" class="w-6 cursor-pointer" @click="toggleMenu('links')" />
            </template>
            <template v-else>
                <img src="/icon/mobile-cross.svg" alt="Menu" class="w-6 cursor-pointer" @click="toggleMenu('links')" />
            </template>
            <img src="/icon/search-mobile.svg" alt="Search" class="w-6 cursor-pointer" @click="toggleMenu('search')" />
        </div>

        <!-- Logo -->
        <NuxtLink to="/" class="logo max-w-32">
            <img src="/images/logo.png" alt="Logo" />
        </NuxtLink>

        <!-- User Icon -->
        <template v-if="!modalType">
            <img src="/icon/user.svg" alt="User" class="w-6 cursor-pointer" @click="openModal('auth')" />
        </template>
        <template v-else>
            <img src="/icon/mobile-cross.svg" alt="Menu" class="w-6 cursor-pointer" @click="closeModal()" />
        </template>

        <!-- Links Popup -->
        <div v-if="menu.links" class="fixed inset-0 w-full z-50 top-24 bg-[#F5F6F8] p-6">
            <!-- Список ссылок -->
            <ul>
                <li>
                    <div v-if="menu.links" class="fixed inset-0 w-full z-50 top-24 bg-[#F5F6F8] p-6">
                        <ul>
                            <li>
                                <NuxtLink to="/lots?key=new">
                                    <p class="text-xl mb-5"><span class="text-scarlet-400">Нові</span> лоти</p>
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink to="/news">
                                    <p class="text-xl mb-5">Статті та новини</p>
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink to="/lots?key=1grn">
                                    <p class="text-xl mb-5">Лоти від <span class="text-scarlet-400">1 грн</span></p>
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink to="https://www.facebook.com/share/g/14pKP8gTy6/">
                                    <p class="text-xl mb-5">Наш форум</p>
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink to="/lots?key=top">
                                    <p class="text-xl mb-5"><span class="text-scarlet-400">ТОП</span> Лоти</p>
                                </NuxtLink>
                            </li>
                            <hr class="mb-10">
                            <li class="mb-4 text-xl">
                                Контакти
                            </li>
                            <li class="mb-4">
                                <a href="mailto:Abaitsua@gmail.com" class="text-[#484848] text-lg">Email:
                                    Abaitsua@gmail.com</a>
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
                    </div>
                </li>
                <!-- Другие пункты меню -->
            </ul>
        </div>

        <!-- Search Popup -->
        <div v-if="menu.search" class="fixed inset-0 w-full z-50 top-24 bg-[#F5F6F8] py-4">
            <div class="text-center">
                <UInput type="text" placeholder="Пошук..." class="rounded w-full p-2" size="xl"
                    icon="i-heroicons-magnifying-glass-20-solid" />
            </div>
        </div>
    </section>

    <ReusedItemsAuthModal v-if="modalType">
        <div class="flex flex-row items-center justify-between mb-10 relative ">
            <div class="pb-3 text-[18px] font-medium w-[220px] text-center cursor-pointer"
                :class="modalType === 'auth' ? 'text-primary-400' : 'text-gray-400'" @click="openModal('auth')">
                Увійти
            </div>
            <div class="pb-3 text-[18px] font-medium w-[220px] text-center cursor-pointer"
                :class="modalType === 'reg' ? 'text-primary-400' : 'text-gray-400'" @click="openModal('reg')">
                Зареєструватись
            </div>
            <div class="absolute bottom-0 h-[2px] bg-primary-400 transition-all duration-300"
                :style="{ left: modalType === 'auth' ? '0' : '150px', width: '140px' }"></div>
        </div>

        <!-- Форма авторизации -->
        <div v-if="modalType === 'auth'">
            <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
                <UFormGroup label="Електронна адреса" name="email">
                    <UInput v-model="email" size="xl" />
                </UFormGroup>

                <UFormGroup label="Пароль" name="password">
                    <UInput v-model="password" type="password" size="xl" />
                    <p class="absolute right-0 top-[-24px] text-[14px] text-[#828282]">Забули пароль</p>
                </UFormGroup>

                <UButton type="submit" size="xl" class="w-full flex justify-center max-w-[400px] mx-auto">
                    <p class="text-[20px] mr-2">Увійти</p> <img src="/icon/menu-arrow.svg" alt="">
                </UButton>
            </UForm>
        </div>

        <!-- Форма регистрации -->
        <div v-if="modalType === 'reg'">
            <UForm :schema="regSchema" :state="state" class="space-y-4" @submit="onSubmit">
                <UFormGroup label="Ім’я" name="name">
                    <UInput v-model="name" size="xl" />
                </UFormGroup>

                <UFormGroup label="Електронна адреса" name="email">
                    <UInput v-model="email" size="xl" />
                </UFormGroup>

                <UFormGroup label="Пароль" name="password">
                    <UInput v-model="password" type="password" size="xl" />
                </UFormGroup>

                <UFormGroup label="Підтвердити пароль" name="confirmPassword">
                    <UInput v-model="confirmPassword" type="password" size="xl" />
                </UFormGroup>

                <UButton type="submit" size="xl" class="w-full flex justify-center max-w-[400px] mx-auto">
                    <p class="text-[20px] mr-2">Зареєструватися</p> <img src="/icon/menu-arrow.svg" alt="">
                </UButton>
            </UForm>
        </div>
    </ReusedItemsAuthModal>
</template>

<style scoped>
.cursor-pointer {
    cursor: pointer;
}
</style>
