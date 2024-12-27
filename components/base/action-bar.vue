<script lang="ts">
import { ref } from 'vue';
import { object, string, ref as yupRef, type InferType } from 'yup';
import type { FormSubmitEvent } from '#ui/types';

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

type Schema = InferType<typeof schema>;
type RegSchema = InferType<typeof regSchema>;

const state = ref({
    menuCategories: false,
    modalType: '',
    email: undefined,
    password: undefined,
    name: undefined,
    confirmPassword: undefined,
});

async function onSubmit(event: FormSubmitEvent<Schema | RegSchema>) {
    console.log(event.data);
}

const toggleState = (key: keyof typeof state.value) => {
    state.value[key] = !state.value[key];
};

const openModal = (type: 'reg' | 'auth') => {
    state.value.modalType = type;
};

const closeModal = () => {
    state.value.modalType = '';
};

export default {
    setup() {
        return {
            state,
            toggleState,
            openModal,
            closeModal,
            schema,
            regSchema,
            onSubmit,
        };
    },
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
        <div class="search min-w-[430px]">
            <UInput icon="i-heroicons-magnifying-glass-20-solid" size="xl" color="white" :trailing="false"
                placeholder="Пошук" />
        </div>
        <UButton size="xl" class="text-[24px] font-[400]" @click="openModal('reg')">
            Зареєструватися
        </UButton>
        <UButton size="xl" variant="ghost" class="text-[24px] font-[400] text-gray-500" @click="openModal('auth')">
            Увійти
        </UButton>

        <div class="absolute top-32 w-full bg-[#F5F6F8] border-black" v-if="state.menuCategories">
            Отсутсвие базы данных.
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

            <!-- Форма авторизации -->
            <div v-if="state.modalType === 'auth'">
                <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
                    <UFormGroup label="Електронна адреса" name="email">
                        <UInput v-model="state.email" size="xl" />
                    </UFormGroup>

                    <UFormGroup label="Пароль" name="password">
                        <UInput v-model="state.password" type="password" size="xl" />
                        <p class="absolute right-0 top-[-24px] text-[14px] text-[#828282]">Забули пароль</p>
                    </UFormGroup>

                    <UButton type="submit" size="xl" class="w-full flex justify-center max-w-[400px] mx-auto">
                        <p class="text-[20px] mr-2">Увійти</p> <img src="/icon/menu-arrow.svg" alt="">
                    </UButton>
                </UForm>
            </div>

            <!-- Форма регистрации -->
            <div v-if="state.modalType === 'reg'">
                <UForm :schema="regSchema" :state="state" class="space-y-4" @submit="onSubmit">
                    <UFormGroup label="Ім’я" name="name">
                        <UInput v-model="state.name" size="xl" />
                    </UFormGroup>

                    <UFormGroup label="Електронна адреса" name="email">
                        <UInput v-model="state.email" size="xl" />
                    </UFormGroup>

                    <UFormGroup label="Пароль" name="password">
                        <UInput v-model="state.password" type="password" size="xl" />
                    </UFormGroup>

                    <UFormGroup label="Підтвердити пароль" name="confirmPassword">
                        <UInput v-model="state.confirmPassword" type="password" size="xl" />
                    </UFormGroup>

                    <UButton type="submit" size="xl" class="w-full flex justify-center max-w-[400px] mx-auto">
                        <p class="text-[20px] mr-2">Зареєструватися</p> <img src="/icon/menu-arrow.svg" alt="">
                    </UButton>
                </UForm>
            </div>
        </ReusedItemsAuthModal>
        <div class="overlay bg-[#00000080] fixed z-[20] w-full h-full left-0 top-0" v-if="state.modalType" @click="closeModal"/>
    </section>
</template>
