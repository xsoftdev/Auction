<script setup lang="ts">
const chats = [
    {
        id: 1,
        name: "Владислав Ярославович",
        message: "Дякую, гарного вечора!",
        time: "18:30",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        unread: 0
    },
    {
        id: 2,
        name: "Іван Мірошніченко",
        message: "Дякую, гарного вечора!",
        time: "18:30",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
        unread: 2
    },
    {
        id: 3,
        name: "Лариса Литвинець",
        message: "Дякую, гарного вечора!",
        time: "18:30",
        avatar: "https://randomuser.me/api/portraits/women/3.jpg",
        unread: 0
    }
];
</script>

<template>
    <p class="text-[#23262F] font-semibold text-3xl mb-8">Повідомлення</p>
    <div class="space-y-6">
        <div v-for="chat in chats" :key="chat.id"
            @click="navigateTo('/clientarea/chat')"
            class="flex items-center cursor-pointer justify-between p-4 border-b border-gray-200">
            <div class="flex items-center space-x-4">
                <img :src="chat.avatar" alt="Avatar" class="w-12 h-12 rounded-full" />
                <div>
                    <p class="text-[20px] text-[#011627]">{{ chat.name }}</p>
                    <p class="text-[#707991] text-[20px]">{{ chat.message }}</p>
                </div>
            </div>
            <div class="text-right">
                <p class="text-[#707991] text-18px] mb-3">{{ chat.time }}</p>

                <UBadge v-if="chat.unread > 0">
                    {{ chat.unread }}
                </UBadge>
            </div>
        </div>
    </div>
</template>
