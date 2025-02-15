<template>
    <div class="max-w-[1600px] mx-auto p-2 sm:p-4">
        <!-- Breadcrumbs -->
        <UBreadcrumb :items="[
            { label: 'Головна', to: '/' },
            { label: 'Новини', to: '/news' },
            { label: news.title, to: `/news/${news.id}` }
        ]" class="mb-4 sm:mb-6" />

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
            <!-- Main Content -->
            <div class="lg:col-span-9">
                <UCard>
                    <!-- Header Image -->
                    <template #header>
                        <div class="relative">
                            <img :src="news.image" :alt="news.title"
                                class="w-full h-[200px] sm:h-[300px] md:h-[400px] object-cover" />
                            <div
                                class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                <UChip v-for="tag in news.tags" :key="tag" :text="tag" class="mr-2" />
                            </div>
                        </div>
                    </template>

                    <!-- Title and Meta -->
                    <div class="space-y-4">
                        <h1 class="text-2xl sm:text-3xl font-bold">{{ news.title }}</h1>

                        <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <span class="flex items-center gap-1">
                                <UIcon name="i-heroicons-calendar" />
                                {{ formatDate(news.date) }}
                            </span>
                            <span class="flex items-center gap-1">
                                <UIcon name="i-heroicons-eye" />
                                {{ news.views }} переглядів
                            </span>
                            <span class="flex items-center gap-1">
                                <UIcon name="i-heroicons-chat-bubble-left" />
                                {{ news.commentsCount }} коментарів
                            </span>
                            <span class="flex items-center gap-1">
                                <UIcon name="i-heroicons-user" />
                                {{ news.author }}
                            </span>
                        </div>
                    </div>

                    <!-- Content -->
                    <div class="prose prose-lg max-w-none mt-6">
                        <p class="text-lg font-medium mb-6">{{ news.excerpt }}</p>

                        <div v-html="news.content"></div>

                        <!-- Image Gallery -->
                        <div v-if="news.gallery?.length" class="mt-8">
                            <h2 class="text-xl font-bold mb-4">Галерея</h2>
                            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                <UCard v-for="(image, index) in news.gallery" :key="index" class="cursor-pointer"
                                    @click="openGallery(index)">
                                    <img :src="image.thumbnail" :alt="image.caption"
                                        class="w-full aspect-square object-cover" />
                                </UCard>
                            </div>
                        </div>
                    </div>

                    <!-- Share Buttons -->
                    <template #footer>
                        <div
                            class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-4 border-t">
                            <div class="flex items-center gap-2">
                                <span class="text-sm text-gray-500">Поділитися:</span>
                                <UButton v-for="social in socialShares" :key="social.name" :icon="social.icon"
                                    color="gray" variant="ghost" @click="shareOnSocial(social.name)" />
                            </div>
                            <div class="flex gap-2 justify-center">
                                <UButton icon="i-heroicons-printer" color="gray" variant="ghost" @click="printNews">
                                    Друк
                                </UButton>
                                <UButton icon="i-heroicons-bookmark" color="gray" variant="ghost" @click="bookmarkNews">
                                    Зберегти
                                </UButton>
                            </div>
                        </div>
                    </template>
                </UCard>

                <!-- Comments Section -->
                <UCard class="mt-6">
                    <template #header>
                        <div class="flex justify-between items-center">
                            <h2 class="text-xl font-bold">Коментарі ({{ news.commentsCount }})</h2>
                            <UButton color="primary" @click="showCommentForm = true">
                                Додати коментар
                            </UButton>
                        </div>
                    </template>

                    <!-- Comment Form -->
                    <UCard v-if="showCommentForm" class="mb-6">
                        <UForm :schema="commentSchema" @submit="submitComment">
                            <UFormGroup label="Ваш коментар">
                                <UTextarea v-model="commentForm.text" rows="4" />
                            </UFormGroup>
                            <div class="flex justify-end gap-2 mt-4">
                                <UButton color="gray" variant="soft" @click="showCommentForm = false">
                                    Скасувати
                                </UButton>
                                <UButton color="primary" type="submit">
                                    Відправити
                                </UButton>
                            </div>
                        </UForm>
                    </UCard>

                    <!-- Comments List -->
                    <div class="space-y-6">
                        <UCard v-for="comment in news.comments" :key="comment.id" class="bg-gray-50">
                            <div class="flex gap-4">
                                <UAvatar :src="comment.avatar" :alt="comment.author" />
                                <div class="flex-1">
                                    <div class="flex justify-between items-start">
                                        <div>
                                            <h4 class="font-medium">{{ comment.author }}</h4>
                                            <span class="text-sm text-gray-500">
                                                {{ formatDate(comment.date) }}
                                            </span>
                                        </div>
                                        <UDropdown :items="commentActions"
                                            @selected="handleCommentAction($event, comment.id)">
                                            <UButton color="gray" variant="ghost"
                                                icon="i-heroicons-ellipsis-vertical" />
                                        </UDropdown>
                                    </div>
                                    <p class="mt-2">{{ comment.text }}</p>
                                    <div class="flex gap-4 mt-2">
                                        <UButton size="sm" color="gray" variant="ghost"
                                            @click="replyToComment(comment.id)">
                                            Відповісти
                                        </UButton>
                                        <div class="flex items-center gap-1">
                                            <UButton size="sm" color="gray" variant="ghost"
                                                icon="i-heroicons-hand-thumb-up" @click="likeComment(comment.id)" />
                                            <span class="text-sm text-gray-500">
                                                {{ comment.likes }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </UCard>
                    </div>

                    <template #footer>
                        <UButton v-if="hasMoreComments" block color="gray" variant="soft" @click="loadMoreComments">
                            Завантажити ще коментарі
                        </UButton>
                    </template>
                </UCard>
            </div>

            <!-- Sidebar -->
            <div class="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-6">
                <!-- Related News -->
                <UCard>
                    <template #header>
                        <h3 class="text-lg font-semibold">Схожі новини</h3>
                    </template>
                    <div class="space-y-4">
                        <div v-for="relatedNews in news.related" :key="relatedNews.id" class="group">
                            <img :src="relatedNews.image" :alt="relatedNews.title"
                                class="w-full aspect-video object-cover rounded mb-2" />
                            <h4 class="font-medium group-hover:text-primary-500 line-clamp-2">
                                {{ relatedNews.title }}
                            </h4>
                            <span class="text-sm text-gray-500">
                                {{ formatDate(relatedNews.date) }}
                            </span>
                        </div>
                    </div>
                </UCard>

                <!-- News Tags -->
                <UCard>
                    <template #header>
                        <h3 class="text-lg font-semibold">Теги</h3>
                    </template>
                    <div class="flex flex-wrap gap-2">
                        <template v-for="tag in news.tags" :key="tag">
                            <UButton class="cursor-pointer" @click="filterByTag(tag)">
                                {{ tag }}
                            </UButton>
                        </template>
                    </div>
                </UCard>
            </div>
        </div>
    </div>
</template>

<script setup>

const showCommentForm = ref(false)
const hasMoreComments = ref(true)

const news = ref({
    id: 1,
    title: 'Відкриття сезону спінінгової ловлі 2024',
    image: 'https://placehold.co/600x400',
    date: '2024-02-15',
    views: 1234,
    author: 'Олександр Рибалка',
    commentsCount: 8,
    excerpt: 'Дізнайтеся про нові правила та найкращі місця для риболовлі в цьому сезоні...',
    content: `
    <p>Детальний текст новини з форматуванням HTML...</p>
    <h2>Підзаголовок</h2>
    <p>Більше тексту...</p>
  `,
    tags: ['Спінінг', 'Правила', 'Сезон 2024'],
    gallery: [
        { thumbnail: 'https://placehold.co/400x400', full: 'https://placehold.co/1200x800', caption: 'Фото 1' },
        { thumbnail: 'https://placehold.co/400x400', full: 'https://placehold.co/1200x800', caption: 'Фото 2' },
        // Другие фото...
    ],
    comments: [
        {
            id: 1,
            author: 'Микола',
            avatar: 'https://placehold.co/100x100',
            date: '2024-02-15',
            text: 'Дуже корисна інформація! Дякую за детальний огляд.',
            likes: 5
        },
        // Другие комментарии...
    ],
    related: [
        {
            id: 2,
            title: 'Огляд нових моделей спінінгів 2024',
            image: 'https://placehold.co/600x400',
            date: '2024-02-14'
        },
        // Другие похожие новости...
    ]
})

const socialShares = [
    { name: 'facebook', icon: 'i-heroicons-facebook' },
    { name: 'twitter', icon: 'i-heroicons-twitter' },
    { name: 'telegram', icon: 'i-heroicons-telegram' }
]

const commentActions = [
    { label: 'Редагувати', icon: 'i-heroicons-pencil' },
    { label: 'Видалити', icon: 'i-heroicons-trash' }
]

const commentSchema = {
    text: 'required|min:10'
}

const commentForm = reactive({
    text: ''
})

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('uk-UA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

const shareOnSocial = (platform) => {
    // Логика шаринга
}

const bookmarkNews = () => {
    // Логика сохранения
}

const printNews = () => {
    window.print()
}

const openGallery = (index) => {
    // Логика открытия галереи
}

const submitComment = (values) => {
    // Логика отправки комментария
}

const handleCommentAction = (action, commentId) => {
    // Логика действий с комментарием
}

const replyToComment = (commentId) => {
    // Логика ответа на комментарий
}

const likeComment = (commentId) => {
    // Логика лайка комментария
}

const loadMoreComments = () => {
    // Логика загрузки дополнительных комментариев
}

const filterByTag = (tag) => {
    // Логика фильтрации по тегу
}
</script>