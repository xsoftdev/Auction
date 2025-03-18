import axios from "axios";
import { defineStore } from "pinia";

const baseUrl = "http://38.180.227.189:9000/api";

interface IBalance {
    amount: number;
    currency: string;
    lastUpdated: Date;
}

interface IReview {
    author: string;
    rating: number;
    comment: string;
    createdAt: Date;
}
interface IBalanceHistory {
    amount: number;
    type: 'deposit' | 'purchase' | 'sale';
    description: string;
    createdAt: Date;
}
interface IUser {
    id: string;
    username: string;
    email: string;
    phone: string;
    birthday: string;
    location: string;
    balance: IBalance;
    sellingLots: Array<any>;
    purchasedLots: Array<any>;
    chats: Array<any>;
    reviews: IReview[];
    rating: number;
    balanceHistory: IBalanceHistory[];
}

export const useUserStore = defineStore('userStore', {
    state: () => ({
        user: {
            id: '',
            username: '',
            email: '',
            phone: '',
            birthday: '',
            location: '',
            balance: {
                amount: 0,
                currency: 'UAH',
                lastUpdated: new Date()
            },
            balanceHistory: [],
            sellingLots: [],
            purchasedLots: [],
            chats: [],
            reviews: [],
            rating: 0
        } as IUser
    }),
    actions: {
        async getUser() {
            const token = localStorage.getItem('auth_token');
            if (!token) return;

            try {
                const response = await axios.get(`${baseUrl}/auth/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                console.log("API Response:", response.data);


                const lots1 = await this.getSellingLots();
                const lots2 = await this.getPursharedLots();

                if (response.data?.success) {
                    this.user = {
                        id: response.data.data._id,
                        username: response.data.data.username,
                        email: response.data.data.email,
                        location: response.data.data.location,
                        birthday: response.data.data.birthday,
                        phone: response.data.data.phone,
                        balance: {
                            amount: response.data.data.balance.amount,
                            currency: response.data.data.balance.currency,
                            lastUpdated: new Date(response.data.data.balance.lastUpdated)
                        },
                        balanceHistory: response.data.data.transactions,
                        sellingLots: lots1,
                        purchasedLots: lots2,
                        chats: response.data.data.chats,
                        reviews: response.data.data.reviews,
                        rating: response.data.data.rating
                    };
                    console.log("User loaded:", this.user);
                } else {
                    console.error("Error: Invalid API response", response.data);
                }
            } catch (err) {
                console.error("Request error:", err);
            }
        },
        async getSellingLots() {
            const token = localStorage.getItem('auth_token');
            if (!token) return;

            try {
                const response = await axios.get(`${baseUrl}/users/selling-lots`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                return response.data.data.lots;
            } catch (e) {
                console.error(e);

            }
        },
        async getPursharedLots() {
            const token = localStorage.getItem('auth_token');
            if (!token) return;

            try {
                const response = await axios.get(`${baseUrl}/users/purchased-lots`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                return response.data.data.lots;

                // this.user.sellingLots = response.
            } catch (e) {
                console.error(e);

            }
        }
    }
});
