import { ref } from 'vue';
import {
  fileToBase64,
  urlToBase64,
  base64ToBlob,
  base64ToObjectUrl,
  getBase64ImageSize,
  compressImageToBase64
} from '~/utils/imageToBase64';

/**
 * Composable для работы с конвертацией изображений в base64
 */
export const useImageBase64 = () => {
  const isProcessing = ref(false);
  const error = ref<string | null>(null);
  const lastBase64 = ref<string | null>(null);

  /**
   * Конвертирует файл в base64
   */
  const convertFileToBase64 = async (file: File, compress = false, maxWidth = 1024, maxHeight = 1024, quality = 0.8) => {
    isProcessing.value = true;
    error.value = null;

    try {
      let result: string;

      if (compress) {
        result = await compressImageToBase64(file, maxWidth, maxHeight, quality);
      } else {
        result = await fileToBase64(file);
      }

      lastBase64.value = result;
      return result;
    } catch (err: any) {
      error.value = err.message || 'Ошибка при конвертации в base64';
      throw err;
    } finally {
      isProcessing.value = false;
    }
  };

  /**
   * Конвертирует URL в base64
   */
  const convertUrlToBase64 = async (url: string) => {
    isProcessing.value = true;
    error.value = null;

    try {
      const result = await urlToBase64(url);
      lastBase64.value = result;
      return result;
    } catch (err: any) {
      error.value = err.message || 'Ошибка при конвертации URL в base64';
      throw err;
    } finally {
      isProcessing.value = false;
    }
  };

  /**
   * Получает размер изображения из base64
   */
  const getImageSizeFromBase64 = async (base64: string) => {
    try {
      return await getBase64ImageSize(base64);
    } catch (err: any) {
      error.value = err.message || 'Ошибка при получении размера изображения';
      throw err;
    }
  };

  /**
   * Конвертирует base64 обратно в Blob
   */
  const convertBase64ToBlob = (base64: string, contentType = 'image/jpeg') => {
    try {
      return base64ToBlob(base64, contentType);
    } catch (err: any) {
      error.value = err.message || 'Ошибка при конвертации base64 в Blob';
      throw err;
    }
  };

  /**
   * Создает URL объект из base64
   */
  const createObjectUrlFromBase64 = (base64: string, contentType = 'image/jpeg') => {
    try {
      return base64ToObjectUrl(base64, contentType);
    } catch (err: any) {
      error.value = err.message || 'Ошибка при создании URL из base64';
      throw err;
    }
  };

  return {
    isProcessing,
    error,
    lastBase64,
    convertFileToBase64,
    convertUrlToBase64,
    getImageSizeFromBase64,
    convertBase64ToBlob,
    createObjectUrlFromBase64
  };
};
