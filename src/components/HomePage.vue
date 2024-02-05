<template>
  <div class="logo">
    <img src="../assets/logo.png" alt="App Logo" />
    <div class="userSelect">
      <button
        v-if="isSupervisor"
        id="create-transaction-button"
        @click="selectForm('Loan')"
      >
        <b>Create Transaction</b>
      </button>
      <select name="userSelect" id="userSelect" v-model="currentUser">
        <option value="" disabled>Select User</option>
        <option
          value="3b0e3b06-b23f-44e5-956c-807f38456a1b"
          selected="3b0e3b06-b23f-44e5-956c-807f38456a1b"
        >
          Amara Will (Supervisor)
        </option>
        <option
          v-for="(sup, index) in supervisors"
          :key="index"
          :value="sup.id"
        >
          {{ sup.firstName }} {{ sup.lastName }} (Supervisor)
        </option>
        <hr style="border-top: dotted 1px" />
        <option v-for="(stud, index) in students" :key="index" :value="stud.id">
          {{ stud.firstName }} {{ stud.lastName }} (Student)
        </option>
      </select>
    </div>
  </div>
  <loan-asset-form v-if="openLoanForm" :assets="assets"></loan-asset-form>
  <transactions-details
    :isSupervisor="isSupervisor"
    :assets="assets"
    :currentUser="currentUser"
    :key="key"
  ></transactions-details>
</template>
<script>
import TransactionsDetails from "./TransactionsDetails.vue";
import LoanAssetForm from "./LoanAssetForm.vue";
export default {
  provide() {
    return {
      isSupervisor: this.isSupervisor,
      closeLoan: this.closeLoan,
      rerender: this.rerender,
    };
  },
  props: ["students", "supervisors", "assets"],
  components: {
    LoanAssetForm,
    TransactionsDetails,
  },
  watch: {
    currentUser(value) {
      let curUser = this.supervisors.findIndex((sup) => {
        return sup.id === value;
      });
      this.isSupervisor = curUser >= 0 ? true : false;
    },
  },
  data() {
    return {
      isSupervisor: true,
      currentUser: "3b0e3b06-b23f-44e5-956c-807f38456a1b",
      openLoanForm: false,
      key: 0,
    };
  },
  methods: {
    selectForm(form) {
      if (form === "Loan") {
        this.openLoanForm = true;
      }
    },
    closeLoan() {
      // event.stopPropagation();
      console.log("close");
      this.openLoanForm = false;
    },
    rerender() {
      this.key++;
    },
  },
  beforeUnload() {
    window.localStorage.clear();
  },
};
</script>
<style scoped>
.container1 {
  background-color: #d6e4e5;
  margin-left: -8px;
  margin-top: -15px;
  margin-right: 10px;
  height: 100px;
}

.userSelect {
  /* display: flex; */
  margin: 0 50px 10px 0;
  column-count: inherit;
  /* justify-content: space-around; */
}
#create-transaction-button {
  margin: 10px;
  background-color: #487172;
  color: whitesmoke;
  border: white;
  width: 118px;
  min-width: 118px;
  height: 34px;
  border-radius: 9px;
  font-size: 8px;
  /* padding-right: 30px; */
  /* padding-left: 27px; */
  cursor: pointer;
}
#userSelect {
  max-width: 118px;
  width: auto;
  height: 33px;
  margin: 10px;
  box-shadow: 0px 10px 5px -5px rgba(0, 0, 0, 0.1);
  border-radius: 9px;
  font-size: 8px;
  padding: 0 0 0 5px;
  color: grey;
}
.logo {
  display: flex;
  justify-content: space-between;
  padding-top: 29px;
  /* margin-right: 10px; */
  background-color: #d6e4e5;
  margin-left: -8px;
  margin-top: -15px;
  height: auto;
  min-height: 57px;
  box-shadow: 0 0 10px grey;
  width: 100vw;
  overflow-x: hidden;
  position: fixed;
  z-index: 5;
}
option {
  color: black;
  font-weight: bold;
  font-family: "Comic Neue", cursive;
}
.logo img {
  display: inline;
  width: 107px;
  height: 40px;
  align-self: start;
  padding-left: 67px;
}
.background {
  background-color: #ccc;
}
</style>
