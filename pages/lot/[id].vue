//pages/active-lots/[id].vue
<script setup>
// Import axios
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue';
import axios from 'axios';
import { useUserStore } from '~/storage/userState';

const store = useUserStore();
// Route
const route = useRoute()
const lotId = route.params.id

// Use toast instead of UNotification
const toast = useToast()

// State
const lot = ref(null)
const isLoading = ref(true)
const error = ref(null)
const currentImageIndex = ref(0)
const bidAmount = ref('')
const newComment = ref('')
const isInWishlist = ref(false)
const hasMoreComments = ref(true)
const isProcessingBid = ref(false)
const isProcessingWishlist = ref(false)
const bidError = ref('')
const wishlistMessage = ref({ text: '', type: '' })
const commentsPage = ref(1)
const commentsLimit = 5
const isLoadingMoreComments = ref(false)
const isBidModalOpen = ref(false);
const isBlitzModalOpen = ref(false);
const userBidAmount = ref(0); // Значение будет установлено при открытии модального окна

// Функции для управления модальным окном ставки
const openBidConfirmation = (bidAmount) => {
  userBidAmount.value = bidAmount;
  isBidModalOpen.value = true;
};

const closeBidModal = () => {
  isBidModalOpen.value = false;
};
const openBlitzConfirmation = () => {
  isBlitzModalOpen.value = true;
};

const closeBlitzModal = () => {
  isBlitzModalOpen.value = false;
};
// Функция для выполнения подтверждения ставки
const confirmBid = async () => {
  isLoading.value = true;
  
  try {
    // Запрос к API для размещения ставки
    const response = await fetch(`http://38.180.227.189:9000/api/lots/${lot.value._id}/bid`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken.value}` // Предполагается, что у вас есть токен пользователя
      },
      body: JSON.stringify({
        amount: userBidAmount.value
      })
    });
    
    // Проверка ответа
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Помилка при розміщенні ставки');
    }
    
    // Обработка успешного размещения ставки
    const data = await response.json();
    
    // Обновление локальных данных лота
    lot.value.currentPrice = userBidAmount.value;
    lot.value.lastBid = {
      amount: userBidAmount.value,
      bidder: userProfile.value?._id, // Предполагается, что у вас есть профиль пользователя
      createdAt: new Date().toISOString()
    };
    
    // Закрытие модального окна
    closeBidModal();
    
    // Показать уведомление об успехе (можно использовать глобальный стор или эмит события)
    useNotification().success({
      title: 'Ставка прийнята',
      text: `Ваша ставка у розмірі ${userBidAmount.value} ₴ успішно розміщена!`
    });
    
    // Возможно обновление истории ставок, если она отображается на странице
    if (typeof fetchBidHistory === 'function') {
      fetchBidHistory();
    }
  } catch (error) {
    console.error('Помилка при підтвердженні ставки:', error);
    
    // Показать уведомление об ошибке
    useNotification().error({
      title: 'Помилка',
      text: error.message || 'Не вдалося розмістити ставку. Спробуйте ще раз.'
    });
  } finally {
    isLoading.value = false;
  }
};

// Функция для выполнения блиц-покупки
const confirmBlitzPurchase = async () => {
  isLoading.value = true;
  
  try {
    // Запрос к API для блиц-покупки
    const response = await fetch(`http://38.180.227.189:9000/api/lots/${lot.value._id}/buy-now`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken.value}` // Предполагается, что у вас есть токен пользователя
      }
    });
    
    // Проверка ответа
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Помилка при блиц-купівлі');
    }
    
    // Обработка успешной блиц-покупки
    const data = await response.json();
    
    // Закрытие модального окна
    closeBlitzModal();
    
    // Показать уведомление об успехе
    useNotification().success({
      title: 'Блиц-купівля виконана',
      text: `Ви успішно придбали лот "${lot.value.title}" за ${lot.value.blitzPrice} ₴!`
    });
    
    // Перенаправление на страницу успешной покупки или страницу заказов
    navigateTo('/clientarea/orders');
    
  } catch (error) {
    console.error('Помилка при блиц-купівлі:', error);
    
    // Показать уведомление об ошибке
    useNotification().error({
      title: 'Помилка',
      text: error.message || 'Не вдалося виконати блиц-купівлю. Спробуйте ще раз.'
    });
  } finally {
    isLoading.value = false;
  }
};
// Сохранение текущего пользователя
const currentUser = ref(null)

// Configure axios globally to include the token in all requests
const fetchCurrentUser = async () => {
    try {
        const auth_token = localStorage.getItem('auth_token');

        const { data } = await axios.get('http://38.180.227.189:9000/api/auth/me', {
            headers: {
                'Authorization': `Bearer ${auth_token}`
            }
        });
        console.log(data.data);

        if (data) {
            currentUser.value = data.data;

            // Проверяем, находится ли лот в избранном
            if (currentUser.value && lotId) {
                checkIsInWishlist();
            }
        }
    } catch (e) {
        console.error('Ошибка при получении данных пользователя:', e);
    }
}

