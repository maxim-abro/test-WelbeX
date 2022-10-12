import { defineStore } from "pinia";

export const useLoadStore = defineStore({
  id: "loader",
  state: () => ({
    isLoad: false,
  }),
  getters: {},
  actions: {
    toggleLoader() {
      this.isLoad = !this.isLoad;
    },
  },
});
