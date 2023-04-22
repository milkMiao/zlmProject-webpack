import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Eggs from "../views/Eggs.vue";
import NoFind from "../views/noFind.vue";
// import ChickEgg from "../views/ChickEgg.vue";

//允许这个App使用规则，但还没告诉页面路由在哪渲染
const router = createRouter(
  //路由实例--实现一个路由规则
  //改为：实现动态路由规则
  {
    history: createWebHistory(),
    routes: [
      { path: "/", component: Home },
      { path: "/eggs/:eggType", name: "eggs", component: Eggs }, //冒号后边表示动态值
      { path: "/eggs", redirect: "/eggs/chick-egg" },
      //如下：访问没有指定的路由（懒加载处理-点击路由时候才会记载--否则进入页面开始是不会加载的）
      //方法一：进入页面加载全部路由
      // { path: "/:pathMatch(.*)*", component: NoFind },
      //方法二：初始进入页面不加载noFind组件，点击出发路由改变--才加载noFInd--称之为--懒加载！
      {
        path: "/:pathMatch(.*)*",
        component: () => import("../views/noFind.vue"),
      },
      //   { path: "/chick-egg", component: ChickEgg },
    ],
    linkActiveClass: "eggClass",
  }
);
export default router;
