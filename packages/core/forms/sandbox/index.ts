import Kongponents from '@kong/kongponents'
import '@kong/kongponents/dist/style.css'
import { createApp, provide } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { FORMS_API_KEY, VueFormGenerator } from '../src'
import App from './App.vue'

const app = createApp(App)

app.use(Kongponents)

// For correct rendering, host app should make the component available
// globally and provide the API endpoints for autosuggest
app.component('VueFormGenerator', VueFormGenerator)
provide(FORMS_API_KEY, {
  getOne: async () => ({}),
  getAll: async () => [{}],
})

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./pages/HomePage.vue'),
    },
    {
      path: '/legacy-fields',
      name: 'legacy-fields',
      component: () => import('./pages/LegacyFieldsPage.vue'),
    },
    {
      path: '/next-fields',
      name: 'next-fields',
      component: () => import('./pages/NextFieldsPage.vue'),
    },
  ],
})

app.use(router)
app.mount('#app')
