import axios from "axios";
export default {
  namespaced: true,
  state: () => ({
    types_equipment: null,
  }),

  getters: {
    typesequipment: (state) => state.types_equipment,
  },
  mutations: {
    get_types_equipment(state, payload) {
      state.types_equipment = payload.types_equipment;
    },
  },

  actions: {
    async get_types_equipment({ commit }) {
      let response = await axios.get("/api/get_types_equipment");
      let te = response.data;
      console.log(te);
      commit("get_types_equipment", { types_equipment: te });
    },
  },
};
