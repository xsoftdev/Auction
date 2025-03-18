/**
 * Утилита для конвертации изображений в формат Base64
 *
 * Использование в Nuxt 3:
 * - Импортируйте функции в ваш компонент
 * - Используйте для преобразования файлов или URL в base64
 */

/**
 * Конвертирует File объект в строку base64
 * @param file - Файл изображения
 * @returns Promise с base64 строкой
 */
export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('Файл не предоставлен'));
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Не удалось преобразовать файл в base64'));
        }
      };

      reader.onerror = () => {
        reject(new Error('Ошибка при чтении файла'));
      };

      reader.readAsDataURL(file);
    });
  };

  /**
   * Конвертирует URL изображения в строку base64
   * @param url - URL изображения (локальный или удаленный)
   * @returns Promise с base64 строкой
   */
  export const urlToBase64 = (url: string): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        // Получаем изображение
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Не удалось загрузить изображение: ${response.status} ${response.statusText}`);
        }

        // Преобразуем в Blob
        const blob = await response.blob();

        // Создаем FileReader для получения base64
        const reader = new FileReader();

        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error('Не удалось преобразовать изображение в base64'));
          }
        };

        reader.onerror = () => {
          reject(new Error('Ошибка при чтении изображения'));
        };

        reader.readAsDataURL(blob);
      } catch (error) {
        reject(error);
      }
    });
  };

  /**
   * Конвертирует base64 строку обратно в Blob объект
   * @param base64 - строка base64
   * @param contentType - MIME-тип (по умолчанию 'image/jpeg')
   * @returns Blob объект
   */
  export const base64ToBlob = (base64: string, contentType = 'image/jpeg'): Blob => {
    // Удаляем заголовок base64 (например, 'data:image/jpeg;base64,')
    const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;

    // Декодируем base64 в бинарные данные
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  };

  /**
   * Создает объект URL из base64 строки
   * @param base64 - строка base64
   * @param contentType - MIME-тип (по умолчанию 'image/jpeg')
   * @returns URL объект
   */
  export const base64ToObjectUrl = (base64: string, contentType = 'image/jpeg'): string => {
    const blob = base64ToBlob(base64, contentType);
    return URL.createObjectURL(blob);
  };

  /**
   * Получает информацию о размере изображения из base64
   * @param base64 - строка base64
   * @returns Promise с объектом, содержащим width и height
   */
  export const getBase64ImageSize = (base64: string): Promise<{ width: number, height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height
        });
      };

      img.onerror = () => {
        reject(new Error('Не удалось загрузить изображение из base64'));
      };

      img.src = base64;
    });
  };

  /**
   * Сжимает изображение и возвращает его в формате base64
   * @param file - Файл изображения
   * @param maxWidth - Максимальная ширина (по умолчанию 1024)
   * @param maxHeight - Максимальная высота (по умолчанию 1024)
   * @param quality - Качество JPEG (0-1, по умолчанию 0.8)
   * @returns Promise с base64 строкой
   */
  export const compressImageToBase64 = (
    file: File,
    maxWidth = 1024,
    maxHeight = 1024,
    quality = 0.8
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        if (!event.target?.result) {
          reject(new Error('Не удалось прочитать файл'));
          return;
        }

        const img = new Image();
        img.src = event.target.result as string;

        img.onload = () => {
          // Вычисляем новые размеры, сохраняя пропорции
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }

          // Создаем canvas для сжатия
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Не удалось получить контекст 2D'));
            return;
          }

          // Рисуем изображение с новыми размерами
          ctx.drawImage(img, 0, 0, width, height);

          // Конвертируем в base64
          const base64 = canvas.toDataURL('image/jpeg', quality);
          resolve(base64);
        };

        img.onerror = () => {
          reject(new Error('Не удалось загрузить изображение'));
        };
      };

      reader.onerror = () => {
        reject(new Error('Ошибка при чтении файла'));
      };

      reader.readAsDataURL(file);
    });
  };
