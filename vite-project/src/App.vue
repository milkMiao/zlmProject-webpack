<template>
  <div>
    <!-- 
      1、使用<a>标签切换，你会发现两个页面会不断刷新；【不断进行Http请求】
      2、改为 <route-link> 标签,切换页面不会重新渲染页面；
    -->
    <nav>
      <!-- <a href="/">主页面</a> | <a href="/chick-egg">鸡蛋</a> |
      <router-link to="/">主页面</router-link> |
      <router-link to="/chick-egg">鸡蛋</router-link> -->

      <!-- 动态路由 【 to的声明式导航 :to="`/eggs/${item.type}`" 】-->
      <router-link
        v-for="item in dataEgg"
        :key="item.id"
        :to="{ name: 'eggs', params: { eggType: item.type } }"
        >{{ item.name }}｜</router-link
      >
    </nav>
    <router-view></router-view>
    <!-- 编程式导航 -->
    <button @click="backward">前进按钮</button>
    <button @click="forward">后退按钮</button>
  </div>
</template>

<script >
import dataEgg from "./data.json";
export default {
  data() {
    return {
      dataEgg,
    };
  },
  methods: {
    backward() {
      this.$router.go(-1);
    },
    forward() {
      this.$router.go(1);
    },
  },
};
</script>
<style scoped>
.eggClass {
  color: red;
}
</style>
