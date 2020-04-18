import Vue from "vue";
import Vuex from "vuex";

import decode from "jwt-decode";

import router from "@/router";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: localStorage.getItem("token") || null,
    user: null,
  },
  getters: {
    isActive: (state) => !!state.token,
    token: (state) => state.token,
  },
  mutations: {
    setUser(state, payload) {
      state.token = payload;
      if (!payload) {
        state.user = null;
      } else {
        state.user = decode(payload);
      }
    },
  },
  actions: {
    getToken({ commit }) {
      const token = localStorage.getItem("token");
      if (token) {
        commit("setUser", token);
      } else {
        commit("setUser", null);
      }
    },
    saveUser({ commit }, payload) {
      localStorage.setItem("token", payload);
      commit("setUser", payload);
    },
    logout({ commit }) {
      localStorage.removeItem("token");
      commit("setUser", null);
      router.push({ name: "Login" });
    },
  },
});
