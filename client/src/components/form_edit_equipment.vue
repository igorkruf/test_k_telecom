<template>
  <div class="row justify-center width_100">
    <div class="content q-gutter-y-md">
      {{ selected_equipment }}
      <!--{{ types_equipment }} -->

      <q-select
        v-model="model"
        @update:model-value="fff"
        id="te"
        outlined
        :options="types_equipment"
        option-value="id_type_equipment"
        option-label="name_type_equipment"
        label="Выбери тип оборудования"
      />
      <q-input
        class="snomer"
        outlined
        v-model="text"
        label="Серийный номер"
        @update:model-value="validate_sn"
        >Маска {{ maska_sn }}</q-input
      >
      <q-input
        @update:model-value="validate_sn"
        v-model="textareaModel"
        outlined
        type="textarea"
        label="Примечание"
      />
      <div class="row justify-end q-gutter-x-md">
        <q-btn
          :loading="adding"
          @click="appl_izm_equipment"
          v-if="validated"
          color="primary"
          label="Сохранить изменения"
          class="btn_add_equipment"
          ><template v-slot:loading> <q-spinner-facebook /> </template
        ></q-btn>
        <q-btn
          :loading="adding"
          @click="otmena_izm_equipment"
          color="primary"
          label="Отмена изменений"
          class="btn_add_equipment"
          ><template v-slot:loading> <q-spinner-facebook /> </template
        ></q-btn>
      </div>
    </div>
  </div>

  <!-- <span>Выбранное оборудование: {{ selected_equipment }}</span> -->
</template>
<script>
import { mapGetters, mapActions } from "vuex";
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
      showNotifyediteq() {
        $q.notify({
          position: "top-right",
          message: "Оборудование успешно изменено в базе",
          type: "positive",
        });
      },
      showNotifyediteqerror() {
        $q.notify({
          position: "top-right",
          message:
            "Произошла ошибка при изменении оборудования (возможно оборудование с таким серийным номером уже есть)",
          type: "negative",
        });
      },
    };
  },

  props: ["idequipment"],
  data() {
    return {
      model: null,
      maska_sn: null,
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
    };
  },
  computed: {
    ...mapGetters("types_equipment", { types_equipment: "typesequipment" }),
    ...mapGetters("equipment", {
      selected_equipment: "selectedequipment",
      rezult_prim_izm_equipment: "rezultprimizmequipment",
    }),
  },
  methods: {
    // ...mapActions("types_equipment", {
    //   get_types_equipment: "get_types_equipment",
    // }),
    ...mapActions("equipment", {
      get_selected_equipment: "get_selected_equipment",
      applay_izm_equipment: "applay_izm_equipment",
    }),

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
      this.text = null;
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
    otmena_izm_equipment() {
      this.validated = false;
      let vm = this;
      let teq = this.types_equipment.filter(function (elem) {
        if (elem.id_type_equipment == vm.selected_equipment.id_type_equipment) {
          return true;
        } else {
          return false;
        }
      });
      this.model = teq[0];
      this.text = this.selected_equipment.sn_equipment;
      this.maska_sn = teq[0].mask_sn_type_equipment;
      this.textareaModel = this.selected_equipment.prim_equipment;
      console.log(`dddddddddddddddddddddd: ${this.model}`);
      /////////////////////////////////////////

      let masksnarr = this.maska_sn.split("");
      this.regexpsnarr = masksnarr.map((elem) => {
        return this.as_maska_sn.get(elem);
      });
      console.log(this.regexpsnarr);
      this.regexpsnstr = this.regexpsnarr.join("");
      console.log(this.regexpsnstr);

      ////////////////////////////////////////////
    },
    appl_izm_equipment() {
      this.applay_izm_equipment({
        id_type_equipment: this.model.id_type_equipment,
        sn_equipment: this.text,
        prim_equipment: this.textareaModel,
        id_selected_equipment: this.selected_equipment.id_equipment,
      });
      console.log("сохраняем изменения");
    },
  },
  created() {},
  mounted() {
    console.log(this.selected_equipment);
    let vm = this;
    let teq = this.types_equipment.filter(function (elem) {
      if (elem.id_type_equipment == vm.selected_equipment.id_type_equipment) {
        return true;
      } else {
        return false;
      }
    });

    console.log(teq);
    this.model = teq[0];
    this.text = this.selected_equipment.sn_equipment;
    this.maska_sn = teq[0].mask_sn_type_equipment;
    this.textareaModel = this.selected_equipment.prim_equipment;
    console.log(`dddddddddddddddddddddd: ${this.model}`);
    /////////////////////////////////////////

    let masksnarr = this.maska_sn.split("");
    this.regexpsnarr = masksnarr.map((elem) => {
      return this.as_maska_sn.get(elem);
    });
    console.log(this.regexpsnarr);
    this.regexpsnstr = this.regexpsnarr.join("");
    console.log(this.regexpsnstr);

    ////////////////////////////////////////////
  },
  watch: {
    rezult_prim_izm_equipment(val) {
      console.log(`изменилось значение на ${val}`);
      if (val == 200) {
        this.showNotifyediteq();
      } else if (val == 201) {
        this.showNotifyediteqerror();
      }
    },
  },
  //////////////////////////////////////////////////////////////////////////////////////
};
</script>
<style lang="scss">
.width_100 {
  width: 100%;
}
</style>