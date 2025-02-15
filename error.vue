<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
    error: Object as () => NuxtError
})

const handleError = () => clearError({ redirect: '/' })

const goBack = () => {
    window.history.back();
}

const goToHome = () => {
    window.location.href = '/';
}
</script>

<template>
    <BaseContainer>
        <div class="mb-24 flex flex-col items-center text-center px-4 sm:px-0">
            <!-- Error Image -->
            <img src="/images/error.png" class="max-w-full sm:max-w-[500px] mx-auto mb-6" />

            <!-- Error Title -->
            <h2 class="font-semibold text-black text-[24px] sm:text-[36px] mb-4">
                {{ error?.statusCode === 404
                    ? '404, Сторінку не знайдено'
                    : error?.statusCode === 403
                        ? '403, Доступ заборонено'
                        : error?.statusCode === 401
                            ? '401, Необхідна авторизація'
                            : error?.statusCode
                                ? `Помилка ${error.statusCode}`
                                : 'Внутрішня помилка сервера'
                }}
            </h2>

            <!-- Error Description -->
            <p class="text-[16px] sm:text-[18px] text-gray-500 max-w-[540px] mx-auto mb-6">
                Щось пішло не так. Схоже, що ваш запит не може бути знайдений. Спробуйте ще раз або поверніться пізніше.
                {{ error?.message }}
            </p>

            <!-- Buttons -->
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                <UButton size="xl" @click="goBack" class="w-full sm:w-auto">
                    <img src="/icon/menu-arrow.svg" class="rotate-[180deg]" />
                    <p>Повернутися</p>
                </UButton>
                <UButton variant="outline" size="xl" @click="goToHome" class="w-full sm:w-auto">
                    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M15.4375 21.125V16.25C15.4375 16.0345 15.3519 15.8279 15.1995 15.6755C15.0472 15.5231 14.8405 15.4375 14.625 15.4375H11.375C11.1595 15.4375 10.9528 15.5231 10.8005 15.6755C10.6481 15.8279 10.5625 16.0345 10.5625 16.25V21.125C10.5625 21.3405 10.4769 21.5472 10.3245 21.6995C10.1722 21.8519 9.96549 21.9375 9.75 21.9375H4.875C4.65951 21.9375 4.45285 21.8519 4.30048 21.6995C4.1481 21.5472 4.0625 21.3405 4.0625 21.125V11.7305C4.06432 11.618 4.08862 11.5071 4.13397 11.4042C4.17932 11.3013 4.2448 11.2085 4.32656 11.1313L12.4516 3.74766C12.6013 3.61063 12.797 3.53464 13 3.53464C13.203 3.53464 13.3987 3.61063 13.5484 3.74766L21.6734 11.1313C21.7552 11.2085 21.8207 11.3013 21.866 11.4042C21.9114 11.5071 21.9357 11.618 21.9375 11.7305V21.125C21.9375 21.3405 21.8519 21.5472 21.6995 21.6995C21.5472 21.8519 21.3405 21.9375 21.125 21.9375H16.25C16.0345 21.9375 15.8278 21.8519 15.6755 21.6995C15.5231 21.5472 15.4375 21.3405 15.4375 21.125Z"
                            stroke="#FF3400BF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <p>На головну сторінку</p>
                </UButton>
            </div>
        </div>
    </BaseContainer>
</template>