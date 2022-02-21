<template>
  <div class="row justify-center">
    <div class="content q-gutter-y-md">
      <q-select
        v-model="model"
        @update:model-value="fff"
        id="te"
        outlined
        :options="types_equipment"
        option-value="id_type_equipment"
        option-label="name_type_equipment"
        label="Выбери тип оборудования"
        @filter="filterFn"
      />
      <q-input
        v-if="selected_type_equipment"
        class="snomer"
        outlined
        v-model="text"
        label="Серийный номер"
        @update:model-value="validate_sn"
        >Маска {{ maska_sn }}</q-input
      >
      <q-input
        v-if="validated"
        v-model="textareaModel"
        outlined
        type="textarea"
        label="Примечание"
      />
      <q-btn
        :loading="adding"
        @click="
          add_equipment({
            idte: model.id_type_equipment,
            sn: text,
            prim: textareaModel,
          })
        "
        v-if="validated"
        color="primary"
        label="ДОБАВИТЬ"
        class="btn_add_equipment"
        ><template v-slot:loading> <q-spinner-facebook /> </template
      ></q-btn>
    </div>
  </div>
</template>
<script>
//import axios from "axios";
import { mapActions, mapGetters } from "vuex";
import { useQuasar } from "quasar";
export default {
  setup() {
    const $q = useQuasar();

    return {
      showNotifyerrorsn() {
        $q.notify({
          position: "top-right",
          message: "Ошибка в серийном номере оборудования",
          type: "negative",
        });
      },
      showNotifyaddeq() {
        $q.notify({
          position: "top-right",
          message: "Оборудование успешно добавлено базу",
          type: "positive",
        });
      },
      showNotifyaddeqerror() {
        $q.notify({
          position: "top-right",
          message:
            "Произошла ошибка при добавлении оборудования в базу(возможно оборудование с таким серийным номером уже есть)",
          type: "negative",
        });
      },
    };
  },

  data() {
    return {
      model: null,
      maska_sn: null,
      id_type_equipment: null,
      text: null,
      textareaModel: null,
      as_maska_sn: new Map([
        ["N", "[0-9]"],
        ["A", "[A-Z]"],
        ["a", "[a-z]"],
        ["X", "[a-z0-9]"],
        ["Z", "[-_@]"],
      ]),
      regexpsnarr: [],
      regexpsnstr: "",
      validated: false,
      selected_type_equipment: false,
    };
  },
  mounted() {
    this.get_types_equipment();
  },
  computed: {
    ...mapGetters("types_equipment", { types_equipment: "typesequipment" }),
    ...mapGetters("equipment", {
      adding: "adding",
      result_edding_equipment: "resulteddingequipment",
    }),
  },
  methods: {
    ...mapActions("types_equipment", {
      get_types_equipment: "get_types_equipment",
    }),
    ...mapActions("equipment", { add_equipment: "add_equipment" }),

    fff() {
      console.log(this.model.mask_sn_type_equipment);
      this.maska_sn = this.model.mask_sn_type_equipment;
      let masksnstr = this.maska_sn.trim();
      this.selected_type_equipment = true;
      //console.log(snstr);
      let masksnarr = masksnstr.split("");
      this.regexpsnarr = masksnarr.map((elem) => {
        return this.as_maska_sn.get(elem);
      });
      console.log(this.regexpsnarr);
      this.regexpsnstr = this.regexpsnarr.join("");
      console.log(this.regexpsnstr);
    },
    validate_sn() {
      if (this.text.length >= this.maska_sn.length) {
        let snstr = this.text.trim();
        //console.log(snstr);
        let regexpsn = new RegExp(`^${this.regexpsnstr}$`);
        let validate = regexpsn.test(snstr);
        console.log(validate);
        if (!validate) {
          this.validated = false;
          this.showNotifyerrorsn();
          document.querySelector(".snomer").focus();
        } else {
          this.validated = true;
        }
      } else {
        this.validated = false;
      }
    },
    // add_equipment(){

    //   axios.post("/api/add_equipment",{sn_equipment:this.text} ).then(()=>{

    //         });
    // },
    proba() {
      console.log(this.text);
    },
  },
  watch: {
    result_edding_equipment(val) {
      console.log(`изменилось значение на ${val}`);
      if (val == 1) {
        this.text = null;
        this.selected_type_equipment = false;
        this.validated = false;
        this.model = null;
        this.showNotifyaddeq();
      } else if (val == 2) {
        this.showNotifyaddeqerror();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/global.variables.scss";

.btn_add_equipment {
  width: 100% !important;
}
</style>