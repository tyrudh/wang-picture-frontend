<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <GlobalHeader></GlobalHeader>
      </a-layout-header>
      <a-layout-content class="content">
      <router-view></router-view>
      </a-layout-content>
      <div class="bottom">
      </div>
      <a-layout-footer class="footer">
        <a target="_blank">图库网站</a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import GlobalHeader from "@/components/GlobalHeader.vue";
</script>

<style scoped>
#basicLayout .bottom{
  height: 20px;
  width: 100px;
}
#basicLayout .footer{
  color: aqua;
  padding: 20px;
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  text-align: center;
  font-size: 20px;
}
#basicLayout .content{
  padding: 16px;
  background: white;
  margin-bottom: 20px;
}
#basicLayout .header{
  padding-inline: 20px;
  background: white;
  color: unset;
  margin-bottom: 16px;
}
</style>
