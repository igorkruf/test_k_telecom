import { createStore } from "vuex";
import types_equipment from "./type_equipment";
import equipment from "./equipment";
// import sotrudniki from "./sotrudniki";
// import users from './Users/users';
export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    types_equipment,
    equipment,
  },
  //для того что-бы напрямую не менять значение в STORE
  strict: process.env.NODE_ENV !== "production",
});
