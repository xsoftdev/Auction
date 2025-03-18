<script setup lang="ts">
import { useUserStore } from '~/storage/userState';
import { ref, onMounted } from 'vue';
import { format } from 'date-fns';

const userStore = useUserStore();
const date = ref(new Date());
const loading = ref(true);
const updateStatus = ref(''); // Для отображения статуса обновления

// Define reactive state to store user data
const state = ref({
    username: '',
    email: '',
    id: '',
    phone: '',
    location: '',
    birthday: ''
});

onMounted(async () => {
    try {
        await userStore.getUser();
        const userInit = userStore.user;

        // Update state after user data is loaded
        state.value = {
            username: userInit.username,
            email: userInit.email,
            id: userInit.id,
            phone: userInit.phone || '',
            location: userInit.location || '',
            birthday: userInit.birthday || format(date.value, 'yyyy-MM-dd')
        };

        if (userInit.birthday) {
            date.value = new Date(userInit.birthday);
        }

        selected.value = userInit.location || cities[0];
        loading.value = false;
    } catch (error) {
        console.error('Error loading user data:', error);
        loading.value = false;
        updateStatus.value = 'Помилка завантаження даних';
    }
});
const cities = [
    "Київ", "Біла Церква", "Бориспіль", "Бровари", "Фастів", "Ірпінь", "Вишгород",
    "Львів", "Дрогобич", "Червоноград", "Стрий", "Самбір", "Борислав",
    "Одеса", "Ізмаїл", "Чорноморськ", "Южне", "Білгород-Дністровський",
    "Харків", "Лозова", "Куп'янськ", "Ізюм", "Чугуїв",
    "Дніпро", "Кривий Ріг", "Нікополь", "Павлоград", "Кам'янське",
    "Запоріжжя", "Бердянськ", "Мелітополь", "Енергодар",
    "Вінниця", "Жмеринка", "Могилів-Подільський", "Гайсин",
    "Полтава", "Кременчук", "Лубни", "Миргород",
    "Хмельницький", "Кам'янець-Подільський", "Шепетівка",
    "Чернігів", "Ніжин", "Прилуки",
    "Суми", "Конотоп", "Шостка", "Охтирка",
    "Тернопіль", "Чортків", "Бережани",
    "Чернівці", "Новодністровськ",
    "Луцьк", "Ковель", "Нововолинськ",
    "Рівне", "Дубно", "Вараш",
    "Житомир", "Бердичів", "Коростень",
    "Черкаси", "Умань", "Сміла",
    "Кропивницький", "Олександрія", "Світловодськ",
    "Миколаїв", "Первомайськ", "Южноукраїнськ",
    "Херсон", "Нова Каховка", "Генічеськ",
    "Івано-Франківськ", "Коломия", "Калуш",
    "Ужгород", "Мукачево", "Хуст", "Берегове",
    "Сєвєродонецьк", "Лисичанськ", "Рубіжне",
    "Маріуполь", "Краматорськ", "Слов'янськ", "Покровськ"
];
const selected = ref(cities[0]);

// Функция для обновления профиля
async function updateProfile() {
    try {
        updateStatus.value = 'Оновлення...';

        const response = await useFetch('http://38.180.227.189:9000/api/auth/profile', {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: {
                username: state.value.username,
                email: state.value.email,
                phone: state.value.phone,
                location: selected.value,
                birthday: format(date.value, 'yyyy-MM-dd')
            }
        });

        if (response.data.value?.success) {
            updateStatus.value = 'Профіль успішно оновлено';
            // Обновляем данные в store
            await userStore.getUser();
            setTimeout(() => {
                updateStatus.value = '';
            }, 3000);
        } else {
            updateStatus.value = response.data.value?.message || 'Помилка оновлення профілю';
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        updateStatus.value = 'Помилка оновлення профілю';
    }
}
</script>

<template>
    <p class="text-[#23262F] font-[600] text-[36px] md:text-[36px] text-[28px] mb-6 md:mb-12 pt-10">Профіль користувача
    </p>

    <!-- Show loading message or spinner until user data is loaded -->
    <div v-if="loading" class="flex justify-center items-center">
        <p>Загрузка...</p>
    </div>

    <!-- Display the user data once it is loaded -->
    <div v-else class="grid md:grid-cols-2 grid-cols-1 gap-5">
        <div class="flex flex-col items-start w-full">
            <label class="text-[18px] md:text-[20px] text-[#777E90] mb-[10px]">
                Ім'я
            </label>
            <UInput v-model="state.username" class="w-full md:w-[90%]" size="lg" />
        </div>
        <div class="flex flex-col items-start w-full">
            <label class="text-[18px] md:text-[20px] text-[#777E90] mb-[10px]">
                Електронна пошта
            </label>
            <UInput v-model="state.email" class="w-full md:w-[90%]" size="lg" />
        </div>
        <div class="flex flex-col items-start w-full">
            <label class="text-[18px] md:text-[20px] text-[#777E90] mb-[10px]">
                Номер телефону
            </label>
            <UInput v-model="state.phone" placeholder="Ваш номер телефону" class="w-full md:w-[90%]" size="lg" />
        </div>
        <div class="flex flex-col items-start w-full">
            <label class="text-[18px] md:text-[20px] text-[#777E90] mb-[10px]">
                Місцезнаходження
            </label>
            <USelectMenu v-model="selected" :options="cities" class="w-full md:w-[90%]" size="lg" />
        </div>
        <div class="flex flex-col items-start w-full">
            <label class="text-[18px] md:text-[20px] text-[#777E90] mb-[10px]">
                Дата народження
            </label>
            <UPopover :popper="{ placement: 'bottom-start' }" class="w-full">
                <UButton icon="i-heroicons-calendar-days-20-solid" :label="format(date, 'd MMM, yyy')" size="lg"
                    class="w-full md:w-auto" />

                <template #panel="{ close }">
                    <ReusedItemsDatepicker v-model="date" is-required @close="close" />
                </template>
            </UPopover>
        </div>
        <div class="flex flex-col items-start w-full mt-4 md:mt-0">
            <label class="text-[18px] md:text-[20px] text-[#777E90] mb-[10px]">
                Збереження даних
            </label>
            <div class="space-y-2 w-full md:w-auto">
                <UButton size="lg" @click="updateProfile" :loading="updateStatus === 'Оновлення...'"
                    class="w-full md:w-auto">
                    Зберегти профіль
                </UButton>
                <p v-if="updateStatus" :class="{
                    'text-green-500': updateStatus === 'Профіль успішно оновлено',
                    'text-red-500': updateStatus.includes('Помилка')
                }">
                    {{ updateStatus }}
                </p>
            </div>
        </div>
    </div>
</template>
