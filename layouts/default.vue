<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const categories = [
    {
        name: 'Нові лоти за 24 години',
        link: '/lots?key=novye-loty-za-24-chasa',
        subcategories: []
    },
    {
        name: 'Приманки',
        link: '/lots?key=primanki',
        subcategories: [
            {
                name: 'Воблери',
                link: '/lots?key=voblery',
                subcategories: [
                    { name: 'Мінноу', link: '/lots?key=minnou', subcategories: [] },
                    { name: 'Шед', link: '/lots?key=shed', subcategories: [] },
                    { name: 'Фет', link: '/lots?key=fet', subcategories: [] },
                    { name: 'Кренк', link: '/lots?key=krenk', subcategories: [] },
                    { name: 'Ратліни', link: '/lots?key=rattliny', subcategories: [] },
                    { name: 'Джеркбейти', link: '/lots?key=dzherkbejty', subcategories: [] },
                    { name: 'Сімбейти', link: '/lots?key=simbjejty', subcategories: [] },
                    { name: 'Попери', link: '/lots?key=poppery', subcategories: [] },
                    { name: 'Волкери і стікбейти', link: '/lots?key=volkery-i-stikbejty', subcategories: [] },
                    { name: 'Кроулери', link: '/lots?key=kroulery', subcategories: [] }
                ]
            },
            { name: 'Хендмейд UA', link: '/lots?key=khendmejd-ua', subcategories: [] },
            { name: 'Китайські копії приманок', link: '/lots?key=kitajskie-kopii-primanok', subcategories: [] },
            { name: 'Набори приманок', link: '/lots?key=nabory-primanok', subcategories: [] },
            { name: 'Саморобні приманки (хендмейд)', link: '/lots?key=samodelnye-primanki', subcategories: [] },
            { name: 'Силіконові приманки', link: '/lots?key=silikonovye-primanki', subcategories: [] },
            { name: 'Блешні', link: '/lots?key=blesny', subcategories: [] },
            { name: 'Цикади', link: '/lots?key=tsikady', subcategories: [] },
            { name: 'Інше', link: '/lots?key=prochie', subcategories: [] }
        ]
    },
    {
        name: 'Ліска, плетені шнури',
        link: '/lots?key=leska-pletenye-shnury',
        subcategories: [
            { name: 'Монофільна ліска', link: '/lots?key=monofilnaya-leska', subcategories: [] },
            { name: 'Нанофіл', link: '/lots?key=nanofil', subcategories: [] },
            { name: 'Плетені шнури', link: '/lots?key=pletenye-shnury', subcategories: [] },
            { name: 'Флюорокарбон', link: '/lots?key=flyuorokarbon', subcategories: [] }
        ]
    },
    {
        name: 'Вудилища',
        link: '/lots?key=udilishcha',
        subcategories: [
            { name: 'Болонські вудилища', link: '/lots?key=bolonskie-udilishcha', subcategories: [] },
            { name: 'Кастингові вудилища', link: '/lots?key=kastingovye-udilishcha', subcategories: [] },
            { name: 'Махові вудилища', link: '/lots?key=makhovye-udilishcha', subcategories: [] },
            { name: 'Спінінгові вудилища', link: '/lots?key=spinningovye-udilishcha', subcategories: [] },
            { name: 'Тревел спінінги', link: '/lots?key=trevel-spinningi', subcategories: [] },
            { name: 'Тролінгові вудилища', link: '/lots?key=trollingovye-udilishcha', subcategories: [] },
            { name: 'Фідерні/Коропові вудилища', link: '/lots?key=fidernye-karpovye-udilishcha', subcategories: [] }
        ]
    },
    {
        name: 'Риболовні котушки',
        link: '/lots?key=rybolovnye-katushki',
        subcategories: [
            { name: 'Безінерційні котушки', link: '/lots?key=bezynercionnye-katushki', subcategories: [] },
            { name: 'Мультиплікаторні котушки', link: '/lots?key=multiplikatornye-katushki', subcategories: [] },
            { name: 'Провідкові котушки', link: '/lots?key=provodochnye-katushki', subcategories: [] },
            { name: 'Запчастини до котушок та змазки', link: '/lots?key=zapchasti-katushki-smazki', subcategories: [] }
        ]
    },
    {
        name: 'Гачки',
        link: '/lots?key=kryuchki',
        subcategories: [
            { name: 'Джиг-головки, чебурашки, вантажі', link: '/lots?key=dzhig-golovki', subcategories: [] },
            { name: 'Гачки, двійники, трійники', link: '/lots?key=kryuchki-dvoiniki-troiniki', subcategories: [] }
        ]
    },
    {
        name: 'Риболовні вертлюжки, карабіни, повідці',
        link: '/lots?key=rybolovnye-vertlyugi-karabiny-povodki',
        subcategories: []
    },
    {
        name: 'Аксесуари',
        link: '/lots?key=aksessuary',
        subcategories: [
            { name: 'Інструменти / Ножі', link: '/lots?key=instrumenty-nozhi', subcategories: [] },
            { name: 'Підсаки, багорики, Lip Grip', link: '/lots?key=podsacheki-bagoriki', subcategories: [] },
            { name: 'Риболовні сумки / тубуси / чохли / ящики і коробки', link: '/lots?key=summki-chekhly-yashchiki', subcategories: [] }
        ]
    },
    {
        name: 'Все для лиття силікону',
        link: '/lots?key=litie-silikona',
        subcategories: []
    },
    {
        name: 'Коропово-фідерні снасті',
        link: '/lots?key=karpovo-fidernye-snasti',
        subcategories: [
            { name: 'Бойли', link: '/lots?key=boily', subcategories: [] },
            { name: 'Відра, ємності, сита', link: '/lots?key=vedra-emkosti-sita', subcategories: [] },
            { name: 'Готові оснащення та фурнітура', link: '/lots?key=gotovye-osnastki', subcategories: [] },
            { name: 'Коропово-фідерні котушки', link: '/lots?key=karpovo-fidernye-katushki', subcategories: [] },
            { name: 'Коропові вантажі', link: '/lots?key=karpovye-gruza', subcategories: [] },
            { name: 'Коропові вудилища', link: '/lots?key=karpovye-udilishcha', subcategories: [] },
            { name: 'Годівниці', link: '/lots?key=kormushki', subcategories: [] },
            { name: 'Крісла, платформи', link: '/lots?key=kresla-platformy', subcategories: [] },
            { name: 'Прикормка', link: '/lots?key=prikormka', subcategories: [] },
            { name: 'Садки, підсаки', link: '/lots?key=sadki-podsacheki', subcategories: [] },
            { name: 'Сигналізатори покльовок', link: '/lots?key=signalizatory-poklevok', subcategories: [] },
            { name: 'Стійки, тріподи', link: '/lots?key=stoyki-tripody', subcategories: [] },
            { name: 'Різне', link: '/lots?key=raznoe', subcategories: [] }
        ]
    },
    {
        name: 'Для зимової риболовлі',
        link: '/lots?key=dlya-zimney-rybalki',
        subcategories: [
            { name: 'Аксесуари для зимової ловлі', link: '/lots?key=zimnie-aksessuary', subcategories: [] },
            { name: 'Жерлиці зимові', link: '/lots?key=zherlitsy-zimnie', subcategories: [] },
            { name: 'Зимові приманки', link: '/lots?key=zimnie-primanki', subcategories: [] },
            { name: 'Зимові вудочки', link: '/lots?key=zimnie-udochki', subcategories: [] },
            { name: 'Зимове взуття/одяг', link: '/lots?key=zimnyaya-obuv-odezhda', subcategories: [] },
            { name: 'Котушки для зимової риболовлі', link: '/lots?key=zimnie-katushki', subcategories: [] },
            { name: 'Льодобури', link: '/lots?key=ledobury', subcategories: [] },
            { name: 'Ящики зимові', link: '/lots?key=zimnie-yashchiki', subcategories: [] }
        ]
    },
    {
        name: 'Човни та мотори',
        link: '/lots?key=lodki-motory',
        subcategories: []
    },
    {
        name: 'Нахлист',
        link: '/lots?key=nakhlyst',
        subcategories: []
    },
    {
        name: 'Рибальські сувеніри',
        link: '/lots?key=rybolovnye-suveniry',
        subcategories: []
    },
    {
        name: 'Рибальська електроніка',
        link: '/lots?key=rybackaya-elektronika',
        subcategories: []
    },
    {
        name: 'Туристичне спорядження',
        link: '/lots?key=turisticheskoe-snaryazhenie',
        subcategories: []
    },
    {
        name: 'Екіпірування',
        link: '/lots?key=ekipirovka',
        subcategories: [
            { name: 'Бейсболки та кепки', link: '/lots?key=bejsbolki-i-kepki', subcategories: [] },
            { name: 'Вейдерси та забродні костюми', link: '/lots?key=vejddery-i-zabrodnye-kostyumy', subcategories: [] },
            { name: 'Куртки, плащі, дощовики', link: '/lots?key=kurtyki-plaschi-dozhdeviki', subcategories: [] },
            { name: 'Взуття', link: '/lots?key=obuv', subcategories: [] },
            { name: 'Рукавички', link: '/lots?key=perchatki', subcategories: [] },
            { name: 'Поляризаційні окуляри', link: '/lots?key=polyaryzacionnye-ochki', subcategories: [] },
            { name: 'Футболки', link: '/lots?key=futbolki', subcategories: [] }
        ]
    },
    {
        name: 'Інше',
        link: '/lots?key=prochee',
        subcategories: []
    }
];
const router = useRouter();

