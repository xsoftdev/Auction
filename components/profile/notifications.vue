<script setup lang="ts">
import { useUserStore } from '@/storage/userState';
import { storeToRefs } from 'pinia'; // Добавил импорт storeToRefs

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

// Преобразуем данные чатов в нужный формат для отображения
const formattedChats = computed(() => {
    if (!user.value?.chats || !Array.isArray(user.value.chats)) {
        return [];
    }

    return user.value.chats.map(chat => {
        // В JSON структура отличается от ожидаемой в коде
        // Проверим, есть ли вообще messages в чате
        const messages = chat.messages || [];
        const lastMessage = chat.lastMessage || null;

        // Находим информацию о собеседнике
        // В JSON participants уже содержат информацию в другом формате
        const otherParticipant = chat.participants?.find(p => p.id !== user.value.id);

        return {
            id: chat.id, // В JSON используется id вместо _id
            name: otherParticipant?.username || 'Користувач',
            // Используем lastMessage из данных, если есть
            message: lastMessage?.content || 'Немає повідомлень',
            time: lastMessage ? new Date(lastMessage.createdAt).toLocaleTimeString('uk-UA', {
                hour: '2-digit',
                minute: '2-digit'
            }) : '',
            avatar: otherParticipant?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg',
            // Используем unreadCount из данных, если есть
            unread: chat.unreadCount || 0
        };
    });
});
</script>

<template>
    <p class="text-[#23262F] font-semibold text-3xl mb-8 pt-10">Повідомлення</p>
    <div v-if="formattedChats.length" class="space-y-6">
        <div v-for="chat in formattedChats" :key="chat.id" @click="navigateTo(`/clientarea/chat/${chat.id}`)"
            class="flex items-center cursor-pointer justify-between p-4 border-b border-gray-200">
            <div class="flex items-center space-x-4">
                <img :src="chat.avatar" alt="Avatar" class="w-12 h-12 rounded-full object-cover" />
                <div>
                    <p class="text-[20px] text-[#011627]">{{ chat.name }}</p>
                    <p class="text-[#707991] text-[20px]">{{ chat.message }}</p>
                </div>
            </div>
            <div class="text-right">
                <p class="text-[#707991] text-[18px] mb-3">{{ chat.time }}</p>

                <UBadge v-if="chat.unread > 0">
                    {{ chat.unread }}
                </UBadge>
            </div>
        </div>
    </div>
    <p v-else class="text-center text-gray-500 py-8">
        У вас поки немає повідомлень
    </p>
</template>
