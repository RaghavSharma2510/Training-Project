<template>
  <div
    :class="[
      { card: !expand },
      { expandGreen: expandGreen },
      { expandOrange: expandOrange },
    ]"
    @click="toggleExpand"
  >
    <div class="topIconContainer">
      <div
        :class="expand ? 'orangeCircleExpand' : 'orangeCircle'"
        v-if="trans.transactionType === 'Loan'"
      ></div>
      <div
        class="editIconContainer"
        v-if="isSupervisor && trans.transactionType === 'Loan' && expand"
      >
        <img
          src="../assets/pen-svgrepo-com.svg"
          alt=""
          class="editIcon"
          @click="openEditForm"
        />
      </div>
      <div
        :class="expand ? 'greenCircleExpand' : 'greenCircle'"
        v-if="trans.transactionType === 'Return'"
      ></div>
    </div>
    <img v-if="expand" src="../assets/laptop.jpg" alt="" class="laptop" />
    <div class="id">
      {{ trans.id }}
    </div>
    <div class="assetName">{{ trans.assetName }}</div>
    <div class="studentName">{{ trans.studentname }}</div>
    <div class="badgeList">
      <span class="badge" v-if="trans.receivingSupervisorname">
        <b>Return Date: </b> {{ formattedReturnDate(trans.returnDate) }}
      </span>
      <span class="badge">
        <b>Issue Date: </b>
        {{ formattedReturnDate(trans.loanDate) }}
      </span>
      <span class="badge" v-if="!trans.receivingSupervisorname || expand">
        <b>Loaning Supervisor: </b> {{ trans.loaningSupervisorname }}
      </span>
      <span class="badge" v-if="trans.receivingSupervisorname">
        <b>Receiving Supervisor: </b>
        {{ trans.receivingSupervisorname }}
      </span>
      <span class="badge" v-if="expand">
        <b>Asset ID: </b> {{ trans.assetId }}
      </span>
      <span class="badge" v-if="expand"
        ><b>Model: </b> {{ findModelName() }}</span
      >
    </div>
    <div
      class="returnIconContainer"
      v-if="isSupervisor && trans.transactionType === 'Loan' && expand"
    >
      <div class="returnImg">
        <img
          src="../assets/file-arrow-down-svgrepo-com.svg"
          alt=""
          @click="openReturnForm"
          id="returnImg"
        />
      </div>
    </div>
  </div>
  <return-asset-form v-if="returnForm" :trans="trans"></return-asset-form>
  <edit-form v-if="editForm" :trans="trans" :assets="assets"></edit-form>
</template>
<script>
import ReturnAssetForm from "./ReturnAssetForm.vue";
import EditForm from "./EditForm.vue";
export default {
  components: {
    ReturnAssetForm,
    EditForm,
  },
  props: ["trans", "isSupervisor", "assets"],
  provide() {
    return {
      close: this.close,
      closeEdit: this.closeEdit,
    };
  },
  data() {
    return {
      returnForm: false,
      editForm: false,
      expand: false,
      expandGreen: false,
      expandOrange: false,
    };
  },
  methods: {
    findModelName() {
      for (let asset of this.assets) {
        if (asset.id === this.trans.assetId) {
          return asset.model;
        }
      }
      return 0;
    },
    toggleExpand(event) {
      event.stopPropagation();
      this.expand = !this.expand;
      if (this.trans.transactionType === "Loan") {
        this.expandOrange = !this.expandOrange;
      } else {
        this.expandGreen = !this.expandGreen;
      }
    },
    formattedReturnDate(lol) {
      const returnDate = new Date(lol);
      const year = returnDate.getFullYear();
      const month = String(returnDate.getMonth() + 1).padStart(2, "0");
      const day = String(returnDate.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    openReturnForm() {
      // event.stopPropagation();
      this.returnForm = true;
      return false;
    },
    openEditForm(event) {
      event.stopPropagation();
      this.editForm = true;
      return false;
    },
    close(event) {
      event.stopPropagation();
      this.returnForm = false;
      return false;
    },
    closeEdit(event) {
      event.stopPropagation();
      this.editForm = false;
      return false;
    },
  },
};
</script>
<style scoped>
.expandOrange {
  border: 2.5px solid orange;
  display: block;
  width: 232px;
  height: auto;
  padding: 15px;
  margin: 10px;
  border-radius: 14px;
  overflow: auto;
  grid-column: 1 / -1;
  cursor: pointer;
  background: white;

  position: relative;
}
.expandGreen {
  border: 2.5px solid green;
  position: relative;
  display: block;
  width: 232px;
  height: auto;
  padding: 15px;
  margin: 10px;
  border-radius: 14px;
  overflow: auto;
  grid-row: span 2;
  background: white;
  cursor: pointer;
}
.card {
  display: inline-block;
  width: 232px;
  height: auto;
  min-height: 153px;
  max-height: 215px;
  padding: 15px;
  border: 1px solid #ccc;
  box-shadow: 0 4px 8px -4px grey;
  margin: 10px 0 5px 10px;
  border-radius: 11px;
  overflow: auto;
  cursor: pointer;
  position: relative;
  background: white;
}
.id {
  font-size: 7px;
  margin: 10px 0 10px 0;
  font-weight: 1000;
  color: darkslategrey;
}

.assetName {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  font-family: sans-serif;
}
.studentName {
  font-size: 13px;
  font-weight: bold;
  margin-bottom: 18px;
}
.badgeList {
  display: flex;
  justify-content: flex-start;
  margin: 12px -14px 0 0;
  flex-wrap: wrap;
}
.badge {
  display: inline-flex;
  width: auto;
  font-size: 9.3px;
  border-radius: 8px;
  padding: 6px 6px 7px 6px;
  background-color: #f8f8f9;
  border-color: #d1d4dc;
  border: 1px solid #d1d4dc;
  margin: 0px 5px 8px 0px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  height: auto;
}
.topIconContainer {
  display: grid;
  z-index: 1;
  position: absolute;
  width: 248px;
  margin: -10px;
}
.editIconContainer {
  background-color: #ea653e;
  justify-self: flex-end;
  height: 35px;
  width: 35px;
  z-index: 1;
  border-radius: 50%;
  margin-right: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.editIcon {
  background-color: #ea653e;
  height: 18px;
  width: 18px;
  justify-self: flex-end;
  z-index: inherit;
  padding: 3px 3px 3px 3px;
  border-radius: 50%;
}
.laptop {
  height: 131px;
  width: 262px;
  margin-left: -15px;
  z-index: 0;
  position: relative;
  margin-top: -15px;
}
.returnIconContainer {
  display: flex;
  justify-content: flex-end;
}
.returnImg {
  width: 35px;
  height: 35px;
  background-color: #ea653e;
  border-radius: 50%;
  display: flex;
  justify-content: center;
}
#returnImg {
  background-color: #ea653e;
  border-radius: 50%;
  height: 20px;
  width: 20px;
  padding: 8px 3px 3px 3px;
}
.greenCircle {
  width: 14px;
  height: 14px;
  justify-self: flex-end;
  background-color: #487073;
  border-radius: 50%;
}
.greenCircleExpand {
  width: 14px;
  height: 14px;
  justify-self: flex-start;
  background-color: #487073;
  border-radius: 50%;
}
.orangeCircle {
  width: 14px;
  height: 14px;
  justify-self: flex-end;
  background-color: #ea653e;
  border-radius: 50%;
}
.orangeCircleExpand {
  width: 14px;
  height: 14px;
  justify-self: flex-start;
  background-color: #ea653e;
  border-radius: 50%;
}
b {
  font-weight: 600;
}
</style>
