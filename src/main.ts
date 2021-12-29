import App from './app/app.vue'
import router from './router'
import {createApp} from 'vue'
import './assets/tailwind.css'

createApp(App).use(router).mount('#app')
