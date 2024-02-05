<template>
  <br />
  <div class="top-level-container">
    <nav>
      <div class="filtersList">
        <div class="filter">
          <label for="assetFilter">Asset</label>
          <select
            name="assetFilter"
            id="assetFilter"
            v-model="selectedAssetFilter"
          >
            <option value="" selected>Filter By Asset</option>
            <option v-for="asset in assets" :key="asset.id" :value="asset.id">
              {{ asset.name }}
            </option>
          </select>
        </div>
        <div class="filter">
          <label for="userFilter">User</label>
          <select
            name="userFilter"
            id="userFilter"
            v-model="selectedUserFilter"
          >
            <option value="" selected>Filter By User</option>
            <option v-for="sup in supervisors" :key="sup.id" :value="sup.id">
              {{ sup.firstName }} {{ sup.lastName }}(Supervisor)
            </option>
            <option
              v-for="stud in students"
              :key="stud.id"
              :value="stud.id"
              v-show="isSupervisor"
            >
              {{ stud.firstName }} {{ stud.lastName }}(Student)
            </option>
          </select>
        </div>
        <div class="filter">
          <label for="dateFilter">Date</label>
          <input
            type="date"
            v-model="selectedDateFilter"
            placeholder="Filter by Date"
          />
        </div>
      </div>
    </nav>
    <div class="loader" v-if="!dataLoaded"></div>
    <div class="cardList-container" v-else-if="dataFound">
      <div v-for="trans in currentData" :key="trans.id" v-show="dataLoaded">
        <card-view :trans="trans" :isSupervisor="isSupervisor" :assets="assets">
        </card-view>
      </div>
    </div>
    <div class="container" v-else>
      <div class="empty">
        <img src="../assets/alien spaceship-rafiki 3.png" alt="" />
        <h1>No Data Found !!!</h1>
      </div>
    </div>
  </div>
