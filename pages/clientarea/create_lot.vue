<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, minValue, minLength } from '@vuelidate/validators'
import { useLotCreate } from '~/composables/useLotCreate'
import { useCategoryStore } from '~/storage/partitionState'

const store = useCategoryStore()
const { createLot, isLoading, error } = useLotCreate()
const categories = ref([]) // Инициализируем пустым массивом вместо null
const photoFiles = ref<File[]>([]) // Файлы фотографий для загрузки

// Безопасная загрузка категорий
const loadCategories = async () => {
    try {
        await store.fetchCategories()
        if (store.categories && Array.isArray(store.categories)) {
            categories.value = store.categories
            console.log('Категории успешно загружены:', categories.value.length)
        } else {
            console.warn('Категории не загружены или имеют неверный формат:', store.categories)
            categories.value = [] // Устанавливаем пустой массив в случае ошибки
        }
    } catch (e) {
        console.error('Ошибка при загрузке категорий:', e)
        categories.value = [] // Устанавливаем пустой массив в случае ошибки
    }
}

const qualityOptions = [
    "б/в",
    "Новий"
]

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

const paymentOptions = [
    "Готівка під час зустрічі",
    "Оплата карткою"
]

const deliveryOptions = [
    "Нова пошта",
    "Укрпошта",
    "Meest",
    "Інше"
]

// Получаем текущую дату и минимальную дату окончания (следующий день)
const getCurrentDate = () => {
    const now = new Date()
    return now.toISOString().split('T')[0]
}

const getMinEndDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
}

// Получаем минимальную дату и время окончания (следующий день, то же время)
const getMinEndDateTime = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    // Форматируем в ISO формат, совместимый с input datetime-local (YYYY-MM-DDTHH:MM)
    return tomorrow.toISOString().slice(0, 16);
};

// Form state
const form = ref({
    title: '',
    startPrice: null as number | null,
    blitzPrice: null as number | null,
    bidStep: null as number | null,
    endDate: getMinEndDateTime(), // Дата и время окончания торгов
    category: '',
    subcategory: '',
    section: '',
    quality: '',
    photos: [] as Array<{ url: string; order: number }>,
    location: '',
    delivery: '',
    payment: '',
    description: ''
})

// Validation rules
// Validation rules
const rules = {
    title: { required, minLength: minLength(3) },
    startPrice: { required, minValue: minValue(0) },
    blitzPrice: {
        // Удаляем обязательность поля blitzPrice
        minValue: minValue(0),
        // Проверяем, что blitzPrice больше startPrice только если blitzPrice задано
        greaterThanStartPrice: (value: number) => {
            // Если blitzPrice не указано (null, 0 или пустая строка) - не валидируем
            if (!value) return true;
            // Иначе проверяем, что blitzPrice больше startPrice
            return value > (form.value.startPrice || 0);
        }
    },
    bidStep: {
        // Удаляем обязательность поля bidStep
        minValue: minValue(1),
        reasonablePercent: (value: number) => {
            // Если bidStep не указано (null, 0 или пустая строка) - не валидируем
            if (!value) return true;
            // Если startPrice не указано - не можем проверить процент
            if (!form.value.startPrice) return true;
            // Проверяем, что шаг ставки составляет минимум 1% от стартовой цены
            const minStep = form.value.startPrice * 0.01;
            return value >= minStep;
        }
    },
    endDate: {
        required,
        futureDate: (value: string) => {
            if (!value) return false;

            const now = new Date();
            const selectedDate = new Date(value);

            // Проверяем, что выбранная дата в будущем
            return selectedDate > now;
        }
    },
    category: { required },
    quality: { required },
    location: { required },
    delivery: { required },
    payment: { required },
    description: { required, minLength: minLength(20) },
    photos: {
        required,
        notEmpty: (val: any[]) => {
            // Проверяем как массив фотографий, так и файлы для загрузки
            return (val && val.length > 0) || (photoFiles.value && photoFiles.value.length > 0);
        }
    }
}

const v$ = useVuelidate(rules, form)

// Transform categories data into options format for USelect
const mainCategoryOptions = computed(() => {
    if (!categories.value || !Array.isArray(categories.value)) return [];

    // Фильтруем только родительские категории (parentId === null)
    const rootCategories = categories.value.filter(cat => cat.parentId === null);

    return rootCategories.map(category => ({
        label: category.name,
        value: category._id
    }));
});

// Get current category object
const currentCategory = computed(() => {
    if (!categories.value || !Array.isArray(categories.value)) return null;
    if (!form.value.category) return null;
    return categories.value.find(cat => cat._id === form.value.category) || null;
});

