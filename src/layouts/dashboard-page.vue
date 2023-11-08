<template>
  <v-app>
    <div id="dashboard-page">
      <Header></Header>
      <router-view @showSnackbar="showSnackbar"></router-view>
      <v-snackbar v-model="snackbar" :color="color" rounded="pill" class="mb-3" elevation="24" transition="slide-y-reverse-transition">
        {{text}}
        <template v-slot:action="{ attrs }">
          <v-btn
            color="white"
            icon
            x-small
            v-bind="attrs"
            @click="snackbar = false"
            class="mr-2"
          >
            <v-icon>fa-solid fa-xmark</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-app>
</template>
<script>
import Header from "../components/header.vue";
export default {
  components: {
    Header,
  },
  data() {
    return {
      snackbar: false,
      color: "success",
      text: null
    }
  },
  methods: {
    showSnackbar(data) {
      if(data.text){
        this.text = data.text;
      }
      if(data.color){
        this.color = data.color;
      }
      this.snackbar = true;
    }
  }
}
</script>