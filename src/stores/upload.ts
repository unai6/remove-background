import { defineStore, StoreDefinition } from 'pinia'
import { ImageStatus } from '../types.d'

interface State {
  image: Image,
}

export const useUploadStore: StoreDefinition = defineStore('upload', {
  state: (): State => ({
    image: {
      original: null,
      modified:  null,
      status: ImageStatus.READY,
    },
  })
})


interface Image {
  original: string | null,
  modified: string | null,
  status: string,
}