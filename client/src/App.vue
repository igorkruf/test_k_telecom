<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="row justify-end">
      <q-tabs v-model="tab" inline-label class="">
        <q-route-tab
          to="/list_equipment"
          icon="list"
          label="Список оборудования"
        />
        <q-route-tab
          to="/add_equipment"
          icon="add"
          label="Добавить оборудование"
        />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view></router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
//import { ref } from "vue";
//import HelloWorld from "./components/HelloWorld.vue";

export default {
  //name: "LayoutDefault",

  components: {},

  setup() {
    return {};
  },

  methods: {},
  mounted() {},
};
</script>
<style lang="scss">
.content {
  // color: $main_color1;
  border: 0px solid red;
  width: 100%;
  max-width: 1000px;
  padding-top: 20px;
}
</style>
