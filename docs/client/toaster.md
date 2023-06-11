# Ajouter un système d’alerte (toaster)

## Le composable `useToaster`

```typescript
// use-toaster.ts
import { reactive } from 'vue'

const alphanumBase = 'abcdefghijklmnopqrstuvwyz0123456789'

const alphanum = alphanumBase.repeat(10)

const getRandomAlphaNum = () => {
  const randomIndex = Math.floor(Math.random() * alphanum.length)
  return alphanum[randomIndex]
}

const getRandomId = (prefix = '', suffix = '') => {
  return (prefix ? prefix + '-' : '') + getRandomString(5) + (suffix ? '-' + suffix : '')
}
const getRandomString = (length: number) => {
  return Array.from({ length })
    .map(getRandomAlphaNum).join('')
}

export type Message = {
  id?: string;
  title?: string;
  description: string;
  type: 'info' | 'success' | 'warning' | 'error';
  closeable: boolean;
  titleTag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  timeout?: number;
  style?: Record<string, string>;
  class?: string | Record<string, string> | Array<string | Record<string, string>>;
}

const useToaster = () => {
  const timeouts: Record<string, number> = {}
  const messages: Message[] = reactive([])

  function removeMessage (id: string) {
    const index = messages.findIndex(message => message.id === id)
    clearTimeout(timeouts[id])
    if (index === -1) {
      return
    }
    messages.splice(index, 1)
  }

  function addMessage (message: Message) {
    message.id ??= getRandomId('toaster')
    messages.push({ ...message, description: `${message.description} (${message.timeout})` })
    timeouts[message.id] = window.setTimeout(() => removeMessage(message.id as string), message.timeout)
  }

  return {
    messages,
    addMessage,
    removeMessage,
  }
}

export default useToaster
```

## Le composant AppToaster

```vue
<script lang="ts" setup>
// AppToaster
import { DsfrAlert } from '@gouvminint/vue-dsfr'

import type { Message } from '../composables/use-toaster'

defineProps<{ messages: Message[] }>();
const emit = defineEmits(['close-message']);
const close = (id: string) => emit('close-message', id)
</script>

<template>
  <div class="toaster-container">
    <transition-group
      mode="out-in"
      name="list"
      tag="div"
      class="toasters"
    >
      <DsfrAlert
        v-for="message in messages"
        :key="message.id"
        v-bind="message"
        @close="close(message.id as string)"
      />
    </transition-group>
  </div>
</template>

<style scoped>
.toaster-container {
  position: fixed;
  bottom: 1rem;
  width: 100%;
  z-index: 1;
}
.toasters {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: fixed;
}
</style>
```

## Utilisation dans une app

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useRegisterSW } from 'virtual:pwa-register/vue'

import ReloadPrompt from '@/components/ReloadPrompt.vue'
import AppToaster from '@/components/AppToaster.vue' // Import du composant AppToaster
import useToaster from './composables/useToaster'      // Import du composable useToaster()

const serviceTitle = 'Service'
const serviceDescription = 'Description du service'
const logoText = ['Ministère', 'de l’intérieur']

const quickLinks = [
  {
    label: 'Home',
    path: '/',
    icon: 'ri-home-4-line',
    iconAttrs: { color: 'var(--red-marianne-425-625)' },
  },
  {
    label: 'À propos',
    path: '/a-propos',
    class: 'fr-fi-user-line',
  },
]
const searchQuery = ref('')

const toaster = useToaster() // Récupération du toaster depuis le composable

setTimeout(() => toaster.addMessage({ // Ajout d’un message...
  title: 'Message 1',
  description: 'Description 1',
  type: 'info',
  closeable: true,
  titleTag: 'h3',
  timeout: 6000, // ...qui disparaîtra après 6 secondes...
}), 500) // ... et qui apparaître après 0.5 seconde

setTimeout(() => toaster.addMessage({ // Ajout d’un deuxième message...
  description: 'Description 2',
  type: 'warning',
  closeable: true,
  titleTag: 'h3',
  timeout: 3000, // ...qui disparaîtra après 3 secondes...
}), 2000) // ... et qui apparaître après 2 secondes

setTimeout(() => toaster.addMessage({ // Ajout d’un troisième message...
  title: 'Message 3',
  description: 'Description 3',
  type: 'success',
  closeable: true,
  titleTag: 'h3',
  timeout: 4000, // ...qui disparaîtra après 3 secondes...
}), 3500) // ... et qui apparaître après 3.5 secondes
</script>

<template>
  <DsfrHeader
    v-model="searchQuery"
    :service-title="serviceTitle"
    :service-description="serviceDescription"
    :logo-text="logoText"****
    :quick-links="quickLinks"
    show-search
  />
  <div class="fr-container">
    <router-view />
  </div>
  <AppToaster
    :messages="toaster.messages"
    @close-message="toaster.removeMessage($event)"
  />
</template>
```
