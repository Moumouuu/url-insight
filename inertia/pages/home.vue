<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import Login from '~/components/login.vue'
import { toast } from '~/components/ui/toast'
import { Toaster } from '~/components/ui/toast'
import { UrlAPI } from '~/api/url'
import { Url as UrlModel } from '~/models/url'

const props = defineProps({
  isAuthenticated: Boolean,
  urls: Array<UrlModel>,
  apiKey: String,
})

console.log(props.urls)

const newUrl = ref('')
const showApiKey = ref(false)
const apiKey = ref(props.apiKey || 'votre-clé-api')
const isAuthenticated = ref(props.isAuthenticated)

const urls = reactive<UrlModel[]>(props.urls || [])

const sortedUrls = computed(() => [...urls].sort((a, b) => b.views - a.views))

function addUrl() {
  if (!verifyUrl(newUrl.value)) {
    toast({
      title: 'URL invalide!',
      description: 'Veuillez entrer une URL valide.',
    })
    return
  }

  const url = new UrlModel(newUrl.value)

  if (newUrl.value) {
    urls.push(url)
    newUrl.value = ''
    UrlAPI.create(url).then(() => {
      toast({
        title: 'URL ajoutée avec succès!',
      })
    })
  }
}

function verifyUrl(url: string) {
  return url.match(/^(http|https):\/\//) && !url.match(/\s/)
}

function deleteUrl(url: UrlModel) {
  urls.splice(urls.indexOf(url), 1)
  UrlAPI.delete(url).then(() => {
    toast({
      title: 'URL supprimée avec succès!',
    })
  })
}

function toggleApiKey() {
  showApiKey.value = !showApiKey.value
}

function copyApiKey() {
  navigator.clipboard.writeText(apiKey.value)
  toast({
    title: 'Clé API copiée dans le presse-papier!',
  })
}
</script>

<template>
  <Toaster />
  <header class="container mx-auto p-4 text-right">
    <Login :is-authenticated="isAuthenticated" />
  </header>
  <div class="container mx-auto p-4 text-center">
    <h1 class="text-3xl font-bold mb-2">Url Insight</h1>
    <h3 class="mb-4">Suivez le nombre de vues de vos URLs en temps réel grâce à notre API.</h3>

    <!-- Ajout d'URL -->
    <div class="mb-6 flex justify-center">
      <Input
        :disabled="!isAuthenticated"
        v-model="newUrl"
        placeholder="Entrez une nouvelle URL"
        type="text"
        class="w-64 mr-2"
      />
      <Button :disabled="!isAuthenticated" @click="addUrl" variant="default">Ajouter</Button>
    </div>

    <!-- Clé API -->
    <div class="mb-6 flex items-center justify-center">
      <div @click="toggleApiKey" class="inline-block cursor-pointer">
        <div
          class="bg-gray-200 px-4 py-2 rounded w-64 overflow-hidden"
          :class="{ 'blur-sm hover:blur-none transition-all duration-300': !showApiKey }"
        >
          {{ apiKey }}
        </div>
      </div>
      <Button :disabled="!isAuthenticated" @click="copyApiKey" variant="outline"
        >Copier votre clé API</Button
      >
    </div>

    <!-- Liste des URLs -->
    <h2 class="text-2xl font-semibold mb-4">URLs suivies</h2>
    <ul class="max-w-md mx-auto">
      <li
        v-for="url in sortedUrls"
        v-if="sortedUrls.length > 0"
        :key="url.url"
        class="mb-2 p-2 border rounded flex justify-between items-center"
      >
        <div class="flex justify-between w-full mx-4">
          <span class="truncate mr-2">{{ url.url }}</span>
          <span class="font-bold whitespace-nowrap">{{ url.views }} vues</span>
        </div>
        <Button variant="destructive" @click="deleteUrl(url)">X</Button>
      </li>

      <li v-else class="mb-2 p-2 border rounded flex justify-center items-center">
        <span class="truncate mr-2 text-muted-foreground">Aucune URL suivie</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.blur-sm {
  filter: blur(4px);
}
</style>
