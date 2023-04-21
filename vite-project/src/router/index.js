import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import ChickEgg from "../views/ChickEgg.vue";

//允许这个App使用规则，但还没告诉页面路由在哪渲染
const router = createRouter(
  //路由实例--实现一个路由规则
  {
    history: createWebHistory(),
    routes: [
      { path: "/", component: Home },
      { path: "/chick-egg", component: ChickEgg },
    ],
  }
);
export default router;
