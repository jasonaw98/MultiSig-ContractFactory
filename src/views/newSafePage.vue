<template>
    <v-row class="align-center ma-0 px-sm-12 wrapper">
      <v-col cols="12" class="">
        <h2 class="mb-3">Create new safe</h2>
        <NewSafe></NewSafe>
      </v-col>
    </v-row>
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