// Функция для проверки, находится ли лот в избранном
const checkIsInWishlist = async () => {
    if (!currentUser.value || !lotId) return;

    const token = localStorage.getItem('auth_token')

    try {
        const { data } = await axios.get(`http://38.180.227.189:9000/api/users/favorites/check/${lotId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        isInWishlist.value = data?.isInWishlist || false;
    } catch (e) {
        console.error('Ошибка при проверке избранного:', e);
    }
}
// For reviews
const reviewRating = ref(0)
const reviewComment = ref('')
const reviewError = ref('')
const isSubmittingReview = ref(false)
const isProcessingPromotion = ref(false)

// Function to submit a review
const submitReview = async () => {
    if (!currentUser.value) {
        toast.add({
            color: 'red',
            title: 'Помилка',
            description: 'Необхідно авторизуватися для додавання відгуку',
            timeout: 3000
        });
        return;
    }

    if (!reviewRating.value) {
        reviewError.value = 'Оберіть оцінку від 1 до 5';
        return;
    }

    if (!reviewComment.value.trim()) {
        reviewError.value = 'Введіть текст відгуку';
        return;
    }

    try {
        isSubmittingReview.value = true;
        reviewError.value = '';

        const auth_token = localStorage.getItem('auth_token');

        const response = await axios.post(`http://38.180.227.189:9000/api/lots/reviews/${lotId}`, {
            rating: reviewRating.value,
            comment: reviewComment.value.trim()
        }, {
            headers: {
                'Authorization': `Bearer ${auth_token}`
            }
        });

        if (response.data.success) {
            // Reset form
            reviewRating.value = 0;
            reviewComment.value = '';

            // Refresh lot data to show the new review
            await fetchLot();

            toast.add({
                color: 'green',
                title: 'Відгук додано',
                description: 'Ваш відгук успішно опубліковано',
                timeout: 3000
            });
        } else {
            reviewError.value = response.data.message || 'Помилка при додаванні відгуку';
        }
    } catch (e) {
        reviewError.value = e.response?.data?.message || e.message || 'Помилка при додаванні відгуку';
        console.error('Помилка при додаванні відгуку:', e);
    } finally {
        isSubmittingReview.value = false;
    }
};
// Fetch lot data
const fetchLot = async () => {
    try {
        isLoading.value = true;
        const response = await axios.get(`http://38.180.227.189:9000/api/lots/${lotId}`, {
            params: {
                incrementViews: true  // Увеличиваем счетчик просмотров
            }
        });

        if (!response.data) {
            throw new Error(response.data?.message || 'Лот не знайдено');
        }

        const lotData = response.data;

        lot.value = {
            ...lotData,
            images: lotData.photos?.map(photo => photo.url) || [],
            currentPrice: lotData.currentPrice || lotData.startPrice,
            minBidIncrement: lotData.bidStep || (lotData.startPrice * 0.1),
            bidsCount: lotData.bids?.length || 0,
            wishlistCount: lotData.favoritesCount || 0,
            timeLeft: getFormattedTimeLeft(lotData.timeLeft),
            comments: lotData.comments || [],
            seller: lotData.seller || {}
        };

        // Обновляем сумму ставки по умолчанию
        updateDefaultBidAmount();
    } catch (e) {
        error.value = e.message;
        console.error('Ошибка при загрузке лота:', e);
    } finally {
        isLoading.value = false;
    }
}

// Обновление лота в реальном времени (можно добавить для веб-сокетов)
const startRealTimeUpdates = () => {
    // Здесь можно реализовать подписку на обновления через сокеты
    // На данный момент будем просто периодически обновлять данные
    const interval = setInterval(async () => {
        if (!lotId || error.value) {
            clearInterval(interval);
            return;
        }

        try {
            const response = await axios.get(`/api/lots/${lotId}`, {
                params: {
                    incrementViews: false  // Не увеличиваем счетчик просмотров при обновлении
                }
            });

            if (!response.data || !response.data.success) {
                throw new Error(response.data?.message || 'Лот не знайдено');
            }

            const lotData = response.data.data;

            // Обновляем только изменяемые данные, сохраняя текущий индекс изображения
            lot.value = {
                ...lotData,
                images: lotData.photos?.map(photo => photo.url) || [],
                currentPrice: lotData.currentPrice || lotData.startPrice,
                minBidIncrement: lotData.bidStep || (lotData.startPrice * 0.1),
                bidsCount: lotData.bids?.length || 0,
                wishlistCount: lotData.favoritesCount || 0,
                timeLeft: getFormattedTimeLeft(lotData.timeLeft),
                comments: lotData.comments || [],
                seller: lotData.seller || {}
            };

            // Обновляем сумму ставки, если изменилась текущая цена
            updateDefaultBidAmount();
        } catch (e) {
            console.error('Ошибка при обновлении данных лота:', e);
        }
    }, 30000); // Обновляем каждые 30 секунд

    // Очищаем интервал при размонтировании компонента
    onBeforeUnmount(() => {
        clearInterval(interval);
    });
}

// Устанавливаем дефолтную сумму ставки (текущая цена + минимальный шаг)
const updateDefaultBidAmount = () => {
    if (lot.value) {
        bidAmount.value = (lot.value.currentPrice + lot.value.minBidIncrement).toString();
    }
}