const state = ref<{ [key: string]: boolean }>({
    categories: false,
    subcategories: false,
    subSubCategories: false
});

const activeCategory = ref<number | null>(null);
const activeSubcategory = ref<number | null>(null);

const toggleMenu = (menu: string) => {
    state.value[menu] = !state.value[menu];
};
const closeMenus = () => {
    state.value.categories = false;
    state.value.subcategories = false;
    state.value.subSubCategories = false;
}

const toggleCategory = (index: number) => {
    activeCategory.value = activeCategory.value === index ? null : index;

        if (!categories[index].subcategories || categories[index].subcategories.length === 0) {
            router.push(`${categories[index].link}`)
        }

    state.value.subcategories = activeCategory.value !== null;
};

const toggleSubcategory = (index: number) => {
    activeSubcategory.value = activeSubcategory.value === index ? null : index;

    state.value.subSubCategories = activeSubcategory.value !== null;

    if (!categories[activeCategory.value]?.subcategories[activeSubcategory.value]?.subcategories || 
        categories[activeCategory.value].subcategories[activeSubcategory.value].subcategories.length === 0) {
        
        const subcategory = categories[activeCategory.value].subcategories[activeSubcategory.value];
        router.push(`${subcategory.link}`);
    }
};
</script>

<template>
    <BaseContainer>
        <BaseHeader />
        <slot />
        <BaseFooter />
    </BaseContainer>

    <!-- Mobile Controls -->
    <div class="controls fixed bottom-0 bg-white h-20 w-full rounded-t-3xl z-50 md:hidden">
        <div class="flex flex-row items-center justify-between p-5">
            <NuxtLink to="/" class="flex flex-col items-center" @click="closeMenus()">
                <img src="/icon/Home.svg" alt="" class="w-6" />
                <p>Головна</p>
            </NuxtLink>
            <div class="flex flex-col items-center" @click="toggleMenu('categories')">
                <img src="/icon/Category.svg" alt="" class="w-6" />
                <p>Категорії</p>
            </div>
            <div class="flex flex-col items-center" @click="closeMenus()">
                <img src="/icon/plus-add.svg" alt="" class="w-8" />
                <p>Продати</p>
            </div>
            <NuxtLink to="/liked" class="flex flex-col items-center" @click="closeMenus()">
                <img src="/icon/Heart.svg" alt="" class="w-6" />
                <p>Обрані</p>
            </NuxtLink>
            <div class="flex flex-col items-center" @click="closeMenus()">
                <img src="/icon/Profile.svg" alt="" class="w-6" />
                <p>Профіль</p>
            </div>
        </div>
    </div>

    <!-- Categories Modal -->
    <template v-if="state.categories">
        <div class="modal fixed inset-0 bg-black bg-opacity-50 z-40 flex flex-col justify-center items-center">
            <div class="modal-header bg-white w-full flex flex-row justify-between items-end p-5">
                <img src="/icon/chevron-left.svg" alt="" class="w-8 h-8" @click="toggleMenu('categories')">
                <p class="text-[20px] font-medium">Всі категорії</p>
                <img src="/icon/cart1.svg" alt="" class="w-8 h-8">
            </div>
            <div
                class="modal-content bg-white rounded-lg w-full max-w-md h-full px-5 py-8 pt-4 overflow-y-auto space-y-1">
                <div v-for="(category, catIndex) in categories" :key="catIndex" class="category cursor-pointer">
                    <p class="rounded-md py-1 px-2 hover:bg-gray-200 text-[18px]" @click="toggleCategory(catIndex)">
                        {{ category.name }}
                    </p>
                </div>
            </div>
        </div>
    </template>

    <!-- Subcategories Modal -->
    <template v-if="state.subcategories && activeCategory !== null">
        <div class="modal fixed inset-0 bg-black bg-opacity-50 z-40 flex flex-col justify-center items-center">
            <div class="modal-header bg-white w-full flex flex-row justify-between items-end p-5">
                <img src="/icon/chevron-left.svg" alt="" class="w-8 h-8" @click="toggleMenu('subcategories')">
                <p class="text-[20px] font-medium">Всі категорії</p>
                <img src="/icon/cart1.svg" alt="" class="w-8 h-8">
            </div>
            <div
                class="modal-content bg-white rounded-lg w-full max-w-md h-full px-5 py-8 pt-4 overflow-y-auto space-y-1">
                <div v-for="(subCategory, subIndex) in categories[activeCategory].subcategories" :key="subIndex"
                    class="subCategory cursor-pointer">
                    <p class="rounded-md py-1 px-2 hover:bg-gray-200 text-[18px]" @click="toggleSubcategory(subIndex)">
                        {{ subCategory.name }}
                    </p>
                </div>
            </div>
        </div>
    </template>

    <!-- Sub-Subcategories Modal -->
    <template
        v-if="state.subSubCategories && activeSubcategory !== null && categories[activeCategory]?.subcategories[activeSubcategory]?.subcategories?.length">
        <div class="modal fixed inset-0 bg-black bg-opacity-50 z-40 flex flex-col justify-center items-center">
            <div class="modal-header bg-white w-full flex flex-row justify-between items-end p-5">
                <img src="/icon/chevron-left.svg" alt="" class="w-8 h-8" @click="toggleMenu('subSubCategories')">
                <p class="text-[20px] font-medium">Всі категорії</p>
                <img src="/icon/cart1.svg" alt="" class="w-8 h-8">
            </div>
            <div
                class="modal-content bg-white rounded-lg w-full max-w-md h-full px-5 py-8 pt-4 overflow-y-auto space-y-1">
                <div v-for="(subSubCategory, subSubIndex) in categories[activeCategory].subcategories[activeSubcategory].subcategories"
                    :key="subSubIndex" class="cursor-pointer">
                    <p class="rounded-md py-1 px-2 hover:bg-gray-200 text-[18px]" @click="router.push(subSubCategory.link)">
                        {{ subSubCategory.name }}
                    </p>
                </div>
            </div>
        </div>
    </template>
</template>

<style scoped>
.modal {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.modal-content {
    max-width: 600px;
    min-height: 50%;
    max-height: 100vh;
    overflow-y: auto;
    padding-bottom: 120px;
}

.close-btn {
    font-size: 1.5rem;
    background: none;
    border: none;
    color: black;
}
</style>
