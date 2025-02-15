import axios from "axios";
import { defineStore } from "pinia";

const baseUrl = "http://localhost:3000/api/partition";

export const useCategoryStore = defineStore("categoryStore", {
    state: () => ({
        categories: [],
        category: null,
    }),
    actions: {
        async fetchCategories() {
            try {
                const response = await axios.get(`${baseUrl}/all`);
                this.categories = response.data;
                console.log("Категории загружены:", this.categories);
            } catch (err) {
                console.error("Ошибка при загрузке категорий:", err);
            }
        },
        async fetchCategoryById(categoryId: string) {
            try {
                const response = await axios.get(`${baseUrl}/${categoryId}`);
                this.category = response.data;
                console.log("Категория загружена:", this.category);
            } catch (err) {
                console.error("Ошибка при загрузке категории:", err);
            }
        }
    }
});
