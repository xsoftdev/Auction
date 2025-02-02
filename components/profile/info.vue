<script setup lang="ts">
import { useUserStore } from '~/storage/userState';
import { ref, onMounted } from 'vue';
import { format } from 'date-fns';

const userStore = useUserStore();
const date = ref(new Date());
const loading = ref(true); // Loading state

// Define reactive state to store user data
const state = ref({
    username: '',
    email: '',
    id: '',
    phone: '',
    city: '',
});

onMounted(async () => {
    // Simulating the data fetch or awaiting actual data fetch
    await userStore.getUser(); // Assuming this function will fetch user data
    const userInit = userStore.user;

    // Update state after user data is loaded
    state.value = {
        username: userInit.username,
        email: userInit.email,
        id: userInit.id,
        phone: userInit.phone || '',
        city: userInit.city || '',
    };

    loading.value = false; // Set loading to false after data is loaded
});
const cities = [
    "Київ", "Біла Церква", "Бориспіль", "Бровари", "Фастів", "Ірпінь", "Вишгород",
    "Львів", "Дрогобич", "Червоноград", "Стрий", "Самбір", "Борислав",
    "Одеса", "Ізмаїл", "Чорноморськ", "Южне", "Білгород-Дністровський",
    "Харків", "Лозова", "Куп’янськ", "Ізюм", "Чугуїв",
    "Дніпро", "Кривий Ріг", "Нікополь", "Павлоград", "Кам’янське",
    "Запоріжжя", "Бердянськ", "Мелітополь", "Енергодар",
    "Вінниця", "Жмеринка", "Могилів-Подільський", "Гайсин",
    "Полтава", "Кременчук", "Лубни", "Миргород",
    "Хмельницький", "Кам’янець-Подільський", "Шепетівка",
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
    "Маріуполь", "Краматорськ", "Слов’янськ", "Покровськ"
];


const selected = ref(cities[0])
</script>

<template>
    <p class="text-[#23262F] font-[600] text-[36px] mb-12">Профіль користувача</p>

    <!-- Show loading message or spinner until user data is loaded -->
    <div v-if="loading" class="flex justify-center items-center">
        <p>Загрузка...</p>
    </div>

    <!-- Display the user data once it is loaded -->
    <div v-else class="grid grid-cols-2">
        <div class="flex flex-col items-start w-full mb-5">
            <label class="text-[20px] text-[#777E90] mb-[10px]">
                Ім’я
            </label>
            <UInput v-model="state.username" class="w-[90%]" />
        </div>
        <div class="flex flex-col items-start w-full">
            <label class="text-[20px] text-[#777E90] mb-[10px]">
                Електронна пошта
            </label>
            <UInput v-model="state.email" class="w-[90%]" />
        </div>
        <div class="flex flex-col items-start w-full mb-5">
            <label class="text-[20px] text-[#777E90] mb-[10px]">
                Номер телефону
            </label>
            <UInput v-model="state.phone" placeholder="Ваш номер телефону" class="w-[90%]" />
        </div>
        <div class="flex flex-col items-start w-full">
            <label class="text-[20px] text-[#777E90] mb-[10px]">
                Місцезнаходження
            </label>
            <USelectMenu v-model="selected" :options="cities" class="w-[90%]"/>
        </div>
        <div class="flex flex-col items-start w-full mb-5">
            <label class="text-[20px] text-[#777E90] mb-[10px]">
                Дата народження
            </label>
            <UPopover :popper="{ placement: 'bottom-start' }">
                <UButton icon="i-heroicons-calendar-days-20-solid" :label="format(date, 'd MMM, yyy')" />

                <template #panel="{ close }">
                    <ReusedItemsDatepicker v-model="date" is-required @close="close" />
                </template>
            </UPopover>
        </div>
        <div class="flex flex-col items-start w-full">
            <label class="text-[20px] text-[#777E90] mb-[10px]">
                Збереження даних
            </label>
            <UButton size="lg">
                Зберегти профіль
            </UButton>
        </div>
    </div>
</template>