</template>
<script>
import { useFilterStore } from "../stores/index";
import CardView from "./CardView.vue";
export default {
  setup() {
    const filterStore = useFilterStore();
    return { filterStore };
  },
  mounted() {
    this.initializeFilters();
    this.getTransactionData();
  },
  props: ["isSupervisor", "assets", "currentUser"],
  components: { CardView },
  inject: ["students", "supervisors"],
  provide() {
    return {
      getTransactionData: this.getTransactionData,
    };
  },
  watch: {
    currentUser() {
      this.filterStore.setUserFilter("");
      this.filterStore.setAssetFilter("");
      this.filterStore.setDateFilter("");
      this.selectedUserFilter = "";
      this.selectedAssetFilter = "";
      this.selectedDateFilter = "";
      window.localStorage.clear();
      this.getTransactionData(true);
    },
    selectedUserFilter(value) {
      this.filterStore.setUserFilter(value);
      this.getTransactionData();
    },
    selectedAssetFilter(value) {
      this.filterStore.setAssetFilter(value);
      this.getTransactionData();
    },
    selectedDateFilter(value) {
      this.filterStore.setDateFilter(value);
      this.getTransactionData();
    },
  },
  data() {
    return {
      selectedUserFilter: "",
      selectedAssetFilter: "",
      selectedDateFilter: "",
      transactions: [],
      trans: {},
      dataLoaded: false,
      dataFound: false,
    };
  },
  methods: {
    initializeFilters() {
      this.selectedAssetFilter = this.assetFilter ? this.assetFilter : "";
      this.selectedUserFilter = this.userFilter ? this.userFilter : "";
      this.selectedDateFilter = this.dateFilter ? this.dateFilter : "";
    },
    getTransactionData() {
      let count = 0;
      this.dataLoaded = false;
      this.dataFound = false;
      let url = "http://localhost:3000/transactions?";
      if (!this.isSupervisor) {
        url += `studentId=${this.currentUser}`;
        count = 1;
      }
      if (this.assetFilter !== "" && this.selectedAssetFilter) {
        if (count) {
          url += "&";
        }
        url += `assetId=${this.assetFilter}`;
        count = 1;
      }
      if (this.userFilter !== "" && this.selectedUserFilter) {
        if (count) url += "&";
        if (
          this.supervisors.find((value) => {
            return value.id === this.userFilter;
          })
        ) {
          url += `loaningSupervisorId=${this.userFilter}`;
        } else {
          url += `studentId=${this.userFilter}`;
        }
        count = 1;
      }
      console.log(url);
      fetch(url)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((data) => {
          const res = [];
          for (const id of data) {
            res.push(id);
          }

          let arr = [...res];
          if (this.dateFilter !== "" && this.selectedDateFilter) {
            this.transactions = arr.filter((item) => {
              var extractedDate = new Date(item.loanDate);
              var year = extractedDate.getUTCFullYear();
              var month = ("0" + (extractedDate.getUTCMonth() + 1)).slice(-2);
              var day = ("0" + extractedDate.getUTCDate()).slice(-2);
              var formattedDate = year + "-" + month + "-" + day;
              return formattedDate === this.dateFilter;
            });
          } else this.transactions = [...res];
          this.dataLoaded = true;
          if (!this.transactions.length) {
            this.dataFound = false;
          } else {
            this.dataFound = true;
          }
          // console.log(this.transactions);
        })
        .catch((err) => {
          console.log("Something Went Wrong!!! " + err);
        });
    },
  },
  computed: {
    currentData() {
      return this.transactions;
    },
    userFilter() {
      return this.filterStore.getUserFilter;
    },
    assetFilter() {
      return this.filterStore.getAssetFilter;
    },
    dateFilter() {
      return this.filterStore.getDateFilter;
    },
  },
};
</script>
<style scoped>
html {
  background-color: #eff4f4;
}
.filtersList {
  display: block;
  margin-left: 54px;
  margin-bottom: 20px;
  margin-top: 41px;
}
.filter label {
  font-size: 8px;
  display: block;
  text-align: start;
  margin-left: 7px;
  color: grey;
  margin-bottom: 10px;
  font-weight: bolder;
}
.filter {
  display: inline-flex;
  flex-direction: column;
  margin-right: 50px;
}
.filter select {
  height: 35px;
  width: 128px;
  font-size: 9px;
  color: grey;
  box-shadow: 0px 8px 5px -5px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  padding: 0 0 0 7px;
}
option {
  color: black;
  font-weight: bold;
  font-family: "Comic Neue", cursive;
  margin-left: 20px;
}
.filter option:hover {
  color: grey;
}
.filter input {
  height: 33px;
  width: 111px;
  font-size: 10px;
  color: grey;
  border-radius: 6px;
  box-shadow: 0px 8px 5px -5px rgba(0, 0, 0, 0.1);
  border: 0.5px solid grey;
  padding: 0 0 0 13px;
}
.top-level-container {
  height: calc(100vh - 22px);
  overflow-y: scroll;
  background-color: #eef4f5;
  margin-top: 57px;
}
.cardList-container {
  columns: 13rem auto;
  column-gap: 68px;
  margin: 36px 90px 0 44px;
}

.empty img {
  height: 448px;
  width: auto;
}
.empty h1 {
  color: #487172;
  display: inline;
  margin-left: -361px;
}
.container {
  width: 100%;
  height: 57vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: -85px;
}
.loader {
  width: 50px;
  padding: 8px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #25b09b;
  --_m: conic-gradient(#0000 10%, #000), linear-gradient(#000 0 0) content-box;
  -webkit-mask: var(--_m);
  mask: var(--_m);
  -webkit-mask-composite: source-out;
  mask-composite: subtract;
  animation: l3 1s infinite linear;
  margin: 35vh 10px 10px 45vw;
}
@keyframes l3 {
  to {
    transform: rotate(1turn);
  }
}
</style>
../stores/index.js