// Форматирование оставшегося времени
const getFormattedTimeLeft = (timeLeftData) => {
    if (!timeLeftData) return 'Аукцион завершен';

    const { days, hours, minutes, seconds } = timeLeftData;

    if (days > 0) {
        return `${days} д ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// Вычисляемые свойства
const selectedImage = computed(() => {
    if (!lot.value || !lot.value.images || lot.value.images.length === 0) return '';
    return lot.value.images[currentImageIndex.value];
})

const timeLeft = computed(() => {
    if (!lot.value?.timeLeft) return 'Аукцион завершен';
    return lot.value.timeLeft;
})
// Add this to your script setup section

// Create a ref for the formatted time left
const formattedTimeLeft = ref('');

// Create a function that calculates and formats the remaining time
const calculateTimeLeft = () => {
    if (!lot.value || !lot.value.endDate) {
        formattedTimeLeft.value = 'Аукцион завершен';
        return;
    }

    const now = new Date();
    const endTime = new Date(lot.value.endDate);
    const diff = endTime - now;

    if (diff <= 0) {
        formattedTimeLeft.value = 'Аукцион завершен';
        // Update the auction ended status
        if (!isAuctionEnded.value) {
            fetchLot(); // Refresh the lot data to get the final state
        }
        return;
    }

    // Calculate days, hours, minutes, seconds
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // Format the time string
    if (days > 0) {
        formattedTimeLeft.value = `${days} д ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
        formattedTimeLeft.value = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
};

// Create an interval for updating the timer
let countdownInterval = null;

// Function to start the countdown timer
const startCountdown = () => {
    // Clear any existing interval first
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    // Calculate time immediately
    calculateTimeLeft();

    // Then set up the interval to update every second
    countdownInterval = setInterval(() => {
        calculateTimeLeft();
    }, 1000);
};

// Update onMounted to start the countdown
onMounted(() => {
    fetchLot();
    fetchCurrentUser();
    startRealTimeUpdates();
    startCountdown(); // Start the countdown
});

// Clear the interval when the component is unmounted
onBeforeUnmount(() => {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
});

// Watch for changes in lot data and restart the countdown
watch(() => lot.value, (newLot) => {
    if (newLot) {
        startCountdown();
    }
});

// Replace the computed timeLeft property with the ref
// const timeLeft = computed(() => {
//   if (!lot.value?.timeLeft) return 'Аукцион завершен';
//   return lot.value.timeLeft;
// });

// Update the isAuctionEnded computed property to use the current time
const isAuctionEnded = computed(() => {
    if (!lot.value?.endDate) return true;
    const now = new Date();
    const endTime = new Date(lot.value.endDate);
    return now >= endTime;
});

const isOwner = computed(() => {
    if (!currentUser.value || !lot.value) return false;
    return currentUser.value._id === lot.value.seller._id;
})

const nextBidAmount = computed(() => {
    if (!lot.value) return 0;
    return lot.value.currentPrice + lot.value.minBidIncrement;
})

// Методы
const formatDateTime = (date) => {
    return new Date(date).toLocaleDateString('uk-UA', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('uk-UA', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

const formatPrice = (price) => {
    if (!price) return '0';
    return price.toLocaleString('uk-UA');
}

const selectImage = (index) => {
    currentImageIndex.value = index;
}

const previousImage = () => {
    if (currentImageIndex.value > 0) {
        currentImageIndex.value--;
    }
}

const nextImage = () => {
    if (lot.value && currentImageIndex.value < lot.value.images.length - 1) {
        currentImageIndex.value++;
    }
}

// Функция для размещения ставки
// Функция для размещения ставки
const placeBid = async () => {
    if (!currentUser.value) {
        bidError.value = 'Необходимо авторизоваться для участия в торгах';
        return;
    }

    if (isOwner.value) {
        bidError.value = 'Вы не можете делать ставки на собственный лот';
        return;
    }

    if (isAuctionEnded.value) {
        bidError.value = 'Аукцион завершен';
        return;
    }

    if (!bidAmount.value || parseFloat(bidAmount.value) < nextBidAmount.value) {
        bidError.value = `Минимальная ставка должна быть ${formatPrice(nextBidAmount.value)} грн`;
        return;
    }

    // Сбрасываем сообщение об ошибке
    bidError.value = '';

    // Используем Toast с кнопками для подтверждения ставки
    toast.add({
        color: 'yellow',
        title: 'Підтвердження ставки',
        description: `Ви дійсно хочете зробити ставку ${formatPrice(bidAmount.value)} грн на цей лот?`,
        timeout: 10000, // Увеличенное время для принятия решения
        actions: [
            {
                label: 'Так, зробити ставку',
                click: async () => {
                    try {
                        isProcessingBid.value = true;

                        const response = await axios.post(`http://38.180.227.189:9000/api/lots/bid/${lotId}`, {
                            amount: parseFloat(bidAmount.value)
                        }, {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                            }
                        });

                        if (response.data.success) {
                            // Обновляем данные лота
                            await fetchLot();

                            // Показываем сообщение об успехе
                            toast.add({
                                color: 'green',
                                title: 'Ставка розміщена',
                                description: `Ви успішно зробили ставку`,
                                timeout: 3000
                            });
                        } else {
                            bidError.value = response.data.message || 'Ошибка при размещении ставки';

                            toast.add({
                                color: 'red',
                                title: 'Помилка',
                                description: response.data.message || 'Помилка при розміщенні ставки',
                                timeout: 3000
                            });
                        }
                    } catch (e) {
                        bidError.value = e.response?.data?.message || e.message || 'Ошибка при размещении ставки';

                        toast.add({
                            color: 'red',
                            title: 'Помилка',
                            description: e.response?.data?.message || e.message || 'Помилка при розміщенні ставки',
                            timeout: 3000
                        });

                        console.error('Ошибка при размещении ставки:', e);
                    } finally {
                        isProcessingBid.value = false;
                    }
                }
            },
            {
                label: 'Відмінити',
                click: () => {
                    // Просто закрываем toast
                }
            }
        ]
    });
}

// Функция для покупки по блиц-цене
// Функция для покупки по блиц-цене
// Функция для покупки по блиц-цене
const buyNow = async () => {
    if (!currentUser.value) {
        toast.add({
            color: 'red',
            title: 'Помилка',
            description: 'Необхідно авторизуватися для покупки',
            timeout: 3000
        });
        return;
    }

    if (isOwner.value) {
        toast.add({
            color: 'red',
            title: 'Помилка',
            description: 'Ви не можете купити власний лот',
            timeout: 3000
        });
        return;
    }

    if (isAuctionEnded.value) {
        toast.add({
            color: 'red',
            title: 'Помилка',
            description: 'Аукціон завершений',
            timeout: 3000
        });
        return;
    }

    // Используем Toast с кнопками для подтверждения покупки

    const token = localStorage.getItem('auth_token')

    toast.add({
        color: 'yellow',
        title: 'Підтвердження покупки',
        description: `Ви дійсно хочете купити цей лот за ${formatPrice(lot.value.blitzPrice)} грн?`,
        timeout: 10000, // Увеличенное время для принятия решения
        actions: [
            {
                label: 'Так, купити',
                click: async () => {
                    try {
                        isProcessingBid.value = true;

                        const response = await axios.post(`http://38.180.227.189:9000/api/lots/buy-blitz/${lotId}`,
                            {}, // пустой объект данных, если нет тела запроса
                            {
                                headers: {
                                    'Authorization': `Bearer ${token}`
                                }
                            }
                        );

                        if (response.status === 200) {
                            // Обновляем данные лота
                            await fetchLot();

                            // Показываем сообщение об успехе
                            toast.add({
                                color: 'green',
                                title: 'Покупка успішна',
                                description: 'Ви успішно придбали лот.',
                                timeout: 5000
                            });
                            location.href = '/clientarea/chat'

                            // Перенаправляем на страницу сделки
                            if (response.data.dealId) {
                                navigateTo(`/deals/${response.data.dealId}`);
                            }
                        } else {
                            toast.add({
                                color: 'red',
                                title: 'Помилка',
                                description: response.data.message || 'Помилка при купівлі лота',
                                timeout: 3000
                            });
                        }
                    } catch (err) {
                        toast.add({
                            color: 'red',
                            title: 'Помилка',
                            description: err.response?.data?.message || err.message || 'Помилка при купівлі лота',
                            timeout: 3000
                        });
                        console.error('Ошибка при покупке лота:', err);
                    } finally {
                        isProcessingBid.value = false;
                    }
                }
            },
            {
                label: 'Відмінити',
                click: () => {
                    // Просто закрываем toast
                }
            }
        ]
    });
}
const promoteLot = () => {
    const toast = useToast();

    if (!currentUser.value) {
        toast.add({
            color: 'red',
            title: 'Помилка',
            description: 'Необхідно авторизуватися для просування лота',
            timeout: 3000
        });
        return;
    }

    if (!isOwner.value) {
        toast.add({
            color: 'red',
            title: 'Помилка',
            description: 'Ви можете просувати тільки власні лоти',
            timeout: 3000
        });
        return;
    }

    const token = localStorage.getItem('auth_token');

    // Показываем тост с подтверждением оплаты
    toast.add({
        color: 'yellow',
        title: 'Підтвердження просування',
        description: 'Просування лота коштує 100 грн. З вашого балансу буде знято цю суму. Продовжити?',
        timeout: 10000,
        actions: [
            {
                label: 'Так, сплатити',
                click: async () => {
                    try {
                        isProcessingPromotion.value = true;

                        const response = await axios.post(`http://38.180.227.189:9000/api/lots/promote/${lotId}`,
                            {
                                duration: 7 // По умолчанию продвижение на 7 дней
                            },
                            {
                                headers: {
                                    'Authorization': `Bearer ${token}`
                                }
                            }
                        );

                        if (response.data.success) {
                            // Обновляем данные лота
                            await fetchLot();

                            // Показываем сообщение об успешном продвижении
                            toast.add({
                                color: 'green',
                                title: 'Просування активовано',
                                description: 'Ваш лот успішно просувається! Він буде показуватися в спеціальних розділах протягом 7 днів.',
                                timeout: 5000
                            });
                        } else {
                            toast.add({
                                color: 'red',
                                title: 'Помилка',
                                description: response.data.message || 'Помилка при просуванні лота',
                                timeout: 3000
                            });
                        }
                    } catch (err) {
                        // Обработка ошибок, включая недостаточно средств
                        let errorMessage = 'Помилка при просуванні лота';

                        if (err.response?.data?.message) {
                            if (err.response.data.message.includes('Недостаточно средств')) {
                                errorMessage = 'Недостатньо коштів на балансі для просування лота';
                            } else {
                                errorMessage = err.response.data.message;
                            }
                        }

                        toast.add({
                            color: 'red',
                            title: 'Помилка',
                            description: errorMessage,
                            timeout: 3000
                        });
                        console.error('Ошибка при продвижении лота:', err);
                    } finally {
                        isProcessingPromotion.value = false;
                    }
                }
            },
            {
                label: 'Відмінити',
                click: () => {
                    // Закрываем тост при отмене
                }
            }
        ]
    });
};
// Функция для добавления/удаления из избранного
const toggleWishlist = async () => {
    if (!currentUser.value) {
        toast.add({
            color: 'red',
            title: 'Помилка',
            description: 'Необхідно авторизуватися для додавання в обрані',
            timeout: 3000
        });
        return;
    }

    try {
        isProcessingWishlist.value = true;
        const auth_token = localStorage.getItem('auth_token');

        const response = await axios.post('http://38.180.227.189:9000/api/users/favorites', {
            lotId: lotId,
            action: isInWishlist.value ? 'remove' : 'add'
        },
            {
                headers: {
                    'Authorization': `Bearer ${auth_token}`
                }
            });

        if (response.data.success) {
            // Обновляем состояние
            isInWishlist.value = !isInWishlist.value;

            // Обновляем счетчик избранного
            if (isInWishlist.value) {
                lot.value.wishlistCount = (lot.value.wishlistCount || 0) + 1;
            } else {
                lot.value.wishlistCount = Math.max(0, (lot.value.wishlistCount || 0) - 1);
            }

            // Показываем сообщение
            toast.add({
                color: 'green',
                title: isInWishlist.value ? 'Додано до обраного' : 'Видалено з обраного',
                description: isInWishlist.value
                    ? 'Лот успішно додано до обраного'
                    : 'Лот успішно видалено з обраного',
                timeout: 2000
            });
        } else {
            toast.add({
                color: 'red',
                title: 'Помилка',
                description: response.data.message || 'Не вдалося оновити обрані',
                timeout: 3000
            });
        }
    } catch (e) {
        toast.add({
            color: 'red',
            title: 'Помилка',
            description: e.response?.data?.message || e.message || 'Не вдалося оновити обрані',
            timeout: 3000
        });
        console.error('Ошибка при обновлении избранного:', e);
    } finally {
        isProcessingWishlist.value = false;
    }
}

// Функция для добавления комментария
const addComment = async () => {
    if (!currentUser.value) {
        toast.add({
            color: 'red',
            title: 'Помилка',
            description: 'Необхідно авторизуватися для додавання коментаря',
            timeout: 3000
        });
        return;
    }

    if (!newComment.value.trim()) {
        toast.add({
            color: 'red',
            title: 'Помилка',
            description: 'Введіть текст коментаря',
            timeout: 3000
        });
        return;
    }

    try {
        const response = await axios.post('/api/lots/comment', {
            lotId: lotId,
            text: newComment.value.trim()
        });

        if (response.data.success) {
            // Очищаем поле ввода
            newComment.value = '';

            // Обновляем список комментариев
            await fetchLot();

            toast.add({
                color: 'green',
                title: 'Коментар додано',
                description: 'Ваш коментар успішно опубліковано',
                timeout: 2000
            });
        } else {
            toast.add({
                color: 'red',
                title: 'Помилка',
                description: response.data.message || 'Не вдалося додати коментар',
                timeout: 3000
            });
        }
    } catch (e) {
        toast.add({
            color: 'red',
            title: 'Помилка',
            description: e.response?.data?.message || e.message || 'Не вдалося додати коментар',
            timeout: 3000
        });
        console.error('Ошибка при добавлении комментария:', e);
    }
}

// Функция загрузки дополнительных комментариев
const loadMoreComments = async () => {
    if (!lot.value || isLoadingMoreComments.value) return;

    try {
        isLoadingMoreComments.value = true;
        commentsPage.value += 1;

        const response = await axios.get(`/api/lots/${lotId}/comments`, {
            params: {
                page: commentsPage.value,
                limit: commentsLimit
            }
        });

        if (response.data?.success) {
            const newComments = response.data.data;

            if (newComments && newComments.length > 0) {
                lot.value.comments = [...lot.value.comments, ...newComments];
            }

            // Проверяем, есть ли еще комментарии
            hasMoreComments.value = newComments.length === commentsLimit;
        } else {
            hasMoreComments.value = false;
        }
    } catch (e) {
        console.error('Ошибка при загрузке комментариев:', e);
        hasMoreComments.value = false;
    } finally {
        isLoadingMoreComments.value = false;
    }
}

// Reloading when lot id changes
watch(() => route.params.id, (newId) => {
    if (newId) {
        lotId.value = newId;
        fetchLot();
        fetchCurrentUser();
    }
});

// Загрузка данных при монтировании
onMounted(() => {
    fetchLot();
    fetchCurrentUser();
    startRealTimeUpdates();
});
</script>
<template>
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center min-h-screen">
        <UIcon name="i-heroicons-arrow-path-20-solid" class="w-8 h-8 animate-spin" />
    </div>

    <!-- Error State -->
    <UAlert v-else-if="error" color="red" :title="error" class="m-4" />

    <!-- Content -->
    <div v-else-if="lot" class="max-w-[1600px] mx-auto p-2 sm:p-4">
        <!-- Breadcrumbs -->
        <div class="mb-4 sm:mb-6 overflow-x-auto">
            <UBreadcrumb :links="[
                { label: '', icon: 'i-heroicons-home', to: '/' },
                { label: lot.partition?.name || 'Категория', to: `/lots/${lot.partition?._id}` },
                { label: lot.title }
            ]" class="min-w-max" />
        </div>

        <!-- Auction Ended Alert -->
        <UAlert v-if="isAuctionEnded" color="red" title="Аукцион завершен" class="mb-4">
            Торги по данному лоту завершены.
        </UAlert>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
            <!-- Left Column - Images -->
            <div class="lg:col-span-7 order-1">
                <!-- Main Image -->
                <div class="relative mb-4">
                    <img :src="`http://38.180.227.189:9000${selectedImage}`" :alt="lot.title"
                        class="w-full aspect-square object-cover rounded-lg max-h-[600px]" />
                    <div class="absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2">
                        <UButton icon="i-heroicons-chevron-left" color="white" variant="ghost"
                            class="bg-black/30 hover:bg-black/50" :disabled="currentImageIndex === 0"
                            @click="previousImage" />
                    </div>
                    <div class="absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2">
                        <UButton icon="i-heroicons-chevron-right" color="white" variant="ghost"
                            class="bg-black/30 hover:bg-black/50"
                            :disabled="currentImageIndex === lot.images.length - 1" @click="nextImage" />
                    </div>
                </div>

                <!-- Thumbnails -->
                <div class="relative" v-if="lot.images && lot.images.length > 1">
                    <div
                        class="flex gap-2 overflow-x-auto pb-2 pt-2 pl-2 sm:pl-4 scrollbar-thin scrollbar-thumb-gray-300">
                        <UButton v-for="(image, index) in lot.images" :key="index" variant="ghost"
                            class="p-0 min-w-[80px] sm:min-w-[100px] shrink-0"
                            :class="{ 'ring-2 ring-primary-500': currentImageIndex === index }"
                            @click="selectImage(index)">
                            <img :src="`http://38.180.227.189:9000${image}`"
                                :alt="`${lot.title} - изображение ${index + 1}`"
                                class="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] object-cover rounded" />
                        </UButton>
                    </div>
                </div>

                <!-- Description -->
                <UCard class="mt-4 lg:block hidden">
                    <template #header>
                        <h2 class="text-lg font-semibold">Опис</h2>
                    </template>

                    <div class="space-y-4">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <span class="text-sm text-gray-600">Місцезнаходження:</span>
                                <p class="text-sm sm:text-base">{{ lot.location }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-600">Стан:</span>
                                <p class="text-sm sm:text-base">{{ lot.quality }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-600">Доставка:</span>
                                <p class="text-sm sm:text-base">
                                    <span v-if="Array.isArray(lot.delivery)">
                                        {{ lot.delivery.join(', ') }}
                                    </span>
                                    <span v-else>{{ lot.delivery }}</span>
                                </p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-600">Оплата:</span>
                                <p class="text-sm sm:text-base">
                                    <span v-if="Array.isArray(lot.payment)">
                                        {{ lot.payment.join(', ') }}
                                    </span>
                                    <span v-else>{{ lot.payment }}</span>
                                </p>
                            </div>
                        </div>

                        <div>
                            <span class="text-sm text-gray-600">Опис:</span>
                            <p class="whitespace-pre-line text-sm sm:text-base mt-1">{{ lot.description }}</p>
                        </div>
                    </div>
                </UCard>

                <!-- Comments -->
                <!-- Reviews Section - Add this after the Comments section in your template -->
                <UCard class="mt-4 lg:block hidden">
                    <template #header>
                        <h2 class="text-lg font-semibold">Відгуки</h2>
                    </template>

                    <!-- Review Form -->
                    <div class="mb-6">
                        <h3 class="text-base font-medium mb-3">Додати відгук</h3>

                        <!-- Star Rating -->
                        <div class="mb-3">
                            <span class="text-sm text-gray-600 mb-1 block">Оцінка:</span>
                            <div class="flex items-center">
                                <template v-for="i in 5" :key="i">
                                    <UButton color="yellow" variant="ghost" icon="i-heroicons-star"
                                        :class="{ 'text-yellow-500': i <= reviewRating, 'text-gray-300': i > reviewRating }"
                                        @click="reviewRating = i" class="p-1 sm:p-2" />
                                </template>
                                <span class="ml-2 text-sm text-gray-600" v-if="reviewRating > 0">{{ reviewRating }} з
                                    5</span>
                            </div>
                        </div>

                        <!-- Review Text -->
                        <UTextarea v-model="reviewComment" placeholder="Напишіть свій відгук про лот або продавця"
                            rows="3" class="text-sm sm:text-base" />

                        <p v-if="reviewError" class="text-red-500 text-sm mt-1">{{ reviewError }}</p>

                        <div class="flex justify-end mt-2">
                            <UButton color="primary" class="text-sm sm:text-base" @click="submitReview"
                                :loading="isSubmittingReview"
                                :disabled="!reviewComment.trim() || !reviewRating || !currentUser">
                                Опублікувати відгук
                            </UButton>
                        </div>
                    </div>

                    <!-- Reviews List -->
                    <div class="space-y-6" v-if="lot.reviews && lot.reviews.length > 0">
                        <div v-for="review in lot.reviews" :key="review._id"
                            class="flex gap-2 sm:gap-4 border-b border-gray-100 pb-4">
                            <UAvatar :src="review.user?.avatar" :alt="review.user?.username" size="md"
                                class="sm:hidden" />
                            <UAvatar :src="review.user?.avatar" :alt="review.user?.username" size="lg"
                                class="hidden sm:block" />
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-2 flex-wrap">
                                    <span class="font-medium text-sm sm:text-base">{{ review.user?.username }}</span>
                                    <div class="flex items-center">
                                        <template v-for="i in 5" :key="i">
                                            <UIcon name="i-heroicons-star" class="w-4 h-4"
                                                :class="{ 'text-yellow-500': i <= review.rating, 'text-gray-300': i > review.rating }" />
                                        </template>
                                        <span class="ml-1 text-sm text-gray-600">{{ review.rating }}.0</span>
                                    </div>
                                </div>
                                <p class="mt-2 text-sm sm:text-base">{{ review.comment }}</p>
                                <p class="text-xs text-gray-500 mt-1">
                                    {{ formatDateTime(review.createdAt) }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- No Reviews -->
                    <div v-else class="text-center py-4">
                        <p class="text-gray-500">Поки немає відгуків. Будьте першим!</p>
                    </div>
                </UCard>
            </div>

            <!-- Right Column - Info -->
            <div class="lg:col-span-5 order-2">
                <UCard>
                    <h1 class="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">{{ lot.title }}</h1>

                    <!-- Auction Timer -->
                    <div class="mb-4 sm:mb-6">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-sm text-gray-600">Закінчення</span>
                            <span class="text-sm text-gray-600">До закінчення</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-sm sm:text-base">{{ formatDateTime(lot.endDate) }}</span>
                            <span class="font-medium text-red-500 text-sm sm:text-base">{{ formattedTimeLeft }}</span>
                        </div>
                    </div>

                    <!-- Current Price -->
                    <div class="mb-4 sm:mb-6">
                        <div class="flex items-baseline gap-2 mb-1">
                            <span class="text-sm text-gray-600">Поточна ціна</span>
                            <span class="text-xs text-gray-500">({{ lot.bidsCount }} ставок)</span>
                        </div>
                        <div class="text-xl sm:text-2xl font-bold text-primary-500 mb-4">
                            {{ formatPrice(lot.currentPrice) }} грн
                        </div>

                        <!-- Bid Form -->
                        <div class="mb-4" v-if="!isAuctionEnded && !isOwner">
                            <label class="text-sm text-gray-600 mb-1 block">Ваша ставка (мінімум {{
                                formatPrice(nextBidAmount) }}
                                грн)</label>
                            <div class="flex gap-2 items-center">
                                <UInput v-model="bidAmount" type="number" :min="nextBidAmount" class="w-32 sm:w-40" />
                                <span class="text-gray-600">грн</span>
                            </div>
                            <p v-if="bidError" class="text-red-500 text-sm mt-1">{{ bidError }}</p>
                        </div>

                        <UButton v-if="!isAuctionEnded && !isOwner" color="primary" size="lg" block
                            class="text-sm sm:text-base" @click="placeBid" :loading="isProcessingBid"
                            :disabled="!currentUser">
                            Зробити ставку
                        </UButton>

                        <div v-if="isOwner && !isAuctionEnded" class="text-center mt-2">
                            <p class="text-gray-500 text-sm">Это ваш лот. Вы не можете делать ставки на свой лот.</p>
                        </div>
                    </div>

                    <!-- Blitz Price -->
                    <div class="mb-4 sm:mb-6" v-if="lot.blitzPrice">
                        <div class="flex items-baseline gap-2 mb-2">
                            <span class="text-sm text-gray-600">Бліц-ціна</span>
                            <span class="text-xs text-gray-500">(купити зараз)</span>
                        </div>
                        <div class="flex gap-2 sm:gap-4">
                            <UButton color="white" size="lg" class="flex-1 text-sm sm:text-base" @click="buyNow"
                                :disabled="isAuctionEnded || isOwner || !currentUser" :loading="isProcessingBid">
                                {{ formatPrice(lot.blitzPrice) }} грн
                            </UButton>
                            <UButton icon="i-heroicons-heart" color="white" size="lg"
                                :class="{ 'text-red-500': isInWishlist }" @click="toggleWishlist"
                                :loading="isProcessingWishlist" :disabled="!currentUser">
                            </UButton>
                        </div>
                    </div>

                    <!-- Bids History -->
                    <div class="mt-6" v-if="lot.bids && lot.bids.length > 0">
                        <h3 class="text-lg font-semibold mb-3">Історія ставок</h3>
                        <div class="space-y-2 max-h-60 overflow-y-auto pr-1">
                            <div v-for="(bid, index) in [...lot.bids].reverse()" :key="index"
                                class="flex justify-between items-center p-2 rounded bg-gray-50 text-sm">
                                <div class="flex items-center gap-2">
                                    <UAvatar size="xs" :src="bid.user?.avatar" :alt="bid.user?.username" />
                                    <span class="font-medium truncate">{{ bid.user?.username || 'Користувач' }}</span>
                                </div>
                                <div class="text-right">
                                    <div class="font-bold text-primary-500">{{ formatPrice(bid.amount) }} грн</div>
                                    <div class="text-xs text-gray-500">{{ formatDateTime(bid.createdAt) }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </UCard>
                <UCard class="mt-4 lg:hidden block">
                    <template #header>
                        <h2 class="text-lg font-semibold">Опис</h2>
                    </template>

                    <div class="space-y-4">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <span class="text-sm text-gray-600">Місцезнаходження:</span>
                                <p class="text-sm sm:text-base">{{ lot.location }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-600">Стан:</span>
                                <p class="text-sm sm:text-base">{{ lot.quality }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-600">Доставка:</span>
                                <p class="text-sm sm:text-base">
                                    <span v-if="Array.isArray(lot.delivery)">
                                        {{ lot.delivery.join(', ') }}
                                    </span>
                                    <span v-else>{{ lot.delivery }}</span>
                                </p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-600">Оплата:</span>
                                <p class="text-sm sm:text-base">
                                    <span v-if="Array.isArray(lot.payment)">
                                        {{ lot.payment.join(', ') }}
                                    </span>
                                    <span v-else>{{ lot.payment }}</span>
                                </p>
                            </div>
                        </div>

                        <div>
                            <span class="text-sm text-gray-600">Опис:</span>
                            <p class="whitespace-pre-line text-sm sm:text-base mt-1">{{ lot.description }}</p>
                        </div>
                    </div>
                </UCard>

                <!-- Seller Info -->
                <UCard class="mt-4" v-if="lot.seller">
                    <template #header>
                        <h2 class="text-lg font-semibold">Про продавця</h2>
                    </template>

                    <div class="flex items-center gap-4">
                        <UAvatar :src="lot.seller.avatar" :alt="lot.seller.username" size="lg" />
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-2 flex-wrap">
                                <span class="font-medium text-sm sm:text-base">{{ lot.seller.username }}</span>
                                <UBadge v-if="lot.seller.rating" color="yellow">{{ lot.seller.rating }}</UBadge>
                            </div>
                            <div class="text-xs sm:text-sm text-gray-500 mt-1">
                                {{ lot.seller.location
                                    ? `Місцезнаходження: ${lot.seller.location}`
                                    : 'Продавець не вказав місцезнаходження'
                                }}
                            </div>
                        </div>
                    </div>

                    <div class="mt-4">
                        <UButton color="primary" variant="soft" class="text-sm sm:text-base" block
                            @click="navigateTo(`/seller/${lot.seller._id}`)">
                            Всі лоти продавця
                        </UButton>
                    </div>
                </UCard>
                <!-- Comments -->
                <!-- Reviews Section - Add this after the Comments section in your template -->
                <UCard class="mt-4 lg:hidden block">
                    <template #header>
                        <h2 class="text-lg font-semibold">Відгуки</h2>
                    </template>

                    <!-- Review Form -->
                    <div class="mb-6">
                        <h3 class="text-base font-medium mb-3">Додати відгук</h3>

                        <!-- Star Rating -->
                        <div class="mb-3">
                            <span class="text-sm text-gray-600 mb-1 block">Оцінка:</span>
                            <div class="flex items-center">
                                <template v-for="i in 5" :key="i">
                                    <UButton color="yellow" variant="ghost" icon="i-heroicons-star"
                                        :class="{ 'text-yellow-500': i <= reviewRating, 'text-gray-300': i > reviewRating }"
                                        @click="reviewRating = i" class="p-1 sm:p-2" />
                                </template>
                                <span class="ml-2 text-sm text-gray-600" v-if="reviewRating > 0">{{ reviewRating }} з
                                    5</span>
                            </div>
                        </div>

                        <!-- Review Text -->
                        <UTextarea v-model="reviewComment" placeholder="Напишіть свій відгук про лот або продавця"
                            rows="3" class="text-sm sm:text-base" />

                        <p v-if="reviewError" class="text-red-500 text-sm mt-1">{{ reviewError }}</p>

                        <div class="flex justify-end mt-2">
                            <UButton color="primary" class="text-sm sm:text-base" @click="submitReview"
                                :loading="isSubmittingReview"
                                :disabled="!reviewComment.trim() || !reviewRating || !currentUser">
                                Опублікувати відгук
                            </UButton>
                        </div>
                    </div>

                    <!-- Reviews List -->
                    <div class="space-y-6" v-if="lot.reviews && lot.reviews.length > 0">
                        <div v-for="review in lot.reviews" :key="review._id"
                            class="flex gap-2 sm:gap-4 border-b border-gray-100 pb-4">
                            <UAvatar :src="review.user?.avatar" :alt="review.user?.username" size="md"
                                class="sm:hidden" />
                            <UAvatar :src="review.user?.avatar" :alt="review.user?.username" size="lg"
                                class="hidden sm:block" />
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-2 flex-wrap">
                                    <span class="font-medium text-sm sm:text-base">{{ review.user?.username }}</span>
                                    <div class="flex items-center">
                                        <template v-for="i in 5" :key="i">
                                            <UIcon name="i-heroicons-star" class="w-4 h-4"
                                                :class="{ 'text-yellow-500': i <= review.rating, 'text-gray-300': i > review.rating }" />
                                        </template>
                                        <span class="ml-1 text-sm text-gray-600">{{ review.rating }}.0</span>
                                    </div>
                                </div>
                                <p class="mt-2 text-sm sm:text-base">{{ review.comment }}</p>
                                <p class="text-xs text-gray-500 mt-1">
                                    {{ formatDateTime(review.createdAt) }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- No Reviews -->
                    <div v-else class="text-center py-4">
                        <p class="text-gray-500">Поки немає відгуків. Будьте першим!</p>
                    </div>
                </UCard>
                <!-- Similar Lots -->

                <!-- Actions Menu -->
                <UCard class="mt-4" v-if="isOwner">
                    <template #header>
                        <h2 class="text-lg font-semibold">Дії</h2>
                    </template>

                    <div class="space-y-2">
                        <!-- Действия для владельца лота -->
                        <div v-if="isOwner && !isAuctionEnded" class="space-y-2">
                            <UButton color="yellow" variant="soft" block icon="i-heroicons-star" @click="promoteLot">
                                Просувати лот
                            </UButton>
                            <UButton color="red" variant="soft" block icon="i-heroicons-archive-box-x-mark"
                                v-if="lot.bids && lot.bids.length === 0" @click="navigateTo(`/lots/delete/${lotId}`)">
                                Видалити лот
                            </UButton>
                        </div>
                    </div>
                </UCard>
            </div>
        </div>
    </div>
</template>
