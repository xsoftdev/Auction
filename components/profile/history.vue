<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/storage/userState';

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

// Функция для форматирования даты
const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('uk-UA');
};

// Преобразование истории баланса в формат для таблицы
const transactionHistory = computed(() => {
    return user.value.balanceHistory.map((transaction, index) => ({
        id: index + 1,
        index: `#000${index + 1}`, // или можно использовать реальный ID транзакции, если есть
        date: formatDate(transaction.createdAt),
        summ: `${(transaction.amount).toFixed(1)} ${user.value.balance.currency}`,
        desc: transaction.description,
        lot_link: transaction.type === 'purchase' ? `/lot/${transaction.lotId}` : null,
        status: getStatusText(transaction.type),
    }));
});

// Функция для определения статуса транзакции
const getStatusText = (type: string) => {
    switch (type) {
        case 'deposit':
            return 'Успіх';
        case 'withdrawal':
            return 'Успіх';
        case 'purchase':
            return 'В процесі';
        case 'sale':
            return 'Успіх';
        default:
            return 'Відмова';
    }
};

const columns = [
    { key: 'id', label: 'id' },
    { key: 'index', label: 'ID Операции' },
    { key: 'date', label: 'Дата' },
    { key: 'summ', label: 'Сума' },
    { key: 'desc', label: 'Опис' },
    { key: 'status', label: 'Статус' },
];

const selected = ref([]);

function select(row) {
    const index = selected.value.findIndex(item => item.id === row.id);
    if (index === -1) {
        selected.value.push(row);
    } else {
        selected.value.splice(index, 1);
    }
}
</script>

<template>
    <p class="text-[#23262F] font-[600] text-[36px] mb-12">Історія платежів</p>
    <template v-if="transactionHistory.length">
        <UTable v-model="selected" :rows="transactionHistory" :columns="columns" @select="select" />
    </template>
    <p v-else class="text-center text-gray-500 py-8">
        Історія платежів порожня
    </p>
</template>
