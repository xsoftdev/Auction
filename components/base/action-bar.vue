<script setup lang="ts">
import { ref } from 'vue';
import { object, string, ref as yupRef, type InferType } from 'yup';
import type { FormSubmitEvent } from '#ui/types';
import { useUserStore } from '~/storage/userState';
import { useRoute } from 'vue-router';
const route = useRoute();
import axios from 'axios'

watch(
    () => route.path,
    (newPath, oldPath) => {
        console.log(`Путь изменился: ${oldPath} → ${newPath}`);
    }
);
const schema = object({
    email: string()
        .email('Неправильне введення, example@example.com')
        .required("Обов'язкове поле"),
    password: string()
        .min(8, 'Має бути понад 8 символів')
        .required("Обов'язкове поле"),
});

const regSchema = object({
    name: string()
        .required("Обов'язкове поле"),
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
const forgotSchema = object({
    email: string()
        .email('Неправильне введення, example@example.com')
        .required("Обов'язкове поле"),
});

const codeSchema = object({
    code: string()
        .length(6, 'Код має містити 6 цифр')
        .required("Обов'язкове поле"),
    newPassword: string()
        .min(8, 'Має бути понад 8 символів')
        .required("Обов'язкове поле"),
    confirmNewPassword: string()
        .oneOf([yupRef('newPassword')], 'Паролі мають співпадати')
        .required("Обов'язкове поле"),
});

type ForgotSchema = InferType<typeof forgotSchema>;
type CodeSchema = InferType<typeof codeSchema>;
type Schema = InferType<typeof schema>;
type RegSchema = InferType<typeof regSchema>;

const state = ref({
    menuCategories: false,
    modalType: '',
    email: undefined,
    password: undefined,
    name: undefined,
    confirmPassword: undefined,
    isAuthentificate: false,
    authentificated_user: undefined,
    code: undefined,
    newPassword: undefined,
    confirmNewPassword: undefined,
    notification: {
        show: false,
        message: '',
        type: 'error' // 'error', 'success', 'info'
    }
});

onMounted(async () => {
    if (typeof window !== 'undefined') {
        const local = localStorage.getItem('auth_token');
        if (local) {
            state.value.isAuthentificate = true;

            const userStore = useUserStore();
            await userStore.getUser();


            state.value.authentificated_user = userStore.user;
        }
    }
});

// Функция для отображения уведомлений
const showNotification = (message: string, type: 'error' | 'success' | 'info' = 'error') => {
    state.value.notification.show = true;
    state.value.notification.message = message;
    console.log(state.value.notification.message);
    state.value.notification.type = type;

    // Автоматически скрыть уведомление через 5 секунд
    setTimeout(() => {
        state.value.notification.show = false;
    }, 5000);
};
async function onSubmit(event: FormSubmitEvent<Schema | RegSchema>) {
    try {
        if (event.data.modalType === 'reg') {
            try {
                const response = await $fetch('http://38.180.227.189:9000/api/auth/register', {
                    method: 'POST',
                    body: {
                        username: state.value.name,
                        email: state.value.email,
                        password: state.value.confirmPassword,
                    },
                });

                // Проверка на success: false в ответе
                if (!response) {
                    showNotification(response.message);
                    return;
                } else {
                    state.value.modalType = 'auth';
                }

                // Успешный случай
                if (response) {
                } else {
                    showNotification('Виникла невідома помилка');
                }
            } catch (error: any) {
                // Обработка ошибок $fetch
                if (error.data && error.data.message) {
                    showNotification(error.data.message);
                } else {
                    showNotification('Виникла невідома помилка');
                }
            }
        } else if (event.data.modalType === 'auth') {
            try {
                const response = await axios.post('http://38.180.227.189:9000/api/auth/login', {
                    email: state.value.email,
                    password: state.value.password
                });

                // Проверка на success: false в ответе
                if (response && response.data.success === false) {
                    showNotification(response.message, 'error');
                    return;
                }

                // Успешный случай
                console.log(response.data.success);

                if (response?.data.success) {
                    localStorage.setItem('auth_token', response.data.data.token);
                    showNotification('Автентифікація успішна', 'success');
                    state.value.modalType = '';
                    location.href = '/clientarea';
                } else {
                    showNotification('Виникла невідома помилка');
                }
            } catch (error: any) {
                // Обработка ошибок $fetch
                if (error.data && error.data.message) {
                    showNotification(error.data.message);
                } else {
                    showNotification('Виникла невідома помилка');
                }
            }
        } else if (event.data.modalType === 'forgot') {
            try {
                const response = await $fetch('http://38.180.227.189:9000/api/authentificate/reset_req', {
                    method: 'POST',
                    body: {
                        email: state.value.email,
                    },
                });

                // Проверка на success: false в ответе
                if (response && response.success === false) {
                    showNotification(response.message);
                    return;
                }

                // Успешный случай
                if (response?.success) {
                    showNotification('Код відновлення надіслано на вашу електронну адресу', 'success');
                    state.value.modalType = 'code';
                } else {
                    showNotification('Виникла невідома помилка');
                }
            } catch (error: any) {
                // Обработка ошибок $fetch
                if (error.data && error.data.message) {
                    showNotification(error.data.message);
                } else {
                    showNotification('Виникла невідома помилка');
                }
            }
        }
        else if (event.data.modalType === 'code') {
            try {
                const response = await $fetch('http://38.180.227.189:9000/api/auth/register', {
                    method: 'POST',
                    body: {
                        email: state.value.email,
                        code: state.value.code,
                        newPassword: state.value.newPassword,
                    },
                });

                // Проверка на success: false в ответе
                if (response && response.success === false) {
                    showNotification(response.message);
                    return;
                }

                // Успешный случай
                if (response?.success && response.token) {
                    localStorage.setItem('auth_token', response.token);
                    showNotification('Пароль успішно змінено', 'success');
                    state.value.modalType = '';
                    location.href = '/clientarea';
                } else {
                    showNotification('Виникла невідома помилка');
                }
            } catch (error: any) {
                // Обработка ошибок $fetch
                if (error.data && error.data.message) {
                    showNotification(error.data.message);
                } else {
                    showNotification('Виникла невідома помилка');
                }
            }
        }
    } catch (error) {
        console.error('Error in onSubmit function:', error);
        showNotification('Виникла невідома помилка');
    }
}

const toggleState = (key: keyof typeof state.value) => {
    state.value[key] = !state.value[key];
};

const openModal = (type: 'reg' | 'auth' | 'forgot' | 'code') => {
    state.value.modalType = type;
    // Сбрасываем уведомления при открытии модального окна
    state.value.notification.show = false;
};

const closeModal = () => {
    state.value.modalType = '';
    // Сбрасываем уведомления при закрытии модального окна
    state.value.notification.show = false;
};

</script>


<template>
    <section id="action-bar" class="mb-5 flex flex-row justify-between items-center relative">
        <NuxtLink to="/" class="logo">
            <img src="/images/logo.png" />
        </NuxtLink>
        <div class="categories" @click="toggleState('menuCategories')">
            <UButton size="xl">
                <img src="/icon/catalog.svg" class="w-8">
                <p class="text-[24px] font-[400]">Всі категорії</p>
            </UButton>
        </div>
        <div class="search min-w-[480px]">
            <UInput icon="i-heroicons-magnifying-glass-20-solid" size="xl" color="white" :trailing="false"
                placeholder="Пошук" />
        </div>
        <template v-if="!state.isAuthentificate">
            <UButton size="xl" class="text-[24px] font-[400]" @click="openModal('reg')">
                Зареєструватися
            </UButton>
            <UButton size="xl" variant="ghost" class="text-[24px] font-[400] text-gray-500" @click="openModal('auth')">
                Увійти
            </UButton>
        </template>
        <template v-else>
            <div class="flex flex-row items-center">
                <NuxtLink to="/clientarea" class="flex flex-row items-end">
                    <img src="/icon/user.svg" alt="" class="w-8 h-8 mr-4">
                    <template v-if="state.name || state.authentificated_user?.username">
                        <p class="text-[20px] w-[120px]">{{ state.name || state.authentificated_user?.username }}</p>
                    </template>
                    <template v-else>
                        <USkeleton class="bg-gray-400 w-[120px] h-[30px]" />
                    </template>
                </NuxtLink>
            </div>
        </template>

        <div class="absolute top-32 w-full bg-[#F5F6F8] border-black z-20" v-if="state.menuCategories">
            <ReusedItemsCategoryMenu />
        </div>

        <ReusedItemsAuthModal v-if="state.modalType">
            <div class="flex flex-row items-center justify-between mb-10 relative">
                <div class="pb-3 text-[24px] font-medium w-[220px] text-center cursor-pointer"
                    :class="state.modalType === 'auth' ? 'text-primary-400' : 'text-gray-400'"
                    @click="openModal('auth')">
                    Увійти
                </div>
                <div class="pb-3 text-[24px] font-medium w-[220px] text-center cursor-pointer"
                    :class="state.modalType === 'reg' ? 'text-primary-400' : 'text-gray-400'" @click="openModal('reg')">
                    Зареєструватись
                </div>
                <div class="absolute bottom-0 h-[2px] bg-primary-400 transition-all duration-300"
                    :style="{ left: state.modalType === 'auth' ? '0' : '375px', width: '220px' }"></div>
            </div>

            <!-- Уведомления -->
            <UAlert v-if="state.notification.show" :title="state.notification.message"
                :icon="state.notification.type === 'success' ? 'i-heroicons-check-circle' : 'i-heroicons-exclamation-circle'"
                class="mb-4">
            </UAlert>

            <!-- Форма авторизации -->
            <div v-if="state.modalType === 'auth'">
                <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
                    <UFormGroup label="Електронна адреса" name="email">
                        <UInput v-model="state.email" size="xl" autocomplete="email" />
                    </UFormGroup>

                    <UFormGroup label="Пароль" name="password">
                        <UInput v-model="state.password" type="password" size="xl" autocomplete="current-password" />
                        <p class="absolute right-0 top-[-24px] text-[14px] text-[#828282] cursor-pointer"
                            @click="openModal('forgot')">
                            Забули пароль
                        </p>
                    </UFormGroup>

                    <UButton type="submit" size="xl" class="w-full flex justify-center max-w-[400px] mx-auto">
                        <p class="text-[20px] mr-2">Увійти</p> <img src="/icon/menu-arrow.svg" alt="">
                    </UButton>
                </UForm>
            </div>
            <div v-if="state.modalType === 'forgot' || state.modalType === 'code'" class="mb-10">
                <h2 class="text-[24px] font-medium text-center">
                    {{ state.modalType === 'forgot' ? 'Відновлення паролю' : 'Введіть код' }}
                </h2>
            </div>

            <!-- Форма восстановления пароля -->
            <div v-if="state.modalType === 'forgot'">
                <UForm :schema="forgotSchema" :state="state" class="space-y-4" @submit="onSubmit">
                    <UFormGroup label="Електронна адреса" name="email">
                        <UInput v-model="state.email" size="xl" autocomplete="email" />
                    </UFormGroup>

                    <p class="text-[14px] text-gray-500 text-center mb-4">
                        На вашу електронну адресу буде відправлено код підтвердження
                    </p>

                    <UButton type="submit" size="xl" class="w-full flex justify-center max-w-[400px] mx-auto">
                        <p class="text-[20px] mr-2">Відправити код</p>
                        <img src="/icon/menu-arrow.svg" alt="">
                    </UButton>
                </UForm>
            </div>

            <!-- Форма ввода кода и нового пароля -->
            <div v-if="state.modalType === 'code'">
                <UForm :schema="codeSchema" :state="state" class="space-y-4" @submit="onSubmit">
                    <UFormGroup label="Код підтвердження" name="code">
                        <UInput v-model="state.code" size="xl" autocomplete="one-time-code" />
                    </UFormGroup>

                    <UFormGroup label="Новий пароль" name="newPassword">
                        <UInput v-model="state.newPassword" type="password" size="xl" autocomplete="new-password" />
                    </UFormGroup>

                    <UFormGroup label="Підтвердіть новий пароль" name="confirmNewPassword">
                        <UInput v-model="state.confirmNewPassword" type="password" size="xl"
                            autocomplete="new-password" />
                    </UFormGroup>

                    <UButton type="submit" size="xl" class="w-full flex justify-center max-w-[400px] mx-auto">
                        <p class="text-[20px] mr-2">Змінити пароль</p>
                        <img src="/icon/menu-arrow.svg" alt="">
                    </UButton>
                </UForm>
            </div>
            <!-- Форма регистрации -->
            <div v-if="state.modalType === 'reg'">
                <UForm :schema="regSchema" :state="state" class="space-y-4" @submit="onSubmit">
                    <UFormGroup label="Ім'я" name="name">
                        <UInput v-model="state.name" size="xl" autocomplete="name" />
                    </UFormGroup>

                    <UFormGroup label="Електронна адреса" name="email">
                        <UInput v-model="state.email" size="xl" autocomplete="email" />
                    </UFormGroup>

                    <UFormGroup label="Пароль" name="password">
                        <UInput v-model="state.password" type="password" size="xl" autocomplete="new-password" />
                    </UFormGroup>

                    <UFormGroup label="Підтвердити пароль" name="confirmPassword">
                        <UInput v-model="state.confirmPassword" type="password" size="xl" autocomplete="new-password" />
                    </UFormGroup>

                    <UButton type="submit" size="xl" class="w-full flex justify-center max-w-[400px] mx-auto">
                        <p class="text-[20px] mr-2">Зареєструватися</p> <img src="/icon/menu-arrow.svg" alt="">
                    </UButton>
                </UForm>
            </div>
        </ReusedItemsAuthModal>
        <div class="overlay bg-[#00000080] fixed z-[20] w-full h-full left-0 top-0" v-if="state.modalType"
            @click="closeModal" />
    </section>
</template>
