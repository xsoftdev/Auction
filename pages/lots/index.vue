<template>
  <div class="max-w-[1600px] mx-auto p-2 sm:p-4">
    <!-- Breadcrumbs -->
    <div class="mb-4 sm:mb-6 overflow-x-auto">
      <UBreadcrumb :links="[
        { label: 'Головна', to: '/' },
        { label: 'Категорії', to: '/categories' },
        { label: 'Під категорія', to: '/subcategory' },
        { label: lot.title }
      ]" class="min-w-max" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
      <!-- Left Column - Images -->
      <div class="lg:col-span-7 order-1">
        <!-- Main Image -->
        <div class="relative mb-4">
          <img :src="selectedImage" :alt="lot.title" class="w-full aspect-square object-cover rounded-lg" />
          <div class="absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2">
            <UButton icon="i-heroicons-chevron-left" color="white" variant="ghost" class="bg-black/30 hover:bg-black/50"
              :disabled="currentImageIndex === 0" @click="previousImage" />
          </div>
          <div class="absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2">
            <UButton icon="i-heroicons-chevron-right" color="white" variant="ghost"
              class="bg-black/30 hover:bg-black/50" :disabled="currentImageIndex === lot.images.length - 1"
              @click="nextImage" />
          </div>
        </div>

        <!-- Thumbnails -->
        <div class="relative">
          <div class="flex gap-2 overflow-x-auto pb-2 pt-2 pl-2 sm:pl-4 scrollbar-thin scrollbar-thumb-gray-300">
            <UButton v-for="(image, index) in lot.images" :key="index" variant="ghost"
              class="p-0 min-w-[80px] sm:min-w-[100px] shrink-0"
              :class="{ 'ring-2 ring-primary-500': currentImageIndex === index }" @click="selectImage(index)">
              <img :src="image" :alt="`${lot.title} - изображение ${index + 1}`"
                class="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] object-cover rounded" />
            </UButton>
          </div>
        </div>

        <!-- Description (moved here) -->
        <UCard class="mt-4">
          <template #header>
            <h2 class="text-lg font-semibold">Опис</h2>
          </template>

          <div class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span class="text-sm text-gray-600">Місцезнаходження:</span>
                <p class="text-sm sm:text-base">{{ lot.location }}</p>
              </div>
              <div>
                <span class="text-sm text-gray-600">Стан:</span>
                <p class="text-sm sm:text-base">{{ lot.condition }}</p>
              </div>
              <div>
                <span class="text-sm text-gray-600">Доставка:</span>
                <p class="text-sm sm:text-base">{{ lot.delivery }}</p>
              </div>
              <div>
                <span class="text-sm text-gray-600">Оплата:</span>
                <p class="text-sm sm:text-base">{{ lot.payment }}</p>
              </div>
            </div>

            <div>
              <span class="text-sm text-gray-600">Опис:</span>
              <p class="whitespace-pre-line text-sm sm:text-base mt-1">{{ lot.description }}</p>
            </div>
          </div>
        </UCard>

        <!-- Comments -->
        <UCard class="mt-4">
          <template #header>
            <h2 class="text-lg font-semibold">Коментарі</h2>
          </template>

          <!-- Comment Form -->
          <div class="mb-6">
            <UTextarea v-model="newComment" placeholder="Напишіть свій коментар або думку з приводу лоту" rows="3"
              class="text-sm sm:text-base" />
            <div class="flex justify-end mt-2">
              <UButton color="primary" class="text-sm sm:text-base" @click="addComment">
                Опублікувати
              </UButton>
            </div>
          </div>

          <!-- Comments List -->
          <div class="space-y-6">
            <div v-for="comment in lot.comments" :key="comment.id" class="flex gap-2 sm:gap-4">
              <UAvatar :src="comment.avatar" :alt="comment.author" size="md" class="sm:hidden" />
              <UAvatar :src="comment.avatar" :alt="comment.author" size="lg" class="hidden sm:block" />
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="font-medium text-sm sm:text-base">{{ comment.author }}</span>
                  <UBadge v-if="comment.isVerified" color="yellow">
                    {{ comment.rating }}
                  </UBadge>
                </div>
                <p class="mt-2 text-sm sm:text-base">{{ comment.text }}</p>
                <div class="flex gap-4 mt-2">
                  <UButton size="xs" color="gray" variant="ghost" class="text-xs sm:text-sm">
                    Відповісти
                  </UButton>
                </div>
              </div>
            </div>
          </div>

          <template #footer>
            <UButton v-if="hasMoreComments" block color="gray" variant="soft" class="text-sm sm:text-base"
              @click="loadMoreComments">
              Завантажити більше
            </UButton>
          </template>
        </UCard>
      </div>

      <!-- Right Column - Info -->
      <div class="lg:col-span-5 order-2">
        <UCard >
          <h1 class="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">{{ lot.title }}</h1>

          <!-- Auction Timer -->
          <div class="mb-4 sm:mb-6">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm text-gray-600">Закінчення</span>
              <span class="text-sm text-gray-600">До закінчення</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm sm:text-base">{{ formatDateTime(lot.endDate) }}</span>
              <span class="font-medium text-red-500 text-sm sm:text-base">{{ timeLeft }}</span>
            </div>
          </div>

          <!-- Current Price -->
          <div class="mb-4 sm:mb-6">
            <div class="flex items-baseline gap-2 mb-1">
              <span class="text-sm text-gray-600">Поточна ціна</span>
              <span class="text-xs text-gray-500">({{ lot.bidsCount }} ставок)</span>
            </div>
            <div class="text-xl sm:text-2xl font-bold text-primary-500 mb-4">
              {{ formatPrice(lot.currentPrice) }} грн
            </div>

            <!-- Bid Form -->
            <div class="mb-4">
              <label class="text-sm text-gray-600 mb-1 block">Ваша ставка</label>
              <div class="flex gap-2 items-center">
                <UInput v-model="bidAmount" type="number" :min="lot.currentPrice + lot.minBidIncrement"
                  class="w-32 sm:w-40" />
                <span class="text-gray-600">грн</span>
              </div>
            </div>

            <UButton color="primary" size="lg" block class="text-sm sm:text-base" @click="placeBid">
              Зробити ставку
            </UButton>
          </div>

          <!-- Blitz Price -->
          <div class="mb-4 sm:mb-6">
            <div class="flex items-baseline gap-2 mb-2">
              <span class="text-sm text-gray-600">Бліц-ціна</span>
              <span class="text-xs text-gray-500">(купити зараз)</span>
            </div>
            <div class="flex gap-2 sm:gap-4">
              <UButton color="white" size="lg" class="flex-1 text-sm sm:text-base" @click="buyNow">
                {{ formatPrice(lot.blitzPrice) }} грн
              </UButton>
              <UButton icon="i-heroicons-heart" color="white" size="lg" :class="{ 'text-red-500': isInWishlist }"
                @click="toggleWishlist">
                {{ lot.wishlistCount }}
              </UButton>
            </div>
          </div>
        </UCard>

        <!-- Seller Info -->
        <UCard class="mt-4">
          <template #header>
            <h2 class="text-lg font-semibold">Про продавця</h2>
          </template>

          <div class="flex items-center gap-4">
            <UAvatar :src="lot.seller.avatar" :alt="lot.seller.name" size="lg" class="hidden sm:block" />
            <UAvatar :src="lot.seller.avatar" :alt="lot.seller.name" size="md" class="sm:hidden" />
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-medium text-sm sm:text-base">{{ lot.seller.name }}</span>
                <UBadge color="yellow">{{ lot.seller.rating }}</UBadge>
              </div>
              <div class="text-xs sm:text-sm text-gray-500 truncate">
                На сайті з {{ formatDate(lot.seller.joinDate) }}
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 mt-4">
            <UButton color="primary" variant="soft" class="text-sm sm:text-base" block>
              Всі лоти продавця
            </UButton>
            <UButton color="primary" variant="soft" class="text-sm sm:text-base" block>
              Про продавця
            </UButton>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>


