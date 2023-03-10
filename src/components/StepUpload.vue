<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { ImageStatus } from '../types.d'

import { useUploadStore } from '../stores/upload'

import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen'
import { backgroundRemoval, pixelate } from '@cloudinary/url-gen/actions/effect'
import Dropzone from 'dropzone'
import 'dropzone/dist/dropzone.css'

const cloudinary = new Cloudinary({
  cloud: { cloudName: 'unaidev-7' },
  url: { secure: true }
})

const { image } = storeToRefs(useUploadStore())

onMounted(() => {
  const dropzone = new Dropzone('#dropzone', {
    uploadMultiple: false,
    acceptedFiles: '.jpg, .png, .webp',
    maxFiles: 1,
    url: 'https://api.cloudinary.com/v1_1/unaidev-7/upload'
  })

  const uploadParams = {
    'upload_preset': 'di3hmja9',
    'api_key': '336637217421896',
    folder: 'Remove bg',
    timestamp: `${Date.now() / 1000}`,
  }

  dropzone.on('sending', (file: File, xhr: any, formData: FormData) => {
    image.value.status = ImageStatus.UPLOADING

    for (const [key, value] of Object.entries(uploadParams)) {
      formData.append(key, value)
    }
  })

  dropzone.on('success', (file: File, response: any) => {
    const { secure_url: url, public_id: publicId } = response

    const nobgImage: CloudinaryImage = cloudinary.image(publicId).effect(backgroundRemoval())
    const blurredImage: CloudinaryImage = cloudinary.image(publicId).effect(pixelate(200))

    image.value.modified = nobgImage.toURL()
    image.value.blurred = blurredImage.toURL()
    image.value.status = ImageStatus.DONE
    image.value.original = url
  })

  dropzone.on('error', (file: File, response: any) => {
    image.value.status = ImageStatus.ERROR
    console.error(response, 'Something went wrong')
  })
})
</script>

<template>
  <form id="dropzone" class="shadow-2xl border-dashed border-2 border-gray-300 rounded-lg aspect-video w-full flex items-center justify-center flex-col">
    <template v-if="image.status === 'READY'">
      <button class="pointer-events-none cursor-pointer rounded-full text-white text-xl font-bold px-4 py-2 bg-blue-600">
        Upload File
      </button>
      <strong class="mb-3">or drop a file</strong>
    </template>
  </form>
</template>