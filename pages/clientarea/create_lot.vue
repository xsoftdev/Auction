<template>
    <div class="mb-6">
        <UBreadcrumb :links="links" />
    </div>
    <h3 class="mb-8 text-black_haze-900 font-bold text-[36px]">Створити Лот</h3>
    <div class="grid lg:grid-cols-2 grid-cols-1 lg:gap-10 gap-4 mb-10">
        <div class="item space-y-3">
            <label class="text-black_haze-500">
                Назва <span class="text-[#D33535]">*</span>:
            </label>
            <div class="input lg:max-w-[80%]">
                <UInput v-model="form.title" size="lg" />
            </div>
        </div>
        <div class="item space-y-3">
            <label class="text-black_haze-500">
                Стартова ціна <span class="text-[#D33535]">*</span>:
            </label>
            <div class="input lg:max-w-[80%]">
                <UInput v-model="form.startPrice" size="lg" type="number" />
            </div>
        </div>
        <div class="item space-y-3">
            <label class="text-black_haze-500">
                Категорія Товару <span class="text-[#D33535]">*</span>:
            </label>
            <div class="selections lg:max-w-[80%] space-y-3">
                <!-- Main Category Selection -->
                <USelect v-model="form.category" :options="mainCategoryOptions" placeholder="Виберіть категорію"
                    @update:model-value="onCategoryChange" size="lg" />

                <!-- Subcategory Selection -->
                <USelect v-if="showSubcategories" v-model="form.subcategory" :options="subcategoryOptions"
                    placeholder="Виберіть підкатегорію" @update:model-value="onSubcategoryChange" size="lg" />

                <!-- Section Selection -->
                <USelect v-if="showSections" v-model="form.section" :options="sectionOptions"
                    placeholder="Виберіть розділ" size="lg" />
            </div>
        </div>
        <div class="item space-y-3">
            <label class="text-black_haze-500">
                Бліц - ціна <span class="text-[#D33535]">*</span>:
            </label>
            <div class="input lg:max-w-[80%]">
                <UInput v-model="form.startPrice" size="lg" type="number" />
            </div>
        </div>
        <div class="item space-y-3">
            <label class="text-black_haze-500">
                Стан Лоту <span class="text-[#D33535]">*</span>:
            </label>
            <div class="input lg:max-w-[80%]">
                <USelect v-model="form.quality" :options="qualityOptions" placeholder="Виберіть стан лоту" size="lg" />
            </div>
        </div>
        <div class="item space-y-3">
            <label class="text-black_haze-500">
                Стартова ціна <span class="text-[#D33535]">*</span>:
            </label>
            <div class="input lg:max-w-[80%]">
                <UInput v-model="form.startPrice" size="lg" type="number" />
            </div>
        </div>
    </div>
    <ProfileUploadPhoto v-model:photos="form.photos" class="mb-10" />
    <h3 class="mb-8 text-black_haze-900 font-bold text-[36px]">Додаткові рекламні опції</h3>
    <ProfileCards class="mb-10" />
    <div class="grid lg:grid-cols-2 grid-cols-1 lg:gap-10 gap-4 mb-10">
        <div class="item space-y-3">
            <label class="text-black_haze-500">
                Місцезнаходження <span class="text-[#D33535]">*</span>:
            </label>
            <div class="input lg:max-w-[80%]">
                <UInput v-model="form.title" size="lg" placeholder="Розташування де знаходиться лот"/>
            </div>
        </div>
        <div class="item space-y-3">
            <label class="text-black_haze-500">
                Доставка <span class="text-[#D33535]">*</span>:
            </label>
            <div class="input lg:max-w-[80%]">
                <USelect :options="deliveryOptions" v-model="form.deliveryType" size="lg"/>
            </div>
        </div>
        <div class="item space-y-3">
            <label class="text-black_haze-500">
                Оплата <span class="text-[#D33535]">*</span>:
            </label>
            <div class="input lg:max-w-[80%]">
                <USelect :options="paymentOptions" v-model="form.paymentType" size="lg"/>
            </div>
        </div>
        <div class="item space-y-3">
            <label class="text-black_haze-500">
                Опис Лоту <span class="text-[#D33535]">*</span>:
            </label>
            <div class="input lg:max-w-[80%]">
                <UTextarea autoresize placeholder="Search..."
                    model-value="Here is an autoresize Textarea, write new lines to make the Textarea grow up..." size="lg"/>
            </div>
        </div>
    </div>
    <div class="buttons mb-10 w-full">
        <UButton size="lg" class="py-3">
            Опублікувати
        </UButton>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
const categories = [
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
const qualityOptions = ref([
    "б/в",
    "Новий"
])
const links = [{
    label: '',
    icon: 'i-heroicons-home',
    to: '/'
}, {
    label: 'Особистий кабінет',
    icon: '',
    to: '/clientarea'
}, {
    label: 'Створити Лот',
    icon: ''
}]
const paymentOptions = ref([
    "Готівка під час зустрічі",
    "Оплата карткою"
])

const deliveryOptions = ref([
    "Нова пошта",
    "Укрпошта",
    "Meest",
    "Інше"
])
// Form state
const form = ref({
    title: '',
    startPrice: '',
    category: '',
    subcategory: '',
    section: '',
    quality: '',
    photos: [],
    paymentType: '',
    deliveryType: ''
})

// Transform categories data into options format for USelect
const mainCategoryOptions = computed(() => {
    return categories.map(category => ({
        label: category.name,
        value: category.link
    }))
})

// Get current category object
const currentCategory = computed(() => {
    return categories.find(cat => cat.link === form.value.category)
})

// Compute subcategory options based on selected category
const subcategoryOptions = computed(() => {
    if (!currentCategory.value) return []
    return currentCategory.value.subcategories.map(sub => ({
        label: sub.name,
        value: sub.link
    }))
})

// Get current subcategory object
const currentSubcategory = computed(() => {
    if (!currentCategory.value) return null
    return currentCategory.value.subcategories.find(
        sub => sub.link === form.value.subcategory
    )
})

// Compute section options based on selected subcategory
const sectionOptions = computed(() => {
    if (!currentSubcategory.value) return []
    return currentSubcategory.value.subcategories.map(section => ({
        label: section.name,
        value: section.link
    }))
})

// Show/hide dependent dropdowns
const showSubcategories = computed(() => {
    return currentCategory.value?.subcategories.length > 0
})

const showSections = computed(() => {
    return currentSubcategory.value?.subcategories.length > 0
})

// Handlers
const onCategoryChange = () => {
    // Reset dependent selections
    form.value.subcategory = ''
    form.value.section = ''
}

const onSubcategoryChange = () => {
    // Reset section selection
    form.value.section = ''
}
</script>