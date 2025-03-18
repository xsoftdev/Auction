<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCategoryStore } from '~/storage/partitionState';
import { storeToRefs } from 'pinia';

// Define the category interface
interface Category {
    _id: string;
    name: string;
    link?: string;
    status: string;
    parentId: string | null;
    createdAt: string;
    __v: number;
    children?: Category[];
}

const router = useRouter();
const store = useCategoryStore();
const storeCategories = ref<any[]>([]);

// Function to create hierarchical structure from flat data
function createHierarchy(items: any[]): Category[] {
    const itemMap: Record<string, Category> = {};

    // First, create a map of all items by ID
    items.forEach(item => {
        itemMap[item._id] = {
            ...item,
            children: []
        };
    });

    // Then, build the hierarchy
    const rootItems: Category[] = [];
    items.forEach(item => {
        if (item.parentId === null) {
            rootItems.push(itemMap[item._id]);
        } else if (itemMap[item.parentId]) {
            itemMap[item.parentId].children?.push(itemMap[item._id]);
        }
    });

    return rootItems;
}

// State for menu controls
const state = ref<{ [key: string]: boolean }>({
    categories: false,
    subcategories: false,
    subSubCategories: false
});

const mainCategories = computed(() => createHierarchy(storeCategories.value));

const activeCategory = ref<number | null>(null);
const activeSubcategory = ref<number | null>(null);

const toggleMenu = (menu: string) => {
    state.value[menu] = !state.value[menu];
};

const closeMenus = () => {
    state.value.categories = false;
    state.value.subcategories = false;
    state.value.subSubCategories = false;
};

const toggleCategory = (index: number) => {
    activeCategory.value = activeCategory.value === index ? null : index;

    const category = mainCategories.value[index];
    if (!category.children || category.children.length === 0) {
        router.push(`/lots/${category._id}`);
    }

    state.value.subcategories = activeCategory.value !== null;
};

const toggleSubcategory = (index: number) => {
    activeSubcategory.value = activeSubcategory.value === index ? null : index;

    state.value.subSubCategories = activeSubcategory.value !== null;

    const category = mainCategories.value[activeCategory.value];
    const subcategory = category?.children?.[activeSubcategory.value];

    if (!subcategory?.children || subcategory.children.length === 0) {
        router.push(`/lots/${subcategory?._id}`);
    }
};

// Initialize the component
onMounted(() => {
    // Get categories from store
    storeCategories.value = store.categories;
});
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
            <NuxtLink to="/clientarea/create_lot" class="flex flex-col items-center" @click="closeMenus()">
                <img src="/icon/plus-add.svg" alt="" class="w-8" />
                <p>Продати</p>
            </NuxtLink>
            <NuxtLink to="/liked" class="flex flex-col items-center" @click="closeMenus()">
                <img src="/icon/Heart.svg" alt="" class="w-6" />
                <p>Обрані</p>
            </NuxtLink>
            <NuxtLink to="/clientarea" class="flex flex-col items-center" @click="closeMenus()">
                <img src="/icon/Profile.svg" alt="" class="w-6" />
                <p>Профіль</p>
            </NuxtLink>
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
                <div v-for="(category, catIndex) in mainCategories" :key="category._id" class="category cursor-pointer">
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
                <div v-for="(subCategory, subIndex) in mainCategories[activeCategory].children" :key="subCategory._id"
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
        v-if="state.subSubCategories && activeSubcategory !== null && mainCategories[activeCategory]?.children[activeSubcategory]?.children?.length">
        <div class="modal fixed inset-0 bg-black bg-opacity-50 z-40 flex flex-col justify-center items-center">
            <div class="modal-header bg-white w-full flex flex-row justify-between items-end p-5">
                <img src="/icon/chevron-left.svg" alt="" class="w-8 h-8" @click="toggleMenu('subSubCategories')">
                <p class="text-[20px] font-medium">Всі категорії</p>
                <img src="/icon/cart1.svg" alt="" class="w-8 h-8">
            </div>
            <div
                class="modal-content bg-white rounded-lg w-full max-w-md h-full px-5 py-8 pt-4 overflow-y-auto space-y-1">
                <div v-for="subSubCategory in mainCategories[activeCategory].children[activeSubcategory].children"
                    :key="subSubCategory._id" class="cursor-pointer">
                    <p class="rounded-md py-1 px-2 hover:bg-gray-200 text-[18px]"
                        @click="router.push(`/lots/${subSubCategory._id}`)">
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