<script setup>
const currentImageIndex = ref(0)
const bidAmount = ref('')
const newComment = ref('')
const isInWishlist = ref(false)
const hasMoreComments = ref(true)

// Sample data
const lot = ref({
  id: 1,
  title: 'Воблер Megabass Vision Oneten',
  images: [
    'https://placehold.co/600x600',
    'https://placehold.co/600x600',
    'https://placehold.co/600x600',
    'https://placehold.co/600x600'
  ],
  currentPrice: 5000,
  blitzPrice: 6000,
  minBidIncrement: 100,
  bidsCount: 52,
  wishlistCount: 3,
  endDate: '2024-02-16T22:16:00',
  location: 'Україна, Київська область, Київ',
  condition: 'Новий',
  delivery: 'Нова пошта',
  payment: 'Накладений платіж, предоплата',
  description: 'Детальний опис лота...',
  seller: {
    name: 'Владислав Зайцев',
    avatar: 'https://placehold.co/100x100',
    rating: '4.8',
    joinDate: '2017-06-21'
  },
  comments: [
    {
      id: 1,
      author: 'Євгеній Рибалка',
      avatar: 'https://placehold.co/100x100',
      rating: '4.96',
      isVerified: true,
      text: 'Я очень ценю идеи и пишу прямые, поздравления и свой стиль. Это определенно даёт мне пищу для размышлений и помогло взлететь на вещи под другим углом. Спасибо, что написали и поделились!'
    }
  ]
})

const selectedImage = computed(() => lot.value.images[currentImageIndex.value])

const timeLeft = computed(() => {
  // Implement time difference logic
  return '1 день 07:07:52'
})

const formatDateTime = (date) => {
  return new Date(date).toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const formatPrice = (price) => {
  return price.toLocaleString('uk-UA')
}

const selectImage = (index) => {
  currentImageIndex.value = index
}

const previousImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

const nextImage = () => {
  if (currentImageIndex.value < lot.value.images.length - 1) {
    currentImageIndex.value++
  }
}

const placeBid = () => {
  // Implement bid logic
}

const buyNow = () => {
  // Implement buy now logic
}

const toggleWishlist = () => {
  isInWishlist.value = !isInWishlist.value
}

const addComment = () => {
  // Implement comment logic
}

const loadMoreComments = () => {
  // Implement load more comments logic
}
</script>