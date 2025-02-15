<template>
    <div class="max-w-[1600px] mx-auto p-2 sm:p-4">
      <!-- Header with breadcrumbs -->
      <UBreadcrumb
        :items="[
          { label: 'Головна', to: '/' },
          { label: 'Новини', to: '/news' }
        ]"
        class="mb-4 sm:mb-6"
      />
  
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
        <!-- Main Content -->
        <div class="lg:col-span-9">
          <!-- Featured News -->
          <UCard v-if="featuredNews" class="mb-4 sm:mb-8">
            <template #header>
              <div class="relative h-[200px] sm:h-[300px] md:h-[400px]">
                <img 
                  :src="featuredNews.image" 
                  :alt="featuredNews.title"
                  class="w-full h-full object-cover"
                />
                <UBadge
                  color="primary"
                  class="absolute top-2 left-2 sm:top-4 sm:left-4"
                >
                  Головна новина
                </UBadge>
              </div>
            </template>
            <h1 class="text-xl sm:text-2xl font-bold mb-2">{{ featuredNews.title }}</h1>
            <div class="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-500 mb-4">
              <span class="flex items-center gap-1">
                <UIcon name="i-heroicons-calendar" />
                {{ formatDate(featuredNews.date) }}
              </span>
              <span class="flex items-center gap-1">
                <UIcon name="i-heroicons-eye" />
                {{ featuredNews.views }}
              </span>
            </div>
            <p class="text-base sm:text-lg">{{ featuredNews.excerpt }}</p>
            <template #footer>
              <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                <UButton 
                  color="primary"
                  :to="'/news/' + featuredNews.id"
                  block
                  class="sm:w-auto"
                >
                  Читати далі
                </UButton>
                <div class="flex gap-2 justify-center">
                  <UButton
                    icon="i-heroicons-share"
                    color="gray"
                    variant="ghost"
                    @click="shareNews(featuredNews.id)"
                  />
                  <UButton
                    icon="i-heroicons-bookmark"
                    color="gray"
                    variant="ghost"
                    @click="bookmarkNews(featuredNews.id)"
                  />
                </div>
              </div>
            </template>
          </UCard>
  
          <!-- News Grid -->
          <div class="grid gap-4 sm:gap-6">
            <UCard
              v-for="news in newsList"
              :key="news.id"
              class="flex flex-col sm:flex-row gap-4 sm:gap-6"
            >
              <img 
                :src="news.image" 
                :alt="news.title"
                class="w-full sm:w-48 h-48 object-cover rounded"
              />
              <div class="flex-1">
                <h2 class="text-lg sm:text-xl font-bold mb-2">{{ news.title }}</h2>
                <div class="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-500 mb-4">
                  <span class="flex items-center gap-1">
                    <UIcon name="i-heroicons-calendar" />
                    {{ formatDate(news.date) }}
                  </span>
                  <span class="flex items-center gap-1">
                    <UIcon name="i-heroicons-eye" />
                    {{ news.views }}
                  </span>
                </div>
                <p class="text-gray-600 mb-4">{{ news.excerpt }}</p>
                <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                  <UButton 
                    color="primary"
                    variant="soft"
                    :to="'/news/' + news.id"
                    block
                    class="sm:w-auto"
                  >
                    Читати далі
                  </UButton>
                  <div class="flex gap-2 justify-center">
                    <UButton
                      icon="i-heroicons-share"
                      color="gray"
                      variant="ghost"
                      @click="shareNews(news.id)"
                    />
                    <UButton
                      icon="i-heroicons-bookmark"
                      color="gray"
                      variant="ghost"
                      @click="bookmarkNews(news.id)"
                    />
                  </div>
                </div>
              </div>
            </UCard>
          </div>
  
          <!-- Pagination -->
          <div class="mt-6 sm:mt-8 flex justify-center">
            <UPagination
              v-model="currentPage"
              :total="100"
              :per-page="10"
              :ui="{ 
                wrapper: 'overflow-x-auto flex justify-start sm:justify-center w-full',
                base: 'min-w-8 sm:w-auto'
              }"
            />
          </div>
        </div>
  
        <!-- Sidebar -->
        <div class="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-6">
          <!-- Categories -->
          <UCard class="h-fit">
            <template #header>
              <h3 class="text-lg font-semibold">Категорії новин</h3>
            </template>
            <div class="space-y-2">
              <UButton
                v-for="category in newsCategories"
                :key="category.id"
                block
                color="gray"
                variant="ghost"
                class="justify-between"
              >
                {{ category.name }}
                <UBadge size="sm">{{ category.count }}</UBadge>
              </UButton>
            </div>
          </UCard>
  
          <!-- Popular News -->
          <UCard class="h-fit">
            <template #header>
              <h3 class="text-lg font-semibold">Популярні новини</h3>
            </template>
            <div class="space-y-4">
              <div
                v-for="news in popularNews"
                :key="news.id"
                class="flex gap-4"
              >
                <img 
                  :src="news.image" 
                  :alt="news.title"
                  class="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h4 class="font-medium line-clamp-2">{{ news.title }}</h4>
                  <span class="text-sm text-gray-500">
                    {{ formatDate(news.date) }}
                  </span>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const currentPage = ref(1)
  
  const featuredNews = ref({
    id: 1,
    title: 'Відкриття сезону спінінгової ловлі 2024',
    image: 'https://placehold.co/600x400',
    date: '2024-02-15',
    views: 1234,
    excerpt: 'Дізнайтеся про нові правила та найкращі місця для риболовлі в цьому сезоні...'
  })
  
  const newsList = ref([
    {
      id: 2,
      title: 'Новий бренд воблерів на українському ринку',
      image: 'https://placehold.co/600x400',
      date: '2024-02-14',
      views: 856,
      excerpt: 'Український виробник представив нову лінійку воблерів...'
    },
    // Другие новости...
  ])
  
  const newsCategories = ref([
    { id: 1, name: 'Всі новини', count: 156 },
    { id: 2, name: 'Огляди', count: 45 },
    { id: 3, name: 'Події', count: 32 },
    { id: 4, name: 'Змагання', count: 28 },
    { id: 5, name: 'Майстер-класи', count: 51 }
  ])
  
  const popularNews = ref([
    {
      id: 3,
      title: 'Результати змагань зі спінінгової ловлі',
      image: 'https://placehold.co/600x400',
      date: '2024-02-13'
    },
    // Другие популярные новости...
  ])
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  const shareNews = (newsId) => {
    // Логика шаринга новости
  }
  
  const bookmarkNews = (newsId) => {
    // Логика сохранения новости
  }
  </script>