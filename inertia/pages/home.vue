<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

const newUrl = ref('')
const showApiKey = ref(false)
const apiKey = ref('votre-clé-api-secrète')

const urls = reactive([
  { id: 1, url: 'https://exemple.com', views: 100 },
  { id: 2, url: 'https://test.com', views: 50 },
])

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
  alert('Clé API copiée dans le presse-papier!')
}
</script>

<template>
  <div class="container mx-auto p-4 text-center">
    <h1 class="text-3xl font-bold mb-2">Url Insight</h1>
    <h3 class="mb-4">
      Suivez le nombre de vues de vos URLs en temps réel grâce à notre API.
    </h3>

    <!-- Ajout d'URL -->
    <div class="mb-6 flex justify-center">
      <Input v-model="newUrl" placeholder="Entrez une nouvelle URL" type="text" class="w-64 mr-2"/>
      <Button @click="addUrl" variant="default">Ajouter</Button>
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
      <Button @click="copyApiKey" variant="outline">Copier votre clé API</Button>
    </div>

    <!-- Liste des URLs -->
    <h2 class="text-2xl font-semibold mb-4">URLs suivies</h2>
    <ul class="max-w-md mx-auto">
      <li
        v-for="url in sortedUrls"
        :key="url.id"
        class="mb-2 p-2 border rounded flex justify-between items-center"
      >
        <span class="truncate mr-2">{{ url.url }}</span>
        <span class="font-bold whitespace-nowrap">{{ url.views }} vues</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.blur-sm {
  filter: blur(4px);
}

</style>
