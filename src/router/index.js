import { createRouter, createWebHistory } from "vue-router";
import { isLoggedIn } from "./middlewares/loginStatusMiddleware.js";

// import loginStatusMiddleware from "./middlewares/loginStatusMiddleware";
// import refreshTocken from "./middlewares/refreshTocken";
// import isJoinedRoom from "./middlewares/isJoinedRoom";

const routes = [
  {
    path: "/auth",
    name: "Auth",
    component: () => import("../views/Auth.vue"),
    meta: {
      middleware: [isLoggedIn],
      layout: "authLayout",
    },
  },
  {
    path: "/closer",
    name: "Closer",
    component: () => import("../views/Closer.vue"),
    meta: {
      layout: "authLayout",
    },
  },
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
    meta: {
      layout: "mainLayout",
    },
  },
  {
    path: "/cabinet",
    name: "Cabinet",
    component: () => import("../views/Cabinet.vue"),
    meta: {
      layout: "mainLayout",
    },
  },
  {
    path: "/users",
    name: "Users",
    component: () => import("../views/Users/Users.vue"),
    meta: {
      layout: "mainLayout",
    },
  },
  {
    path: "/messages",
    name: "Messages",
    component: () => import("../views/Messages.vue"),
    meta: {
      layout: "mainLayout",
    },
  },
  {
    path: "/friends",
    name: "Friends",
    component: () => import("../views/Users/Friends.vue"),
    meta: {
      layout: "mainLayout",
    },
  },
  {
    path: "/users",
    name: "User",
    component: () => import("../views/Users/Users.vue"),
    meta: {
      layout: "mainLayout",
    },
  },
  {
    path: "/users/:id",
    name: "UserId",
    component: () => import("../views/Users/UserId.vue"),
    meta: {
      layout: "mainLayout",
    },
  },
  {
    path: "/rooms",
    name: "Rooms",
    component: () => import("../views/Rooms/Rooms.vue"),
    meta: {
      layout: "mainLayout",
    },
  },
  {
    path: "/rooms/:id",
    name: "RoomId",
    component: () => import("../views/Rooms/RoomId.vue"),
    meta: {
      layout: "mainLayout",
    },
  },
  {
    path: "/404",
    name: "ErrorPage",
    component: () => import("../views/ErrorPage.vue"),
    meta: {
      layout: "mainLayout",
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  // await refreshTocken(to, from, next);
  // loginStatusMiddleware(to, from, next);
  // isJoinedRoom(to, from, next);
});

export default router;
