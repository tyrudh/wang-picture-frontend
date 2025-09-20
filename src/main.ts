import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import { createApp } from 'vue'
import { createPinia } from 'pinia'

// @ts-ignore
import App from './App.vue'
import router from './router'
import '@/access.ts'

import VueCropper from 'vue-cropper';
import 'vue-cropper/dist/index.css'

const app = createApp(App)

app.use(createPinia())
app.use(router).use(VueCropper).use(Antd).mount('#app')





