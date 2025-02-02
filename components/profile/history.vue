<script setup lang="ts">
import { ref } from 'vue'

const people = [
    { id: 1, index: '#15267', date: '11.10.2025', summ: '1000 грн', lot_name: 'Название лота', lot_link: '/lot/15267', status: 'В процесі', commission: '10 грн' },
    { id: 2, index: '#153587', date: '11.10.2025', summ: '1000 грн', lot_name: 'Название лота', lot_link: '/lot/153587', status: 'Успіх', commission: '5 грн' },
    { id: 3, index: '#12436', date: '11.10.2025', summ: '1000 грн', lot_name: 'Название лота', lot_link: '/lot/12436', status: 'Успіх', commission: '5 грн' },
    { id: 4, index: '#16879', date: '11.10.2025', summ: '1000 грн', lot_name: 'Название лота', lot_link: '/lot/16879', status: 'Успіх', commission: '5 грн' },
    { id: 5, index: '#16378', date: '11.10.2025', summ: '1000 грн', lot_name: 'Название лота', lot_link: '/lot/16378', status: 'Відмова', commission: '5 грн' },
    { id: 6, index: '#16609', date: '11.10.2025', summ: '1000 грн', lot_name: 'Название лота', lot_link: '/lot/16609', status: 'Успіх', commission: '5 грн' },
    { id: 7, index: '#16907', date: '11.10.2025', summ: '1000 грн', lot_name: 'Название лота', lot_link: '/lot/16907', status: 'Успіх', commission: '5 грн' }
]


const columns = [
    { key: 'id', label: 'id' },
    { key: 'index', label: 'ID Операции' },
    { key: 'date', label: 'Дата' },
    { key: 'summ', label: 'Сума' },
    { key: 'lot_name', label: 'Назва лоту' },
    { key: 'status', label: 'Статус' },
    { key: 'commission', label: 'Комісія' }
]

const selected = ref([people[0]])

function select(row) {

    const index = selected.value.findIndex(item => item.id === row.id)
    if (index === -1) {
        selected.value.push(row)
    } else {
        selected.value.splice(index, 1)
    }
}
</script>

<template>
    <p class="text-[#23262F] font-[600] text-[36px] mb-12">Історія платежів</p>
    <UTable v-model="selected" :rows="people" :columns="columns" @select="select" />
</template>
