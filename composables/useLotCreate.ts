// composables/useLotCreate.ts
import { ref } from 'vue';
import axios from 'axios';

const baseUrl = 'http://38.180.227.189:9000/api/lots/';

interface LotPhoto {
    url: string;
    order: number;
}

interface LotData {
    title: string;
    startPrice: number;
    blitzPrice: number;
    partition: string;
    quality: string;
    photos: LotPhoto[];
    location: string;
    delivery: string | string[];
    payment: string | string[];
    description: string;
    endDate?: string | Date;
}

/**
 * Обработчик создания нового лота
 */
export const useLotCreate = () => {
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const lotId = ref<string | null>(null);

    /**
     * Загружает фотографии на сервер и возвращает их URL
     */
    /**
     * Загружает фотографии на сервер и возвращает их URL
     */
    const uploadPhotos = async (photoFiles: File[]): Promise<LotPhoto[]> => {
        const processedPhotos: LotPhoto[] = [];

        // Проверка наличия файлов
        if (!photoFiles || photoFiles.length === 0) {
            console.warn('Нет фотографий для загрузки');
            return processedPhotos;
        }

        console.log(`Начинаем загрузку ${photoFiles.length} фотографий`);

        // Получаем токен из localStorage
        const token = localStorage.getItem('auth_token');
        if (!token) {
            throw new Error('Отсутствует токен авторизации');
        }

        // Загружаем каждое фото отдельно
        for (let i = 0; i < photoFiles.length; i++) {
            try {
                const formData = new FormData();
                formData.append('file', photoFiles[i]);

                // Отправляем на сервер с токеном авторизации
                const response = await axios.post('http://38.180.227.189:9000/api/storage', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                });

                const result = response.data;
                console.log(`Результат загрузки фото ${i}:`, result);

                if (!result.success) {
                    throw new Error(result.message || 'Ошибка загрузки фото');
                }

                // Получаем URL загруженного файла
                if (result.files && Array.isArray(result.files) && result.files.length > 0) {
                    const fileData = result.files.find((f: any) => f && f.success);
                    if (fileData && fileData.url) {
                        processedPhotos.push({
                            url: fileData.url,
                            order: i
                        });
                        console.log(`Фото ${i} успешно загружено, URL: ${fileData.url}`);
                    } else {
                        throw new Error('Не удалось получить URL загруженного файла');
                    }
                } else {
                    throw new Error('Неверная структура ответа сервера');
                }
            } catch (e: any) {
                console.error(`Ошибка при загрузке фото ${i}:`, e);
                throw e;
            }
        }

        console.log(`Успешно загружено ${processedPhotos.length} фотографий`);
        return processedPhotos;
    };

    /**
     * Создает новый лот
     */
    const createLot = async (lotData: LotData, photoFiles?: File[]) => {
        isLoading.value = true;
        error.value = null;

        try {
            let photosForSubmit = [...lotData.photos]; // По умолчанию используем то, что уже есть

            // Если переданы файлы фотографий, загружаем их
            if (photoFiles && photoFiles.length > 0) {
                const uploadedPhotos = await uploadPhotos(photoFiles);

                // Объединяем уже имеющиеся URL с новыми загруженными
                if (uploadedPhotos.length > 0) {
                    // Находим максимальный order среди существующих фото
                    const maxOrder = photosForSubmit.length > 0
                        ? Math.max(...photosForSubmit.map(p => p.order))
                        : -1;

                    // Добавляем новые фото с продолжающейся нумерацией
                    const newPhotos = uploadedPhotos.map((photo, idx) => ({
                        url: photo.url,
                        order: maxOrder + 1 + idx
                    }));

                    photosForSubmit = [...photosForSubmit, ...newPhotos];
                }
            }

            // Проверяем наличие фотографий
            if (photosForSubmit.length === 0) {
                throw new Error('Необходимо добавить хотя бы одну фотографию');
            }

            // Обновляем массив фотографий в данных лота
            lotData.photos = photosForSubmit;

            // Устанавливаем дату окончания, если она не указана
            if (!lotData.endDate) {
                const endDate = new Date();
                endDate.setDate(endDate.getDate() + 7); // По умолчанию 7 дней
                lotData.endDate = endDate.toISOString();
            }

            // Обработка массивов доставки и оплаты
            if (!Array.isArray(lotData.delivery)) {
                lotData.delivery = [lotData.delivery];
            }

            if (!Array.isArray(lotData.payment)) {
                lotData.payment = [lotData.payment];
            }

            const token = localStorage.getItem('auth_token');

            // Отправляем запрос на создание лота
            const response = await axios.post(`${baseUrl}create`, lotData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            const result = response.data;

            if (!result) {
                throw new Error(result.message || 'Не удалось создать лот');
            }

            // Сохраняем ID созданного лота
            lotId.value = result.lot?._id || null;
            return result.lot;
        } catch (e: any) {
            // При ошибке axios, извлекаем сообщение из ответа
            if (e.response && e.response.data) {
                error.value = e.response.data.message || `Ошибка: ${e.response.status}`;
            } else {
                error.value = e.message || 'Произошла ошибка при создании лота';
            }
            console.error('Error creating lot:', e);
            throw e;
        } finally {
            isLoading.value = false;
        }
    };

    return {
        isLoading,
        error,
        lotId,
        createLot,
        uploadPhotos
    };
};
