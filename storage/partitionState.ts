import axios from "axios";
import { defineStore } from "pinia";

const baseUrl = "http://38.180.227.189:9000/api/partitions";

export const useCategoryStore = defineStore("categoryStore", {
    state: () => ({
        categories: [],
        category: null,
        lots: [],
        isLoading: false,
        error: null
    }),
    actions: {
        /**
         * Загрузка всех категорий
         */
        async fetchCategories() {
            this.isLoading = true;
            this.error = null;

            try {
                // Используем getCatalog для получения всех категорий
                const response = await axios.get(`${baseUrl}?limit=99&parentId=all`);

                if (response.data) {
                    this.categories = response.data.partitions;
                    console.log("Категории загружены:", this.categories);
                } else {
                    throw new Error(response.data.message || "Ошибка при загрузке категорий");
                }
            } catch (err) {
                this.error = err.message || "Ошибка при загрузке категорий";
                console.error("Ошибка при загрузке категорий:", err);
            } finally {
                this.isLoading = false;
            }
        },

        /**
         * Загрузка категории по ID
         */
        async fetchCategoryById(categoryId: string) {
            this.isLoading = true;
            this.error = null;

            try {
                const response = await axios.get(`${baseUrl}/${categoryId}`, {});
                console.log(response.data.partition)
                if (response.data.success) {
                    this.category = response.data.partition;
                    this.lots = response.data.partition.lots;
                    console.log("Категория загружена:", this.category);
                } else {
                    throw new Error(response.data.message || "Категория не найдена");
                }
            } catch (err) {
                this.error = err.message || "Ошибка при загрузке категории";
                console.error("Ошибка при загрузке категории:", err);
            } finally {
                this.isLoading = false;
            }
        },

        /**
         * Загрузка категории по ключу
         */
        async fetchCategoryByKey(key: string) {
            this.isLoading = true;
            this.error = null;

            try {
                const response = await axios.get(`${baseUrl}/by-link/${key}`, {
                    params: { key: `/${key}` }
                });

                if (response.data.success) {
                    this.category = response.data.data;
                    console.log("Категория загружена по ключу:", this.category);
                } else {
                    throw new Error(response.data.message || "Категория не найдена");
                }
            } catch (err) {
                this.error = err.message || "Ошибка при загрузке категории";
                console.error("Ошибка при загрузке категории:", err);
            } finally {
                this.isLoading = false;
            }
        },

        /**
         * Загрузка лотов по ключу категории с фильтрами
         */
        async fetchLotsByCategory(key: string, filters = {}) {
            if (!key) {
                this.error = "Відсутній параметр ключа категорії";
                return;
            }

            this.isLoading = true;
            this.error = null;

            try {
                const response = await axios.get(`${baseUrl}/all`, {
                    params: {
                        key,
                        ...filters
                    }
                });

                if (response.data.success) {
                    this.lots = response.data.data;
                    console.log("Лоты загружены:", this.lots);
                } else {
                    throw new Error(response.data.message || "Лоты не найдены");
                }
            } catch (err) {
                this.error = err.message || "Ошибка при загрузке лотов";
                console.error("Ошибка при загрузке лотов:", err);
            } finally {
                this.isLoading = false;
            }
        },

        /**
         * Сброс данных категории
         */
        resetCategory() {
            this.category = null;
        },

        /**
         * Сброс данных лотов
         */
        resetLots() {
            this.lots = [];
        },

        /**
         * Сброс ошибки
         */
        clearError() {
            this.error = null;
        }
    }
});
