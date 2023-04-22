<template>
  <!-- 问：根据URL部分，显示对应路由的组件？？？ -->
  <div>
    <div v-if="!dataEgg"><h1>查无此蛋</h1></div>
    <div v-else>
      <h1>路由：匹配动态组件渲染</h1>
      <!-- <div>{{ $route.params }}</div> -->
      <h2>{{ dataEgg.name }}</h2>
      <div>{{ dataEgg.description }}</div>
      <div>{{ dataEgg.flavour }}</div>
    </div>
  </div>
</template>

<script>
import dataEggs from "../data.json";
export default {
  data() {
    return {};
  },
  computed: {
    eggType() {
      return this.$route.params.eggType;
    },
    dataEgg() {
      return dataEggs.find((dataEgg) => dataEgg.type === this.eggType);
    },
  },
};
</script>

<style>
</style>