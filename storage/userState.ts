import axios from "axios";
import { defineStore } from "pinia";

const baseUrl = "http://a-baits.com.ua/";

export const useUserStore = defineStore('userStore', {
    state: () => ({
        user: {
            email: '',
            id: '',
            username: ''
        }
    }),
    actions: {
        async getUser() {
            const token = localStorage.getItem('auth_token');
            if (!token) return;

            try {
                const response = await axios.get("http://localhost:3000/api/authentificate/" + token);

                console.log("Ответ API:", response.data); // Отладка

                if (response.data?.success) {
                    this.user = {
                        id: response.data.user.id,
                        username: response.data.user.username,
                        email: response.data.user.email
                    };
                    console.log("Пользователь загружен:", this.user);
                } else {
                    console.error("Ошибка: Некорректный ответ API", response.data);
                }
            } catch (err) {
                console.error("Ошибка при выполнении запроса:", err);
            }
        }
    }
});
