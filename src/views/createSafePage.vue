<template>
  <div class="landing-page-bg">
    <v-row class="h-100vh align-center ma-0 wrapper">
      <v-col cols="12" md="8" class="pa-6 mx-auto">
        <h1 class="mb-5">Create new safe</h1>
        <NewSafe></NewSafe>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import NewSafe from "../components/new_safe.vue";
export default {
  components: {
    NewSafe,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style lang="scss" scoped></style>
