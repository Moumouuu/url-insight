<script setup lang="ts">
import { ref, reactive, computed, h } from "vue";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import Login from "~/components/login.vue";
import { toast } from "~/components/ui/toast";
import { Toaster } from "~/components/ui/toast";

const newUrl = ref('')
const showApiKey = ref(false)
const apiKey = ref('votre-clé-api-secrète')

type Url = {
  id: number
  url: string
  views: number
}

const urls = reactive<Url[]>([])

const sortedUrls = computed(() =>
  [...urls].sort((a, b) => b.views - a.views)
)

function addUrl() {
  if (newUrl.value) {
    urls.push({
      id: urls.length + 1,
      url: newUrl.value,
      views: 0
    })
    newUrl.value = ''
  }
}

function toggleApiKey() {
  showApiKey.value = !showApiKey.value
}

function copyApiKey() {
  navigator.clipboard.writeText(apiKey.value)
  toast({
    title: 'Clé API copiée dans le presse-papier!',
    description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, apiKey.value)),
  })
}

const isAuthenticated = false;
// todo fetch user from api to check if authenticated7
// todo fetch api key
// todo fetch urls
</script>

<template>
  <Toaster />
  <header class="container mx-auto p-4 text-right">
    <Login :is-authenticated="isAuthenticated" />
  </header>
  <div class="container mx-auto p-4 text-center">
    <h1 class="text-3xl font-bold mb-2">Url Insight</h1>
    <h3 class="mb-4">
      Suivez le nombre de vues de vos URLs en temps réel grâce à notre API.
    </h3>

    <!-- Ajout d'URL -->
    <div class="mb-6 flex justify-center">
      <Input :disabled="!isAuthenticated" v-model="newUrl" placeholder="Entrez une nouvelle URL" type="text" class="w-64 mr-2"/>
      <Button :disabled="!isAuthenticated" @click="addUrl" variant="default">Ajouter</Button>
    </div>

    <!-- Clé API -->
    <div class="mb-6">
      <div
        @click="toggleApiKey"
        class="inline-block cursor-pointer"
      >
        <span
          class="bg-gray-200 px-4 py-2 rounded"
          :class="{ 'blur-sm hover:blur-none transition-all duration-300': !showApiKey }"
        >
          {{ apiKey }}
        </span>
      </div>
      <Button :disabled="!isAuthenticated" @click="copyApiKey" variant="outline">Copier votre clé API</Button>
    </div>

    <!-- Liste des URLs -->
    <h2 class="text-2xl font-semibold mb-4">URLs suivies</h2>
    <ul class="max-w-md mx-auto">
      <li
        v-if="sortedUrls.length > 0"
        v-for="url in sortedUrls"
        :key="url.id"
        class="mb-2 p-2 border rounded flex justify-between items-center"
      >
        <span class="truncate mr-2">{{ url.url }}</span>
        <span class="font-bold whitespace-nowrap">{{ url.views }} vues</span>
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
