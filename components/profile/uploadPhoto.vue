<template>
    <div class="gallery">
        <p class="mb-6 text-black_haze-500 text-[16px]">Фото товару</p>
        <div class="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
            <!-- Upload Button -->
            <div v-if="photos.length < 10"
                class="upload border-dotted border-[#FF3400] border-[1px] text-center py-4 px-12 cursor-pointer"
                @click="triggerFileInput">
                <p class="text-black_haze-900 text-[20px] mb-3">
                    <span class="text-[#FF3400]">Завантажте</span> файл
                </p>
                <p class="text-black_haze-500 text-[18px]">
                    Максимальна кількість<br> зображень - 10
                </p>
                <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileUpload">
            </div>

            <!-- Preview Images -->
            <div v-for="(photo, index) in photos" :key="index" class="relative">
                <img :src="photo.url" class="w-[350px] h-[150px] object-cover rounded" alt="Preview">
                <button @click="removePhoto(index)"
                    class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600">
                    ×
                </button>
            </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mt-2 text-red-500">
            {{ errorMessage }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const MAX_FILE_SIZE = 4 * 1024 * 1024 // 4MB in bytes
const fileInput = ref<HTMLInputElement | null>(null)
const photos = ref<{ file: File; url: string }[]>([])
const errorMessage = ref('')

const emit = defineEmits(['update:photos'])

const triggerFileInput = () => {
    fileInput.value?.click()
}

const handleFileUpload = (event: Event) => {
    const input = event.target as HTMLInputElement
    if (!input.files?.length) return

    const file = input.files[0]

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
        errorMessage.value = 'Розмір файлу не може перевищувати 4МБ'
        input.value = ''
        return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
        errorMessage.value = 'Будь ласка, завантажте тільки зображення'
        input.value = ''
        return
    }

    // Clear previous error
    errorMessage.value = ''

    // Create preview URL
    const url = URL.createObjectURL(file)

    // Add to photos array
    photos.value.push({ file, url })

    // Emit updated photos
    emit('update:photos', photos.value.map(p => p.file))

    // Reset input
    input.value = ''
}

const removePhoto = (index: number) => {
    // Release object URL to prevent memory leaks
    URL.revokeObjectURL(photos.value[index].url)
    // Remove photo from array
    photos.value.splice(index, 1)
    // Emit updated photos
    emit('update:photos', photos.value.map(p => p.file))
}

// Cleanup object URLs when component is destroyed
onBeforeUnmount(() => {
    photos.value.forEach(photo => {
        URL.revokeObjectURL(photo.url)
    })
})
</script>