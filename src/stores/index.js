import { defineStore } from "pinia";
export const useFilterStore = defineStore("filterStore", {
  state: () => ({
    userFilter: "",
    assetFilter: "",
    dateFilter: "",
  }),
  getters: {
    getUserFilter() {
      return this.userFilter;
    },
    getAssetFilter() {
      return this.assetFilter;
    },
    getDateFilter() {
      return this.dateFilter;
    },
  },
  actions: {
    setUserFilter(userFilter) {
      this.userFilter = userFilter;
    },
    setAssetFilter(assetFilter) {
      this.assetFilter = assetFilter;
    },
    setDateFilter(dateFilter) {
      this.dateFilter = dateFilter;
    },
  },
});
