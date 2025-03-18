<template>
    <div class="menu-container p-3 border rounded-md flex space-x-10">
        <!-- First column: Main categories -->
        <div class="categories flex flex-col items-start space-y-1 w-1/3 mr-10 border-r">
            <div v-for="(category, index) in mainCategories" :key="category._id" class="category cursor-pointer">
                <template v-if="category.children && category.children.length > 0">
                    <p @click="setActiveCategory(index)"
                        class="rounded-md py-[6px] px-3 hover:bg-gray-200 text-[16px] font-medium"
                        :class="{ 'bg-gray-200': activeCategoryIndex === index }">
                        {{ category.name }}
                    </p>
                </template>
                <template v-else>
                    <NuxtLink :to="`/lots/${category._id}`">
                        <p class="rounded-md py-[6px] px-3 hover:bg-gray-200 text-[16px] font-medium">
                            {{ category.name }}
                        </p>
                    </NuxtLink>
                </template>
            </div>
        </div>

        <!-- Second column: Subcategories of selected main category -->
        <div v-if="activeCategoryIndex !== null && activeCategory && activeCategory.children.length > 0"
            class="subcategories flex flex-col items-start space-y-2 w-1/3 border-r mr-10">
            <div v-for="(subcategory, index) in activeCategory.children" :key="subcategory._id"
                class="subcategory cursor-pointer">
                <template v-if="subcategory.children && subcategory.children.length > 0">
                    <p @click="setActiveSubcategory(index)" class="rounded-md py-1 px-2 hover:bg-gray-200 text-[16px]"
                        :class="{ 'bg-gray-200': activeSubcategoryIndex === index }">
                        {{ subcategory.name }}
                    </p>
                </template>
                <template v-else>
                    <NuxtLink :to="`/lots/${subcategory._id}`"
                        class="rounded-md py-1 px-2 hover:bg-gray-200 text-[16px]">
                        {{ subcategory.name }}
                    </NuxtLink>
                </template>
            </div>
        </div>

        <!-- Third column: Sub-subcategories -->
        <div v-if="activeSubcategoryIndex !== null && activeSubcategory && activeSubcategory.children.length > 0"
            class="sub-subcategories flex flex-col items-start space-y-2 w-1/3">
            <div v-for="subSubcategory in activeSubcategory.children" :key="subSubcategory._id" class="cursor-pointer">
                <NuxtLink :to="`/lots/${subSubcategory._id}`"
                    class="rounded-md py-1 px-2 hover:bg-gray-200 text-[16px]">
                    {{ subSubcategory.name }}
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useCategoryStore } from '~/storage/partitionState';
import { storeToRefs } from 'pinia';

// Define the category interface
interface Category {
    _id: string;
    name: string;
    link: string;
    status: string;
    parentId: string | null;
    createdAt: string;
    __v: number;
    children?: Category[];
}

// Initialize store and get categories
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

// Create the hierarchical structure from store data
const mainCategories = computed(() => createHierarchy(storeCategories.value));

// Track the active category and subcategory
const activeCategoryIndex = ref<number | null>(null);
const activeSubcategoryIndex = ref<number | null>(null);

// Computed properties for active items
const activeCategory = computed(() => {
    if (activeCategoryIndex.value !== null && mainCategories.value.length > 0) {
        return mainCategories.value[activeCategoryIndex.value];
    }
    return null;
});

const activeSubcategory = computed(() => {
    if (activeCategory.value && activeSubcategoryIndex.value !== null) {
        return activeCategory.value.children?.[activeSubcategoryIndex.value];
    }
    return null;
});

// Methods to set active items
function setActiveCategory(index: number) {
    if (activeCategoryIndex.value === index) {
        activeCategoryIndex.value = null;
        activeSubcategoryIndex.value = null;
    } else {
        activeCategoryIndex.value = index;
        activeSubcategoryIndex.value = null;
    }
}

function setActiveSubcategory(index: number) {
    if (activeSubcategoryIndex.value === index) {
        activeSubcategoryIndex.value = null;
    } else {
        activeSubcategoryIndex.value = index;
    }
}

// Initialize the component
onMounted(() => {
    // Get categories from store
    storeCategories.value = store.categories;

    // Optionally set default active category
    if (mainCategories.value.length > 0) {
        activeCategoryIndex.value = 0;
    }
});
</script>

<style scoped>
.menu-container {
    max-width: 100%;
}

.category,
.subcategory {
    position: relative;
    width: 100%;
}

.subSubCategory {
    display: flex;
    flex-direction: column;
}
</style>
