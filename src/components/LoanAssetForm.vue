<template>
  <form @submit.prevent="submitForm">
    <div class="modal">
      <div class="modal-content">
        <h4>Loan Asset</h4>
        <div class="options">
          <label for="supervisor">Supervisor <br /></label>
          <select name="supervisor" id="supervisor" v-model="supId">
            <option value="" selected>Select</option>
            <option v-for="sup in supervisors" :key="sup.id" :value="sup.id">
              {{ sup.firstName }} {{ sup.lastName }}
            </option>
          </select>
        </div>
        <br />
        <div class="options">
          <label for="student">Student <br /></label>
          <select name="student" id="student" v-model="studId">
            <option value="" selected>Select</option>
            <option v-for="stud in students" :key="stud.id" :value="stud.id">
              {{ stud.firstName }} {{ stud.lastName }}
            </option>
          </select>
        </div>
        <br />
        <div class="options">
          <label for="Asset">Asset <br /></label>
          <select name="Asset" id="Asset" v-model="assetId">
            <option value="" selected>Select</option>
            <option v-for="asset in assets" :key="asset.id" :value="asset.id">
              {{ asset.name }}
            </option>
          </select>
        </div>
        <br />
        <div class="options">
          <label for="issueDate">Issue Date</label>
          <input
            type="date"
            name="issueDate"
            id="issueDate"
            v-model="issueDate"
          />
        </div>
        <p v-if="isInvalidInput">Please enter all values correctly</p>
        <p v-if="error">{{ error }}</p>
        <div class="btn">
          <button role="button" type="button" @click="closeLoan" class="cancel">
            Cancel
          </button>

          <button role="button" type="submit" class="submit">Save</button>
        </div>
      </div>
    </div>
  </form>
</template>
<script>
export default {
  data() {
    return {
      transId: this.uuidv4(),
      supId: "",
      studId: "",
      assetId: "",
      issueDate: "",
      assetName: "",
      studName: "",
      supName: "",
      isInvalidInput: false,
      error: null,
    };
  },
  inject: ["supervisors", "students", "closeLoan", "rerender"],
  watch: {
    assetId(value) {
      let selectedAsset = this.assets.find((asset) => {
        return asset.id === value;
      });
      this.assetName = selectedAsset ? selectedAsset.name : "";
    },
    studId(value) {
      let selectedstud = this.students.find((stud) => stud.id === value);
      this.studName = selectedstud
        ? selectedstud.firstName + " " + selectedstud.lastName
        : "";
    },
    supId(value) {
      let selectedSup = this.supervisors.find((sup) => sup.id === value);
      this.supName = selectedSup
        ? selectedSup.firstName + " " + selectedSup.lastName
        : "";
    },
  },
  methods: {
    submitForm() {
      if (
        this.supId === "" ||
        this.studId === "" ||
        this.assetId === "" ||
        this.issueDate === ""
      ) {
        this.isInvalidInput = true;
        return;
      } else {
        this.invalidInput = false;
        this.error = null;
        fetch("http://localhost:3000/transactions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: this.transId,
            transactionType: "Loan",
            loaningSupervisorId: this.supId,
            loaningSupervisorname: this.supName,
            studentId: this.studId,
            studentname: this.studName,
            assetId: this.assetId,
            assetName: this.assetName,
            loanDate: this.issueDate,
            receivingSupervisorId: null,
            receivingSupervisorname: null,
            returnDate: null,
          }),
        })
          .then((response) => {
            if (response.ok) {
              this.studId = "";
              this.supId = "";
              this.assetId = "";
              this.issueDate = "";
              this.assetName = "";
              this.studName = "";
              this.supName = "";
              this.isInvalidInput = false;
              this.error = null;
            } else {
              console.log("NHK");
            }
            this.closeLoan();
            this.rerender();
          })
          .catch((error) => {
            console.log("Failed" + error.message);
          });
      }
    },
    uuidv4() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          const r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    },
  },

  props: ["assets"],
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
  overflow: auto; /* Enable scroll if needed */
  background-color: rgba(63, 89, 138, 0.4);
  backdrop-filter: blur(5px);
}
.modal-content {
  background-color: #fefffe;
  padding: 13px 2px 13px 13px;
  border-radius: 11px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  max-width: 258px;
  width: 100%;
  height: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
h4 {
  margin-bottom: -3px;
  margin-top: 2px;
}
p {
  margin-bottom: 0;
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
  width: 245px;
  font-size: 10px;
  box-shadow: 0px 0.5px 1px grey;
  border-radius: 7px;
}
option {
  font-weight: bold;
  color: rgb(91, 76, 76);
  font-size: larger;
}
.options input {
  height: 25px;
  width: 243px;
  font-size: 10px;
  border-radius: 7px;
  border: 1px solid;
  color: grey;
}
.btn {
  display: flex;
  justify-content: space-between;
}
.cancel {
  border-radius: 4px;
  background-color: white;
  border: 1px solid grey;
  width: 117px;
  height: 34px;
  margin-top: 19px;
  font-size: 12px;
}
.submit {
  border-radius: 4px;
  background-color: #487172;
  border: 1px solid grey;
  width: 118px;
  height: 34px;
  margin-top: 19px;
  color: white;
  margin-right: 12px;
  font-size: 12px;
}
</style>
