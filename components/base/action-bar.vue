<script setup lang="ts">
import { ref } from 'vue';
import { object, string, ref as yupRef, type InferType } from 'yup';
import type { FormSubmitEvent } from '#ui/types';
import { useUserStore } from '~/storage/userState';
import { useRoute } from 'vue-router';
const route = useRoute();
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
    authentificated_user: undefined
});

onMounted(async () => {
    if (typeof window !== 'undefined') {
        const local = localStorage.getItem('auth_token');
        if (local) {
            state.value.isAuthentificate = true;

            const userState = useUserStore();
            await userState.getUser();


            state.value.authentificated_user = userState.user;
        }
    }
});



async function onSubmit(event: FormSubmitEvent<Schema | RegSchema>) {
    try {
        if (event.data.modalType === 'reg') {
            const response = await useFetch('/api/authentificate/create', {
                method: 'POST',
                body: {
                    username: state.value.name,
                    email: state.value.email,
                    password: state.value.confirmPassword,
                },
            });

            if (response.status === 500) {
                console.error('Error during user creation:', response.error);
            } else {
                if (response.data.value.token) {
                    localStorage.setItem('auth_token', response.data.value.token);
                    console.log('Token stored in localStorage');
                    state.value.modalType = '';
                    location.href = '/clientarea'
                } else {
                    console.error('No token received');
                }
            }
        } else if (event.data.modalType === 'auth') {
            const response = await useFetch('/api/authentificate/login', {
                method: 'POST',
                body: {
                    email: state.value.email,
                    password: state.value.password,
                },
            });

            if (response.status === 500) {
                console.error('Error during user authentication:', response.error);
            } else {
                if (response.data.value.token) {
                    localStorage.setItem('auth_token', response.data.value.token);
                    console.log('Token stored in localStorage');
                    state.value.modalType = '';
                    location.href = '/clientarea';
                } else {
                    console.error('No token received');
                }
            }
        }
    } catch (error) {
        console.error('Error in onSubmit function:', error);
    }
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
                <NuxtLink to="/clientarea" class="flex flex-row items-end mr-16">
                    <img src="/icon/user.svg" alt="" class="w-8 h-8 mr-4">
                    <template v-if="state.name || state.authentificated_user?.username">
                        <p class="text-[20px] w-[120px]">{{ state.name || state.authentificated_user?.username }}</p>
                    </template>
                    <template v-else>
                        <USkeleton class="bg-gray-400 w-[120px] h-[30px]" />
                    </template>
                </NuxtLink>
                <NuxtLink to="/clientarea/cart">
                    <img src="/icon/cart1.svg" alt="" class="w-8 h-8">
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
        <div class="overlay bg-[#00000080] fixed z-[20] w-full h-full left-0 top-0" v-if="state.modalType"
            @click="closeModal" />
    </section>
</template>
