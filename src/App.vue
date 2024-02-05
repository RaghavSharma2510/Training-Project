<template>
  <home-page
    :students="students"
    :supervisors="supervisors"
    :assets="assets"
  ></home-page>
</template>
<script>
import HomePage from "./components/HomePage.vue";

export default {
  components: {
    HomePage,
  },
  provide() {
    return {
      students: this.students,
      supervisors: this.supervisors,
    };
  },
  data() {
    return {
      students: [],
      supervisors: [],
      assets: [],
    };
  },
  methods: {
    compareUser(a, b) {
      if (a.firstName < b.firstName) {
        return -1;
      }
      if (a.firstName > b.firstName) {
        return 1;
      }
      return 0;
    },
    compareAsset(a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    },
    getUserData() {
      fetch("http://localhost:3000/users")
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((data) => {
          for (const id of data) {
            // this.users.push(id);
            if (id.role === "Student") {
              this.students.push(id);
            } else {
              this.supervisors.push(id);
            }
            this.students.sort(this.compareUser);
            this.supervisors.sort(this.compareUser);
          }
        })
        .catch((err) => {
          console.log("Something Went Wrong!!! " + err);
        });
    },
    getAssetData() {
      fetch("http://localhost:3000/assets")
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
          res.sort(this.compareAsset);
          this.assets = [...res];
        })
        .catch((err) => {
          console.log("Something Went Wrong!!! " + err);
        });
    },

    showData() {
      console.log(this.assets);
    },
  },
  mounted() {
    this.getUserData();
    this.getAssetData();
  },
};
</script>
<style>
html {
  width: 100vw;
  /* font-family: "Comic Neue", cursive; */
  font-family: "Roboto", sans-serif;
}
home-page {
  display: block;
}
body {
  width: 100%;
  overflow: hidden;
}
</style>
