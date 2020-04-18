import Vue from "vue";
import VueRouter from "vue-router";

import store from "@/store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import(/* webpackChunkName: "home" */ "../views/Home.vue"),
  },
  {
    path: "/about",
    name: "About",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/notes",
    name: "Notes",
    component: () =>
      import(/* webpackChunkName: "notes" */ "../views/Notes.vue"),
    meta: { requireAuth: true },
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const protectedRoute = to.matched.some((record) => record.meta.requireAuth);

  if (protectedRoute && !store.state.token) {
    next({ name: "Login" });
  } else {
    next();
  }
});

export default router;
