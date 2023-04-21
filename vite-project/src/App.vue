<script setup>
</script>

<template>
  <div>
    <!-- 
      1、使用<a>标签切换，你会发现两个页面会不断刷新；【不断进行Http请求】
      2、改为 <route-link> 标签,切换页面不会重新渲染页面；
    -->
    <nav>
      <a href="/">主页面</a> | <a href="/chick-egg">鸡蛋</a> |
      <router-link to="/">主页面</router-link> |
      <router-link to="/chick-egg">鸡蛋</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