// Compute subcategory options based on selected category
const subcategoryOptions = computed(() => {
    if (!currentCategory.value) return [];

    // Фильтруем категории, у которых parentId равен ID текущей категории
    const subCategories = categories.value.filter(cat =>
        cat.parentId === currentCategory.value?._id
    );

    return subCategories.map(subCat => ({
        label: subCat.name,
        value: subCat._id
    }));
});

// Get current subcategory object
const currentSubcategory = computed(() => {
    if (!categories.value || !Array.isArray(categories.value)) return null;
    if (!form.value.subcategory) return null;
    return categories.value.find(cat => cat._id === form.value.subcategory) || null;
});

// Compute section options based on selected subcategory
const sectionOptions = computed(() => {
    if (!currentSubcategory.value) return [];

    // Фильтруем категории, у которых parentId равен ID текущей подкатегории
    const sections = categories.value.filter(cat =>
        cat.parentId === currentSubcategory.value?._id
    );

    return sections.map(section => ({
        label: section.name,
        value: section._id
    }));
});

// Show/hide dependent dropdowns
const showSubcategories = computed(() => {
    return subcategoryOptions.value.length > 0;
});

const showSections = computed(() => {
    return sectionOptions.value.length > 0;
});

// Calculated default bid step
const defaultBidStep = computed(() => {
    if (!form.value.startPrice) return null;
    // Шаг по умолчанию - 5% от стартовой цены, округленный до целого
    return Math.ceil(form.value.startPrice * 0.05);
});

// Auto-set bid step when start price changes (if not already set)
const onStartPriceChange = () => {
    if (!form.value.bidStep && form.value.startPrice) {
        form.value.bidStep = defaultBidStep.value;
    }
};

// Handlers
const onCategoryChange = () => {
    form.value.subcategory = ''
    form.value.section = ''
}

const onSubcategoryChange = () => {
    form.value.section = ''
}

/**
 * Обработчик выбора файлов
 */
const onFileChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    // Добавляем новые файлы в массив
    for (let i = 0; i < input.files.length; i++) {
        photoFiles.value.push(input.files[i]);
    }

    console.log(`Выбрано ${photoFiles.value.length} файлов для загрузки`);

    // Обновляем превью файлов
    updatePhotoPreview();

    // Сбрасываем input, чтобы можно было выбрать те же файлы снова
    input.value = "";

    // Запускаем валидацию
    v$.value.photos.$validate();
};

/**
 * Обновляет превью фотографий
 */
const updatePhotoPreview = () => {
    // Очищаем текущие превью
    form.value.photos = [];

    // Создаем превью для каждого файла
    photoFiles.value.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target && typeof e.target.result === 'string') {
                form.value.photos.push({
                    url: e.target.result,
                    order: index
                });
            }
        };
        reader.readAsDataURL(file);
    });
};

/**
 * Удаляет фото из списка
 */
const removePhoto = (index: number) => {
    if (index >= 0 && index < photoFiles.value.length) {
        // Удаляем файл из массива
        photoFiles.value.splice(index, 1);

        // Обновляем превью
        updatePhotoPreview();

        // Запускаем валидацию
        v$.value.photos.$validate();
    }
};

/**
 * Обработчик отправки формы
 */
/**
 * Обработчик отправки формы
 */
const handleSubmit = async () => {
    console.log("handleSubmit вызван");

    // Выполняем валидацию всей формы
    const isValid = await v$.value.$validate();
    console.log("Результат валидации:", isValid);

    // Проверяем фотографии
    const hasPhotos = photoFiles.value.length > 0;

    // Если есть ошибки валидации, прерываем выполнение
    if (!isValid || !hasPhotos) {
        console.log("Валидация не пройдена. isValid =", isValid, "hasPhotos =", hasPhotos);
        return;
    }

    try {
        console.log("Подготовка данных для отправки");

        // Получаем ID последней выбранной категории
        const partition = form.value.section || form.value.subcategory || form.value.category;

        // Логируем информацию о выбранной категории для отладки
        console.log("Выбранная иерархия категорий:", {
            category: form.value.category,
            subcategory: form.value.subcategory,
            section: form.value.section,
            finalPartition: partition
        });

        // Формируем данные для отправки
        const lotData = {
            title: form.value.title,
            startPrice: Number(form.value.startPrice),
            // Добавляем blitzPrice только если оно задано
            ...(form.value.blitzPrice ? { blitzPrice: Number(form.value.blitzPrice) } : {}),
            // Устанавливаем дефолтный bidStep, если он не был указан
            bidStep: Number(form.value.bidStep) || Math.ceil(Number(form.value.startPrice) * 0.05),
            endDate: form.value.endDate,
            partition,
            quality: form.value.quality,
            photos: [], // Пустой массив, т.к. фотографии будут загружены отдельно
            location: form.value.location,
            delivery: form.value.delivery,
            payment: form.value.payment,
            description: form.value.description
        };

        console.log('Отправляемые данные лота:', lotData);
        console.log('Файлы для загрузки:', photoFiles.value.length);

        // Отправляем данные на сервер вместе с файлами
        await createLot(lotData, photoFiles.value);
        console.log("Лот успешно создан");

        // После успешного создания переходим на страницу личного кабинета
        navigateTo('/clientarea');
    } catch (e) {
        console.error("Ошибка при создании лота:", e);
    }
};

