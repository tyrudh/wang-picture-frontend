import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

//一个状态存储一类的共享值
export const useCounterStore = defineStore('counter', () => {

  const count = ref(0)
  //定义状态的初始值
  //同时还定义了类似于的一个getter方法
  const doubleCount = computed(() => count.value * 2)
  //定义怎么更改状态
  function increment() {
    count.value++
  }

  //返回
  return { count, doubleCount, increment }
})
