<script setup lang="ts">
import { ref } from "vue";

const chats = [
    {
        id: 1,
        name: "Владислав Ярославович",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        messages: [
            {
                text: "Вас вітає підтримка A-Baits. Опишіть Ваше питання, а менеджер відповість найближчим часом!",
                time: "04:45 PM",
                fromMe: false
            },
            {
                text: "Oh, hello! All perfectly.\nI will check it and get back to you soon",
                time: "18:29",
                fromMe: true
            }
        ]
    },
    {
        id: 2,
        name: "Іван Мірошніченко",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
        messages: [
            {
                text: "Дякую, гарного вечора!",
                time: "18:30",
                fromMe: false
            }
        ]
    }
];

const selectedChat = ref(chats[0]); // По умолчанию открыт первый чат
const newMessage = ref("");

const selectChat = (chat: any) => {
    selectedChat.value = chat;
};

const sendMessage = () => {
    if (newMessage.value.trim() === "") return;

    selectedChat.value.messages.push({
        text: newMessage.value,
        time: new Date().toLocaleTimeString().slice(0, 5),
        fromMe: true
    });

    newMessage.value = "";

    setTimeout(() => {
        const chatContainer = document.querySelector(".overflow-y-auto");
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }, 0);
};

const truncate = (text: string, maxLength: number): string => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}
</script>

<template>
    <div class="flex h-[500px]">
        <!-- Список чатов -->
        <div class="w-1/3 border-r border-gray-200 p-6 flex flex-col">
            <p class="text-[#23262F] font-semibold text-3xl mb-6">Повідомлення</p>
            <div class="space-y-4 flex-1">
                <div v-for="chat in chats" :key="chat.id" @click="selectChat(chat)"
                    class="flex items-center justify-between p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition"
                    :class="{ 'bg-gray-100': selectedChat.id === chat.id }">
                    <div class="flex items-center space-x-4 relative">
                        <img :src="chat.avatar" alt="Avatar" class="w-12 h-12 rounded-full" />
                        <div>
                            <p class="text-[18px] text-[#011627] font-medium whitespace-nowrap w-[205px]">{{ chat.name }}</p>
                            <div class="flex flex-row items-center">
                                <p class="text-[#707991] text-[16px] w-[190px]">
                                    {{ truncate(chat.messages[chat.messages.length - 1].text, 28) }}
                                </p>
                                <UBadge class="absolute right-[-20px] bottom-0">1</UBadge>
                            </div>
                        </div>
                    </div>
                    <!-- <div class="text-right text-[#707991] text-sm">
              {{ chat.messages[chat.messages.length - 1].time }}
            </div> -->
                </div>
            </div>
        </div>

        <!-- Открытый чат -->
        <div class="w-full flex flex-col">
            <div class="flex items-center p-4 border-b border-gray-200">
                <img :src="selectedChat.avatar" class="w-10 h-10 rounded-full " />
                <p class="text-[20px] text-[#011627] font-medium pl-3">{{ selectedChat.name }}</p>
            </div>

            <!-- Сообщения -->
            <div class="flex-1 overflow-y-auto p-6 space-y-4">
                <div v-for="(msg, index) in selectedChat.messages" :key="index" class="flex"
                    :class="msg.fromMe ? 'justify-end' : 'justify-start'">
                    <div class="px-4 py-3 rounded-lg max-w-xs"
                        :class="msg.fromMe ? 'bg-scarlet-400 text-white' : 'bg-gray-200 text-black'">
                        <p>{{ msg.text }}</p>
                        <p class="text-xs text-black text-right mt-1">{{ msg.time }}</p>
                    </div>
                </div>
            </div>

            <!-- Поле ввода -->
            <div class="flex items-center space-x-5">
                <UInput v-model="newMessage" type="text" placeholder="Напишіть повідомлення..." class="w-full" size="xl"/>
                <UButton @click="sendMessage" class="ml-6 bg-scarlet-400 text-white h-[44px] rounded-lg">
                    <img src="/icon/send.svg" alt="" class="w-10">
                </UButton>
            </div>
        </div>
    </div>
</template>