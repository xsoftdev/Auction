<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from 'vue-router';
import { useUserStore } from "~/storage/userState";
import { storeToRefs } from 'pinia';

const route = useRoute();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const selectedChat = ref(null);
const newMessage = ref("");
const messages = ref([]);
const loading = ref(false);
const isMobileView = ref(false);

// Chats management
const chats = computed(() => {
    return user.value?.chats || [];
});

// Responsive handling
const checkMobileView = () => {
    isMobileView.value = typeof window !== 'undefined' ? window.innerWidth <= 768 : false;
};
watch(selectedChat, (newValue) => {
    // Ensure this only runs on client-side
    if (typeof document !== 'undefined') {
        if (newValue) {
            // Disable scrolling on body when a chat is selected
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
        } else {
            // Restore default body scrolling when no chat is selected
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        }
    }
}, { immediate: false }); // Avoid triggering on initial render

// Ensure body scrolling is restored when component is unmounted
onUnmounted(() => {
    if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
    }
});
onMounted(() => {
    // Ensure this only runs on client-side
    if (typeof window !== 'undefined') {
        checkMobileView();
        window.addEventListener('resize', checkMobileView);
    }

    // Try to load initial chat based on route param
    const chatId = route.params.id;
    if (chatId) {
        loadInitialChat(chatId);
    }
});

// Format chats with proper data structure
const formattedChats = computed(() => {
    if (!chats.value || !Array.isArray(chats.value)) {
        return [];
    }

    return chats.value.map(chat => {
        // Find other participant
        const otherParticipant = chat.participants?.find(p => p.id !== user.value?.id);

        // Use last message or create placeholder
        const lastMessage = chat.lastMessage || { content: 'Немає повідомлень', createdAt: new Date() };

        return {
            id: chat.id,
            dealId: chat.dealId?.id,
            lotId: chat.lotId?.id,
            lotTitle: chat.lotId?.title,
            name: otherParticipant?.username || 'Користувач',
            avatar: otherParticipant?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg',
            lastMessage: {
                text: lastMessage.content,
                time: lastMessage.createdAt ? new Date(lastMessage.createdAt).toLocaleTimeString('uk-UA', {
                    hour: '2-digit',
                    minute: '2-digit'
                }) : '',
                fromMe: lastMessage.sender === user.value?.id
            },
            unreadCount: chat.unreadCount || 0
        };
    });
});

// Load initial chat when component loads
const loadInitialChat = async (chatId) => {
    // Find chat by ID
    const initialChat = formattedChats.value.find(chat => chat.id === chatId);

    if (initialChat) {
        await selectChat(initialChat);
    }
};

// Load messages for a specific chat
const loadMessages = async (chatId) => {
    loading.value = true;
    try {
        // Get token from localStorage
        const token = localStorage.getItem('auth_token');

        // Fetch messages
        const response = await fetch(`http://38.180.227.189:9000/api/chats/${chatId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (response.status === 200) {
            if (result.messages && Array.isArray(result.messages)) {
                messages.value = result.messages.map(msg => ({
                    id: msg._id,
                    text: msg.content,
                    time: new Date(msg.createdAt).toLocaleTimeString('uk-UA', {
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    fromMe: msg.sender === user.value?.id,
                    isRead: msg.isRead
                }));
            } else {
                messages.value = [];
                console.log('Чат найден, но сообщений пока нет');
            }
        } else {
            console.error('Ошибка при загрузке чата:', result.message || 'Неизвестная ошибка');
            messages.value = [];
        }
    } catch (error) {
        console.error('Error loading messages:', error);
        messages.value = [];
    } finally {
        loading.value = false;
        nextTick(() => {
            scrollToBottom();
        });
    }
};

// Select a chat and load its messages
const selectChat = async (chat) => {
    selectedChat.value = chat;
    await loadMessages(chat.id);
};

// Send a message
const sendMessage = async () => {
    if (!selectedChat.value || newMessage.value.trim() === "") return;

    try {
        const token = localStorage.getItem('auth_token');

        const messageData = {
            content: newMessage.value,
        };

        // Optimistic UI update
        const tempMessage = {
            id: 'temp-' + Date.now(),
            text: newMessage.value,
            time: new Date().toLocaleTimeString('uk-UA', {
                hour: '2-digit',
                minute: '2-digit'
            }),
            fromMe: true,
            pending: true
        };

        messages.value.push(tempMessage);
        newMessage.value = "";
        scrollToBottom();

        const response = await fetch(`http://38.180.227.189:9000/api/chats/${selectedChat.value.id}/message`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(messageData)
        });

        const result = await response.json();

        if (response.status === 200) {
            await loadMessages(selectedChat.value.id);
        }
    } catch (error) {
        console.error('Error sending message:', error);
        // Handle failed message
        const failedIndex = messages.value.findIndex(m => m.pending);
        if (failedIndex !== -1) {
            messages.value[failedIndex].failed = true;
            messages.value[failedIndex].pending = false;
        }
    }
};

// Scroll to bottom of messages
const scrollToBottom = () => {
    nextTick(() => {
        const chatContainer = document.querySelector(".messages-container");
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    });
};

// Handle key events for sending message
const handleKeydown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
};

// Review modal state
const isReviewModalOpen = ref(false);
const reviewData = ref({
    rating: 0,
    comment: ''
});

// Open review modal
const openReviewModal = () => {
    isReviewModalOpen.value = true;
};

// Truncate long text
const truncate = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};
</script>

