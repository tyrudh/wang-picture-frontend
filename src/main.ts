import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import { createApp } from 'vue'
import { createPinia } from 'pinia'

// @ts-ignore
import App from './App.vue'
import router from './router'
import '@/access.ts'

const app = createApp(App)

app.use(createPinia())
app.use(router).use(Antd).mount('#app')





