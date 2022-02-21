import axios from "axios";
export default {
  namespaced: true,
  state: () => ({
    name_type_list_equipment: null,
    list_equipment: null,
    adding: false,
    result_edding_equipment: null,
    result_del_equipment: null,
    error_edding_equipment: null,
    selected_equipment: null,
    rezult_prim_izm_equipment: null,
  }),

  getters: {
    listequipment: (state) => state.list_equipment,
    adding: (state) => state.adding,
    resulteddingequipment: (state) => state.result_edding_equipment,
    resultdelequipment: (state) => state.result_del_equipment,
    nametypelistequipment: (state) => state.name_type_list_equipment,
    selectedequipment: (state) => state.selected_equipment,
    rezultprimizmequipment: (state) => state.rezult_prim_izm_equipment,
  },
  mutations: {
    change_adding_equipment(state) {
      state.adding = !state.adding;
    },
    get_list_equipment(state, payload) {
      state.list_equipment = payload.list_equipment;
    },
    result_adding_equipment(state, payload) {
      state.result_edding_equipment = payload.result;
      state.error_edding_equipment = payload.err;
    },
    result_del_equipment(state, payload) {
      state.result_del_equipment = payload.result;
    },
    get_name_list_equipment(state, payload) {
      state.name_type_list_equipment = payload.name_list_equipment;
    },
    set_selected_equipment(state, payload) {
      state.selected_equipment = payload.selected_equipment;
    },
    rezult_prim_izm_equipment(state, payload) {
      state.rezult_prim_izm_equipment = payload.res_code;
    },
  },

  actions: {
    async get_list_equipment({ commit, getters, rootGetters, rootState }) {
      //console.log(rootState.types_equipment.types_equipment);

      await axios.get("/api/equipment").then((response) => {
        let le = response.data;
        //console.log(le);
        commit("get_list_equipment", { list_equipment: le });
      });
      //console.log(rootState.types_equipment.types_equipment);

      const www1 = getters.listequipment;

      console.log(www1);
      const type_equipment_www1 = rootGetters["types_equipment/typesequipment"];
      console.log(type_equipment_www1);
      let type_equipment_www2 = rootState;
      console.log(type_equipment_www2);
      let list_name_type_equipment = await www1.map((elem) => {
        //клонируем каждый элемент  массива(в нашем случае объект) иначе попытка изменить оригинал в state - и в итоге ошибка
        let clone_elem = Object.assign({}, elem);
        ////////////////////////////////////////////////
        let typeequipment = type_equipment_www1.filter((type) => {
          return type.id_type_equipment == elem.id_type_equipment;
        });
        console.log(typeequipment[0].name_type_equipment);
        clone_elem.name_type_equipment = typeequipment[0].name_type_equipment;
        //console.log(www);
        return clone_elem;
      });
      console.log(list_name_type_equipment);
      commit("get_name_list_equipment", {
        name_list_equipment: list_name_type_equipment,
      });
    },

    add_equipment({ commit }, payload) {
      commit("result_adding_equipment", { result: 0 });
      commit("change_adding_equipment");
      axios
        .post("/api/equipment", {
          idte: payload.idte,
          sn: payload.sn,
          prim: payload.prim,
        })
        .then((response) => {
          if (response.status == 200) {
            console.log(response.data);
            //  setTimeout(()=>{
            commit("result_adding_equipment", { result: 1 });
            commit("change_adding_equipment");
            //  },3000);
          } else {
            console.log(response.data);
            commit("result_adding_equipment", { result: 2 });
            commit("change_adding_equipment");
          }
        });
    },
    del_equipment({ commit, dispatch }, p) {
      commit("result_del_equipment", { result: 0 });
      console.log("удаление оборудования!!!");
      //axios.delete(`/api/equipment/11111`).then((response)=>{console.log(response)});
      axios.delete(`/api/equipment/${p.id_equipment}`).then((response) => {
        console.log(response);
        if (response.status == 200) {
          console.log(response.data);
          commit("result_del_equipment", { result: 1 });
          dispatch("get_list_equipment");
        } else {
          console.log(response.data);
          commit("result_del_equipment", { result: 2 });
        }
      });
    },
    async get_selected_equipment({ commit }, payload) {
      let response = await axios.get(
        `/api/equipment/${payload.id_selected_equipment}`
      );
      commit("set_selected_equipment", {
        selected_equipment: response.data,
      });
    },
    async applay_izm_equipment({ commit, dispatch }, payload) {
      commit("rezult_prim_izm_equipment", {
        res_code: 0,
      });
      let response = await axios.put(
        `/api/equipment/${payload.id_selected_equipment}`,
        {
          id_type_equipment: payload.id_type_equipment,
          sn_equipment: payload.sn_equipment,
          prim_equipment: payload.prim_equipment,
        }
      );
      console.log(response.status);
      commit("rezult_prim_izm_equipment", {
        res_code: response.status,
      });
      console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhh");
      dispatch("get_list_equipment");
    },
  },
};