<template>
    <div class="chat-container flex flex-col md:flex-row h-[600px] bg-white rounded-lg shadow-sm">
        <!-- Chat List -->
        <div class="chat-list w-full md:w-1/3 border-r border-gray-200 p-4 md:p-6 flex flex-col overflow-hidden" :class="{
            'hidden md:flex': isMobileView && selectedChat,
            'flex': !isMobileView || !selectedChat
        }">
            <p class="text-[#23262F] font-semibold text-2xl md:text-3xl mb-4 md:mb-6">Повідомлення</p>

            <div v-if="formattedChats.length" class="space-y-2 md:space-y-4 flex-1 overflow-y-auto chat-list-container">
                <div v-for="chat in formattedChats" :key="chat.id" @click="selectChat(chat)"
                    class="flex items-center justify-between p-3 md:p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition"
                    :class="{ 'bg-gray-100': selectedChat?.id === chat.id }">
                    <div class="flex items-center space-x-3 md:space-x-4">
                        <img :src="chat.avatar" alt="Avatar"
                            class="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover" />
                        <div class="relative">
                            <p class="text-base md:text-lg text-[#011627] font-medium">{{ chat.name }}</p>
                            <p class="text-[#707991] text-sm max-w-[150px] md:max-w-[180px] truncate">
                                {{ truncate(chat.lastMessage?.text, 28) }}
                            </p>
                            <UBadge v-if="chat.unreadCount > 0" class="absolute -right-3 -bottom-1 text-xs">
                                {{ chat.unreadCount }}
                            </UBadge>
                        </div>
                    </div>
                    <div class="text-right text-[#707991] text-xs md:text-sm whitespace-nowrap">
                        {{ chat.lastMessage?.time }}
                    </div>
                </div>
            </div>

            <p v-else class="text-center text-gray-500 py-8">
                У вас поки немає повідомлень
            </p>
        </div>

        <!-- Chat Window -->
        <div v-if="selectedChat" class="chat-window w-full md:w-2/3 h-[91vh] flex flex-col" :class="{
            'absolute inset-0 z-50 bg-white': isMobileView,
            'relative': !isMobileView
        }">
            <!-- Chat Header -->
            <div class="flex items-center justify-between p-4 border-b border-gray-200">
                <div class="flex items-center">
                    <img :src="selectedChat.avatar" class="w-10 h-10 rounded-full object-cover" />
                    <div class="ml-3">
                        <p class="text-[20px] text-[#011627] font-medium">{{ selectedChat.name }}</p>
                        <p v-if="selectedChat.lotTitle" class="text-[14px] text-[#707991]">
                            Лот: {{ selectedChat.lotTitle }}
                        </p>
                    </div>
                </div>

                <UButton v-if="selectedChat.dealId" @click="openReviewModal"
                    class="bg-scarlet-400 text-white hover:bg-scarlet-500">
                    Додати відгук
                </UButton>
            </div>

            <!-- Messages Container -->
            <div class="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 md:space-y-4 messages-container">
                <!-- Loading State -->
                <div v-if="loading" class="flex justify-center items-center h-full">
                    <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8 text-gray-500" />
                </div>

                <!-- Messages -->
                <template v-else-if="messages.length">
                    <div v-for="msg in messages" :key="msg.id" :class="[
                        'flex',
                        msg.isSystem ? 'justify-center' : (msg.fromMe ? 'justify-end' : 'justify-start')
                    ]">
                        <!-- System Message -->
                        <div v-if="msg.isSystem" class="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg text-sm">
                            {{ msg.text }}
                        </div>

                        <!-- Regular Message -->
                        <div v-else class="max-w-[250px] md:max-w-xs"
                            :class="{ 'opacity-70': msg.pending || msg.failed }">
                            <div class="px-3 py-2 md:px-4 md:py-3 rounded-lg"
                                :class="msg.fromMe ? 'bg-scarlet-400 text-white' : 'bg-gray-200 text-black'">
                                <p class="text-sm md:text-base">{{ msg.text }}</p>
                                <div class="flex justify-end items-center gap-1 mt-1">
                                    <p class="text-xs opacity-70">{{ msg.time }}</p>

                                    <!-- Message Status Icons -->
                                    <span v-if="msg.pending" class="text-xs">
                                        <UIcon name="i-heroicons-clock" class="h-3 w-3" />
                                    </span>
                                    <span v-else-if="msg.failed" class="text-xs text-red-500">
                                        <UIcon name="i-heroicons-exclamation-circle" class="h-3 w-3" />
                                    </span>
                                    <span v-else-if="msg.fromMe" class="text-xs">
                                        <UIcon v-if="msg.isRead" name="i-heroicons-check" class="h-3 w-3" />
                                        <UIcon v-else name="i-heroicons-check" class="h-3 w-3 opacity-50" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>

                <!-- Empty State -->
                <div v-else class="flex justify-center items-center h-full text-gray-500">
                    Немає повідомлень. Почніть розмову!
                </div>
            </div>

            <!-- Message Input Section -->
            <div class="p-3 md:p-4 border-t border-gray-200">
                <div class="flex items-center space-x-2">
                    <UTextarea v-model="newMessage" placeholder="Напишіть повідомлення..." class="w-full" size="sm"
                        :rows="1" :auto-grow="true" :max-rows="4" @keydown="handleKeydown" />
                    <UButton @click="sendMessage"
                        class="bg-scarlet-400 text-white h-[44px] w-[44px] flex items-center justify-center rounded-lg hover:bg-scarlet-500">
                        <UIcon name="i-heroicons-paper-airplane" class="h-6 w-6" />
                    </UButton>
                </div>
            </div>
        </div>
    </div>
</template>
