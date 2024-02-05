<template>
  <form @submit.prevent="submitEditForm">
    <div class="modal">
      <div class="modal-content">
        <h4>Edit Asset</h4>
        <div class="options">
          <label for="supervisor">Loaning Supervisor <br /></label>
          <select name="supervisor" id="supervisor" v-model="supId">
            <option :value="trans.loaningSupervisorId" selected>
              {{ trans.loaningSupervisorname }}
            </option>
            <option v-for="sup in supervisors" :key="sup.id" :value="sup.id">
              {{ sup.firstName }} {{ sup.lastName }}
            </option>
          </select>
        </div>
        <br />
        <div class="options">
          <label for="student">Student <br /></label>
          <select name="student" id="student" v-model="studId">
            <option :value="trans.studentId" selected>
              {{ trans.studentname }}
            </option>
            <option v-for="stud in students" :key="stud.id" :value="stud.id">
              {{ stud.firstName }} {{ stud.lastName }}
            </option>
          </select>
        </div>
        <br />
        <div class="options">
          <label for="Asset">Asset <br /></label>
          <select name="Asset" id="Asset" v-model="assetId">
            <option :value="trans.assetId" selected>
              {{ trans.assetName }}
            </option>
            <option v-for="asset in assets" :key="asset.id" :value="asset.id">
              {{ asset.name }}
            </option>
          </select>
        </div>
        <br />
        <div class="options">
          <label for="loanDate">Loan Date</label>
          <input type="date" name="loanDate" id="loanDate" v-model="loanDate" />
        </div>
        <br />
        <p v-if="isInvalidInput">Please enter all values correctly</p>
        <p v-if="error">{{ error }}</p>
        <div class="btn">
          <button role="button" type="button" @click="closeEdit" class="cancel">
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
  inject: [
    "students",
    "supervisors",
    "closeEdit",
    "rerender",
    "getTransactionData",
  ],
  props: ["assets", "trans"],
  data() {
    return {
      supId: this.trans.loaningSupervisorId,
      studId: this.trans.studentId,
      assetId: this.trans.assetId,
      assetName: this.trans.assetName,
      studName: this.trans.studentname,
      supName: this.trans.loaningSupervisorname,
      loanDate: this.convertDateTimeToDate(this.trans.loanDate),
      transactionType: this.trans.transactionType,
      isInvalidInput: false,
      error: null,
    };
  },

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
    convertDateTimeToDate(dateTime) {
      var date = new Date(dateTime);
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var year = date.getFullYear();

      return (
        year +
        "-" +
        (month < 10 ? "0" : "") +
        month +
        "-" +
        (day < 10 ? "0" : "") +
        day
      );
    },
    submitEditForm() {
      if (this.transactionType === "Loan") {
        if (this.loanDate === "") {
          this.isInvalidInput = true;
          console.log("Galti");
          return false;
        }
      }
      let obj = {
        id: this.trans.id,
        transactionType: this.transactionType,
        loaningSupervisorId: this.supId,
        loaningSupervisorname: this.supName,
        studentId: this.studId,
        studentname: this.studName,
        assetId: this.assetId,
        assetName: this.assetName,
        loanDate: this.loanDate,
      };

      this.isInvalidInput = false;
      this.error = null;
      fetch("http://localhost:3000/transactions/" + this.trans.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      })
        .then((response) => {
          if (response.ok) {
            this.transactionType = "";
            this.supId = "";
            this.studId = "";
            this.assetId = "";
            this.supName = "";
            this.studName = "";
            this.assetName = "";
            this.loanDate = "";
            this.isInvalidInput = false;
            this.error = null;
          } else {
            console.log("NHK??");
          }
          this.getTransactionData();
          // this.rerender();
          this.closeEdit();
        })
        .catch((error) => {
          console.log("Failed" + error.message);
          console.log("NHK???");
        });
    },
  },
};
</script>
<style scoped>
body.modal-open {
  overflow: hidden;
}
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
  color: rgb(118, 104, 104);
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
