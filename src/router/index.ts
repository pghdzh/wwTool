import { createRouter, createWebHashHistory } from "vue-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
NProgress.configure({ showSpinner: false }); // NProgress Configuration 刷新页面头部进度条

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: () => import("@/views/homeView/index.vue"),
    },
    {
      path: "/chat",
      component: () => import("@/views/AIChatView/index.vue"),
    },
    {
      path: "/team-build",
      component: () => import("@/views/teamView/index.vue"),
    },
    {
      path: "/route-map",
      component: () => import("@/views/routeMapView/index.vue"),
    },
    {
      path: "/discussion",
      component: () => import("@/views/discussionView/index.vue"),
    },
    {
      path: "/gallery",
      component: () => import("@/views/galleryView/index.vue"),
    },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
