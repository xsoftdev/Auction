  <template>
    <div class="menu-container p-3 border rounded-md flex space-x-10">
      <!-- Первая колонка: категории -->
      <div class="categories flex flex-col items-start space-y-1 w-1/3 mr-10 border-r">
        <div v-for="(category, catIndex) in categories" :key="catIndex" class="category cursor-pointer">
          <template v-if="category.subcategories?.length">
            <p class="rounded-md py-1 px-2 hover:bg-gray-200 text-[16px] font-medium" @click="toggleCategory(catIndex)">
              {{ category.name }}
            </p>
          </template>
          <template v-else>
            <NuxtLink :to="category.link" class="rounded-md py-1 px-2 hover:bg-gray-200 text-[16px] font-medium"
              @click="toggleCategory(catIndex)">
              {{ category.name }}
            </NuxtLink>
          </template>
        </div>
      </div>

      <div v-if="activeCategory !== null"
        class="subcategories flex flex-col items-start space-y-2 w-1/3 border-r mr-10">

        <div v-for="(subCategory, subIndex) in categories[activeCategory].subcategories" :key="subIndex"
          class="subCategory cursor-pointer">

          <template v-if="subCategory.subcategories?.length">
            <p class="rounded-md py-1 px-2 hover:bg-gray-200 text-[16px]" @click="toggleSubcategory(subIndex)">
              {{ subCategory.name }}
            </p>
          </template>

          <template v-else>
            <NuxtLink :to="subCategory.link" class="rounded-md py-1 px-2 hover:bg-gray-200 text-[16px]"
              @click="toggleSubcategory(subIndex)">
              {{ subCategory.name }}
            </NuxtLink>
          </template>

        </div>
      </div>

      <div
        v-if="activeSubcategory !== null && categories[activeCategory].subcategories[activeSubcategory].subcategories.length"
        class="subSubCategories flex flex-col items-start space-y-2 w-1/3">
        <div
          v-for="(subSubCategory, subSubIndex) in categories[activeCategory].subcategories[activeSubcategory].subcategories"
          :key="subSubIndex" class="cursor-pointer">
          <NuxtLink :to="subSubCategory.link" class="rounded-md py-1 px-2 hover:bg-gray-200 text-[16px] ">
            {{ subSubCategory.name }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </template>
<script setup lang="ts">
import { ref } from 'vue';
import { useCategoryStore } from '~/storage/partitionState';
import { storeToRefs } from 'pinia';

const store = useCategoryStore();
const categories = ref(store.categories)


const toggleCategory = (index: number) => {
  activeCategory.value = activeCategory.value === index ? null : index;
  activeSubcategory.value = null;
};

const toggleSubcategory = (index: number) => {
  activeSubcategory.value = activeSubcategory.value === index ? null : index;
};



const activeCategory = ref<number | null>(1);
const activeSubcategory = ref<number | null>(1);
</script>
<style scoped>
.menu-container {
  max-width: 100%;
}

.category {
  position: relative;
}

.subcategories {
  position: relative;
}

.subSubCategory {
  display: flex;
  flex-direction: column;
}
</style>