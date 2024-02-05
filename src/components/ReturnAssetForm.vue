<template>
  <form @submit.prevent="submitReturnForm">
    <div class="modal">
      <div class="modal-content">
        <h4>Return Asset</h4>
        <div class="options">
          <label for="supervisor">Loaning Supervisor <br /></label>
          <input
            type="text"
            name="supervisor"
            id="supervisor"
            :value="trans.loaningSupervisorname"
            disabled
          />
        </div>
        <div class="options">
          <label for="student">Student <br /></label>
          <input
            type="text"
            name="student"
            id="student"
            :value="trans.studentname"
            disabled
          />
        </div>
        <div class="options">
          <label for="asset">Asset <br /></label>
          <input
            type="text"
            name="asset"
            id="asset"
            :value="trans.assetName"
            disabled
          />
        </div>
        <div class="options">
          <label for="issueDate">Issue Date <br /></label>
          <input
            type="date"
            name="issueDate"
            id="issueDate"
            :value="shortDate"
            disabled
          />
        </div>
        <div class="options">
          <label for="recSup">Receiving Supervisor <br /></label>
          <select name="recSup" id="recSup" v-model="receivingSupervisorId">
            <option value="" selected>Select</option>
            <option
              v-for="sup in supervisors"
              :key="sup.userId"
              :value="sup.id"
            >
              {{ sup.firstName }} {{ sup.lastName }}
            </option>
          </select>
        </div>
        <div class="options">
          <label for="returnDate">Return Date <br /></label>
          <input
            type="date"
            name="returnDate"
            id="returnDate"
            v-model="returnDate"
          />
        </div>

        <p v-if="isInvalidInput">Please enter all values correctly</p>
        <p v-if="error">{{ error }}</p>
        <div class="btn">
          <button type="button" class="cancel" @click="close">Cancel</button>
          <button type="submit" class="submit">Save</button>
        </div>
      </div>
    </div>
  </form>
</template>
<script>
export default {
  inject: ["supervisors", "close", "rerender", "getTransactionData"],
  props: ["trans"],
  data() {
    return {
      receivingSupervisorId: "",
      receivingSupervisorName: null,
      returnDate: this.getCurrentDate(),
      isInvalidInput: false,
      error: null,
      returnType: "Return",
    };
  },
  watch: {
    receivingSupervisorId(value) {
      let selectedSup = this.supervisors.find((sup) => {
        return sup.id === value;
      });
      this.receivingSupervisorName = selectedSup
        ? selectedSup.firstName + " " + selectedSup.lastName
        : "";
    },
  },
  computed: {
    shortDate() {
      let date = new Date(this.trans.loanDate);
      return (
        date.getFullYear() +
        "-" +
        ("0" + (date.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + date.getDate()).slice(-2)
      );
    },
  },
  methods: {
    getCurrentDate() {
      let today = new Date();
      let dd = String(today.getDate()).padStart(2, "0");
      let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      let yyyy = today.getFullYear();
      today = yyyy + "-" + mm + "-" + dd;
      return today;
    },
    submitReturnForm() {
      if (this.receivingSupervisorName == null || this.returnDate === null) {
        this.isInvalidInput = true;
        console.log("Galti");
        return false;
      }
      this.isInvalidInput = false;
      this.error = null;
      console.log(this.trans);
      fetch("http://localhost:3000/transactions/" + this.trans.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: this.trans.id,
          transactionType: this.returnType,
          loaningSupervisorId: this.trans.loaningSupervisorId,
          loaningSupervisorname: this.trans.loaningSupervisorname,
          studentId: this.trans.studentId,
          studentname: this.trans.studentname,
          assetId: this.trans.assetId,
          assetName: this.trans.assetName,
          loanDate: this.trans.loanDate,
          receivingSupervisorId: this.receivingSupervisorId,
          receivingSupervisorname: this.receivingSupervisorName,
          returnDate: this.returnDate,
        }),
      })
        .then((response) => {
          if (response.ok) {
            this.receivingSupervisorId = "";
            this.receivingSupervisorName = "";
            this.returnDate = null;
            this.isInvalidInput = false;
            this.error = null;
          } else {
            console.log("NHK??");
          }
          this.getTransactionData();
          // this.rerender();
          this.close();
        })
        .catch((error) => {
          console.log("Failed" + error.message);
        });
    },
  },
};
</script>
<style scoped>
.modal {
  display: block; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 6; /* Sit on top */
  padding-top: 35px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  /* overflow: hidden; Enable scroll if needed */
  background-color: rgba(63, 89, 138, 0.4); /* Black w/ opacity */
  backdrop-filter: blur(5px);
  /* scroll-behavior: ; */
}
.modal-content {
  background-color: #fefffe;
  padding: 13px 2px 13px 13px;
  border-radius: 11px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  max-width: 276px;
  width: 100%;
  height: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
p {
  margin-bottom: 0;
}
h4 {
  margin-bottom: -3px;
  margin-top: 2px;
}
.options label {
  font-weight: bolder;
  font-size: 8px;
  display: block;
  text-align: start;
  margin-left: 5px;
  margin-bottom: 5px;
  margin-top: 14px;
  color: grey;
}
.options {
  display: inline-flex;
  flex-direction: column;
}
.options select {
  height: 26px;
  width: 262px;
  font-size: 8px;
  box-shadow: 0px 0.5px 1px grey;
  border-radius: 7px;
  color: grey;
}
option {
  font-weight: bold;
  color: rgb(91, 76, 76);
  font-size: larger;
}
.options input {
  height: 25px;
  width: 261px;
  font-size: 10px;
  border-radius: 7px;
  border: 1px solid;
  color: grey;
}
.btn {
  display: flex;
}
.cancel {
  border-radius: 4px;
  background-color: white;
  border: 1px solid grey;
  width: 125px;
  height: 34px;
  margin-top: 19px;
  font-size: 12px;
}
.submit {
  border-radius: 4px;
  background-color: #487172;
  border: 1px solid grey;
  width: 125px;
  height: 34px;
  margin-top: 19px;
  color: white;
  margin-left: 12px;
  font-size: 12px;
}
</style>