// Загружаем категории при монтировании компонента
onMounted(async () => {
    await loadCategories();
});
</script>

<template>
    <div class="mb-6">
        <UBreadcrumb :links="links" />
    </div>
    <h3 class="mb-8 text-black_haze-900 font-bold text-[36px]">Створити Лот</h3>

    <form @submit.prevent="handleSubmit" class="space-y-10">
        <div class="grid lg:grid-cols-2 grid-cols-1 lg:gap-10 gap-4">
            <!-- Title -->
            <div class="item space-y-3">
                <label class="text-black_haze-500">
                    Назва <span class="text-[#D33535]">*</span>:
                </label>
                <div class="input lg:max-w-[80%]">
                    <UInput v-model="form.title" size="lg" :error="v$.title.$error" />
                    <p v-if="v$.title.$error" class="mt-1 text-sm text-red-500">
                        {{ v$.title.$errors[0].$message }}
                    </p>
                </div>
            </div>

            <!-- Start Price -->
            <div class="item space-y-3">
                <label class="text-black_haze-500">
                    Стартова ціна <span class="text-[#D33535]">*</span>:
                </label>
                <div class="input lg:max-w-[80%]">
                    <UInput v-model="form.startPrice" size="lg" type="number" :error="v$.startPrice.$error"
                        @update:model-value="onStartPriceChange" />
                    <p v-if="v$.startPrice.$error" class="mt-1 text-sm text-red-500">
                        {{ v$.startPrice.$errors[0].$message }}
                    </p>
                </div>
            </div>

            <!-- Categories -->
            <div class="item space-y-3">
                <label class="text-black_haze-500">
                    Категорія Товару <span class="text-[#D33535]">*</span>:
                </label>
                <div class="selections lg:max-w-[80%] space-y-3">
                    <!-- Main category selector -->
                    <USelect v-model="form.category" :options="mainCategoryOptions" placeholder="Виберіть категорію"
                        @update:model-value="onCategoryChange" size="lg" :error="v$.category.$error" />

                    <!-- Subcategory selector - only shown when a main category is selected -->
                    <USelect v-if="showSubcategories" v-model="form.subcategory" :options="subcategoryOptions"
                        placeholder="Виберіть підкатегорію" @update:model-value="onSubcategoryChange" size="lg" />

                    <!-- Section selector - only shown when a subcategory is selected and has sections -->
                    <USelect v-if="showSections" v-model="form.section" :options="sectionOptions"
                        placeholder="Виберіть розділ" size="lg" />
                </div>
                <p v-if="v$.category.$error" class="mt-1 text-sm text-red-500">
                    Будь ласка, виберіть категорію
                </p>
            </div>

            <!-- Blitz Price -->
            <div class="item space-y-3">
                <label class="text-black_haze-500">
                    Бліц - ціна:
                </label>
                <div class="input lg:max-w-[80%]">
                    <UInput v-model="form.blitzPrice" size="lg" type="number" min="0" :error="v$.blitzPrice.$error" />
                    <p v-if="v$.blitzPrice.$error" class="mt-1 text-sm text-red-500">
                        Бліц-ціна має бути більшою за стартову ціну
                    </p>
                    <p class="mt-1 text-xs text-gray-500">
                        Необов'язкове поле. Якщо вказано, покупець може придбати лот одразу за цю ціну
                    </p>
                </div>
            </div>

            <!-- Bid Step -->
            <div class="item space-y-3">
                <label class="text-black_haze-500">
                    Крок ставки:
                </label>
                <div class="input lg:max-w-[80%]">
                    <UInput v-model="form.bidStep" size="lg" type="number" :error="v$.bidStep.$error" />
                    <p v-if="v$.bidStep.$error" class="mt-1 text-sm text-red-500">
                        Крок ставки повинен бути не менше 1% від стартової ціни
                    </p>
                    <p class="mt-1 text-xs text-gray-500">
                        Якщо не вказано, буде встановлено 5% від стартової ціни
                    </p>
                </div>
            </div>

            <!-- End Date with Time -->
            <div class="item space-y-3">
                <label class="text-black_haze-500">
                    Дата закінчення торгів <span class="text-[#D33535]">*</span>:
                </label>
                <div class="input lg:max-w-[80%]">
                    <UInput v-model="form.endDate" type="datetime-local" :min="getMinEndDateTime()"
                        :error="v$.endDate.$error" size="lg" />
                    <p v-if="v$.endDate.$error" class="mt-1 text-sm text-red-500">
                        Дата закінчення повинна бути в майбутньому
                    </p>
                </div>
            </div>

            <!-- Quality -->
            <div class="item space-y-3">
                <label class="text-black_haze-500">
                    Стан Лоту <span class="text-[#D33535]">*</span>:
                </label>
                <div class="input lg:max-w-[80%]">
                    <USelect v-model="form.quality" :options="qualityOptions" placeholder="Виберіть стан лоту" size="lg"
                        :error="v$.quality.$error" />
                    <p v-if="v$.quality.$error" class="mt-1 text-sm text-red-500">
                        {{ v$.quality.$errors[0].$message }}
                    </p>
                </div>
            </div>
        </div>

        <!-- Photo Upload Section -->
        <div class="mb-10">
            <div class="mb-4 p-4 border border-gray-300 rounded">
                <h4 class="font-semibold mb-3">Завантаження фотографій <span class="text-[#D33535]">*</span></h4>

                <!-- Выбор файлов -->
                <div class="mb-3">
                    <input type="file" accept="image/*" multiple @change="onFileChange" class="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100" />
                </div>

                <!-- Превью выбранных фотографий -->
                <div v-if="form.photos.length > 0" class="mt-4">
                    <h5 class="font-medium mb-2">Вибрані фотографії ({{ form.photos.length }}):</h5>
                    <div class="flex flex-wrap gap-3">
                        <div v-for="(photo, index) in form.photos" :key="index"
                            class="relative w-32 h-32 border rounded overflow-hidden">
                            <img :src="photo.url" alt="Preview" class="w-full h-full object-cover" />
                            <button type="button" @click="removePhoto(index)"
                                class="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center">
                                ×
                            </button>
                        </div>
                    </div>
                </div>

                <p v-if="v$.photos.$error" class="mt-2 text-sm text-red-500">
                    Необхідно завантажити хоча б одну фотографію
                </p>
            </div>
        </div>

        <!-- Additional Options Section -->
        <h3 class="mb-8 text-black_haze-900 font-bold text-[36px]">Додаткові рекламні опції</h3>
        <ProfileCards class="mb-10" />

        <!-- Additional Information -->
        <div class="grid lg:grid-cols-2 grid-cols-1 lg:gap-10 gap-4 mb-10">
            <!-- Location -->
            <div class="item space-y-3">
                <label class="text-black_haze-500">
                    Місцезнаходження <span class="text-[#D33535]">*</span>:
                </label>
                <div class="input lg:max-w-[80%]">
                    <UInput v-model="form.location" size="lg" placeholder="Розташування де знаходиться лот"
                        :error="v$.location.$error" />
                    <p v-if="v$.location.$error" class="mt-1 text-sm text-red-500">
                        {{ v$.location.$errors[0].$message }}
                    </p>
                </div>
            </div>

            <!-- Delivery -->
            <div class="item space-y-3">
                <label class="text-black_haze-500">
                    Доставка <span class="text-[#D33535]">*</span>:
                </label>
                <div class="input lg:max-w-[80%]">
                    <USelect :options="deliveryOptions" v-model="form.delivery" size="lg" :error="v$.delivery.$error" />
                    <p v-if="v$.delivery.$error" class="mt-1 text-sm text-red-500">
                        {{ v$.delivery.$errors[0].$message }}
                    </p>
                </div>
            </div>

            <!-- Payment -->
            <div class="item space-y-3">
                <label class="text-black_haze-500">
                    Оплата <span class="text-[#D33535]">*</span>:
                </label>
                <div class="input lg:max-w-[80%]">
                    <USelect :options="paymentOptions" v-model="form.payment" size="lg" :error="v$.payment.$error" />
                    <p v-if="v$.payment.$error" class="mt-1 text-sm text-red-500">
                        {{ v$.payment.$errors[0].$message }}
                    </p>
                </div>
            </div>

            <!-- Description -->
            <div class="item space-y-3">
                <label class="text-black_haze-500">
                    Опис Лоту <span class="text-[#D33535]">*</span>:
                </label>
                <div class="input lg:max-w-[80%]">
                    <UTextarea v-model="form.description" autoresize placeholder="Опишіть ваш лот..." size="lg"
                        :error="v$.description.$error" />
                    <p v-if="v$.description.$error" class="mt-1 text-sm text-red-500">
                        {{ v$.description.$errors[0].$message }}
                    </p>
                </div>
            </div>
        </div>

        <!-- Submit Button -->
        <div class="buttons mb-10 w-full">
            <UButton type="submit" size="lg" class="py-3" :loading="isLoading">
                Опублікувати
            </UButton>
        </div>
    </form>

    <!-- Error Alert -->
    <UAlert v-if="error" class="mt-4" title="Помилка, не достатньо коштів на рахунку" :text="error" />
</template>
