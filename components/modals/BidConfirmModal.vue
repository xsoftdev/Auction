<!-- components/Modals/BidConfirmModal.vue -->
<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  lotTitle: {
    type: String,
    required: true
  },
  currentPrice: {
    type: Number,
    required: true
  },
  yourBid: {
    type: Number,
    required: true
  },
  isBlitzBuy: {
    type: Boolean,
    default: false
  },
  lotImage: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['close', 'confirm']);

const isLoading = ref(false);

// Закрыть модальное окно
const closeModal = () => {
  emit('close');
};

// Подтвердить действие
const confirmAction = async () => {
  isLoading.value = true;
  
  try {
    // Имитация задержки запроса
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Отправляем событие подтверждения
    emit('confirm');
    
    // Закрываем модальное окно после успешного подтверждения
    closeModal();
  } catch (error) {
    console.error('Ошибка при подтверждении:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Затемнение фона -->
        <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeModal"></div>
        
        <!-- Модальное окно -->
        <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <!-- Заголовок модального окна -->
          <div class="flex items-center justify-between p-4 border-b">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ isBlitzBuy ? 'Підтвердження блиц-купівлі' : 'Підтвердження ставки' }}
            </h3>
            <button
              @click="closeModal"
              class="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
            </button>
          </div>
          
          <!-- Содержимое модального окна -->
          <div class="p-6">
            <!-- Информация о лоте с изображением -->
            <div class="flex items-center mb-6">
              <div class="w-20 h-20 mr-4 rounded-md overflow-hidden flex-shrink-0">
                <img
                  :src="lotImage || '/images/exampleLots.png'"
                  :alt="lotTitle"
                  class="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 class="text-base font-medium text-gray-900">{{ lotTitle }}</h4>
                <p class="text-sm text-gray-600 mt-1">
                  Поточна ціна: <span class="font-semibold">{{ currentPrice }} ₴</span>
                </p>
              </div>
            </div>
            
            <!-- Предупреждающее сообщение -->
            <UAlert
              :title="isBlitzBuy ? 'Блиц-купівля' : 'Нова ставка'"
              color="amber"
              variant="soft"
              icon="i-heroicons-exclamation-triangle"
              class="mb-4"
            >
              <p v-if="isBlitzBuy">
                Ви збираєтеся придбати лот за блиц-ціною <span class="font-bold">{{ yourBid }} ₴</span>.
                Підтвердіть ваше рішення.
              </p>
              <p v-else>
                Ви збираєтеся зробити ставку в розмірі <span class="font-bold">{{ yourBid }} ₴</span>. 
                Ця дія не може бути відмінена.
              </p>
            </UAlert>
            
            <p class="text-sm text-gray-500 mb-6">
              Натискаючи "Підтвердити", ви погоджуєтеся з умовами участі в аукціоні та 
              зобов'язуєтеся оплатити лот у разі перемоги.
            </p>
            
            <!-- Кнопки действий -->
            <div class="flex justify-end space-x-3">
              <UButton
                color="gray"
                variant="soft"
                @click="closeModal"
                :disabled="isLoading"
              >
                Скасувати
              </UButton>
              
              <UButton
                color="primary"
                @click="confirmAction"
                :loading="isLoading"
                :disabled="isLoading"
              >
                {{ isBlitzBuy ? 'Купити зараз' : 'Підтвердити ставку' }}
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>