<template>
  <div class="row justify-center">
    <div class="content q-gutter-y-md">
      <q-input
        v-model="filter_sn"
        @update:model-value="filtered_sn"
        outlined
        label="Поиск по серийному номеру"
      ></q-input>
      <q-list bordered separator>
        <q-item class="row">
          <q-item-section class="col-1">Код </q-item-section
          ><q-item-section class="col-2">Тип оборудования</q-item-section
          ><q-item-section class="col-2">Серийный номер</q-item-section
          ><q-item-section class="col-2">Примечание</q-item-section
          ><q-item-section class="col-3"></q-item-section>
        </q-item>
        <q-item
          v-for="(equipment, index) in filtered_list_equipment"
          :key="index"
        >
          <q-item-section class="col-1">{{
            equipment.id_type_equipment
          }}</q-item-section
          ><q-item-section class="col-2">{{
            equipment.name_type_equipment
          }}</q-item-section
          ><q-item-section class="col-2">{{
            equipment.sn_equipment
          }}</q-item-section
          ><q-item-section>{{ equipment.prim_equipment }}</q-item-section
          ><q-item-section class="col-1"
            ><div class="q-gutter-sm">
              <q-btn
                @click="change_form_edit_equipment(equipment)"
                color="white"
                text-color="black"
                icon="edit"
                size="sm"
                round
              /><q-btn
                @click="confirm_del_equipment(equipment)"
                color="white"
                text-color="black"
                icon="clear"
                size="sm"
                round
              /></div
          ></q-item-section>
        </q-item>
      </q-list>
      <!--диалог редактирования оборудования -->
      <q-dialog v-model="form_edit_equipment">
        <q-card class="width_80vw">
          <q-card-section class="row justify-between">
            <div class="text-h5"></div>
            <q-btn flat label="закрыть" color="primary" v-close-popup></q-btn>
          </q-card-section>

          <q-card-section class="row items-center">
            <!--компонент форма редактирования оборудования -->
            <form-edit-equipment
              :idequipment="id_selected_equipment"
            ></form-edit-equipment>
          </q-card-section>

          <!-- <q-card-actions align="right">
            <q-btn
              flat
              label="Применить изменения"
              @click="({ id_equipment: id_selected_equipment })"
              color="primary"
              v-close-popup
            />
            <q-btn
              flat
              label="Отмена изменений"
              color="primary"
              v-close-popup
            />
          </q-card-actions> -->
        </q-card>
      </q-dialog>
      <!-- диалог подтверждения удаления оборудования -->
      <q-dialog v-model="confirm">
        <q-card>
          <q-card-section class="row items-center">
            <span class="q-ml-sm">{{ text_dialog }}</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              flat
              label="Да"
              @click="del_equipment({ id_equipment: id_selected_equipment })"
              color="primary"
              v-close-popup
            />
            <q-btn flat label="Нет" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import { mapGetters, mapActions } from "vuex";
import { useQuasar } from "quasar";
import FormEditEquipment from "@/components/form_edit_equipment";

export default {
  setup() {
    const $q = useQuasar();
    return {
      alert: ref(false),
      confirm: ref(false),
      prompt: ref(false),
      form_edit_equipment: ref(false),
      showNotifydeleq() {
        $q.notify({
          position: "top-right",
          message: "Оборудование успешно удалено из базы",
          type: "positive",
        });
      },
      showNotifydeleqerror() {
        $q.notify({
          position: "top-right",
          message: "Произошла ошибка при удалении оборудования из базы)",
          type: "negative",
        });
      },
    };
  },

  data() {
    return {
      filtered_list_equipment: null,
      name_type_list_equipmen: null,
      id_selected_equipment: null,
      text_dialog: "",
      filter_sn: "",
    };
  },
  async created() {
    //await this.filtered_list_equipment = this.name_type_list_equipment;
    //console.log("jjjj");
  },
  async mounted() {
    await this.get_types_equipment();
    await this.get_list_equipment();
    console.log("mounted");
    console.log(this.name_type_list_equipment);
    this.filtered_list_equipment = this.name_type_list_equipment;
  },
  computed: {
    ...mapGetters("types_equipment", { types_equipment: "typesequipment" }),
    ...mapGetters("equipment", {
      list_equipment: "listequipment",
      result_edding_equipment: "resulteddingequipment",
      result_del_equipment: "resultdelequipment",
      name_type_list_equipment: "nametypelistequipment",
    }),
  },
  methods: {
    ...mapActions("types_equipment", {
      get_types_equipment: "get_types_equipment",
    }),
    ...mapActions("equipment", {
      get_selected_equipment: "get_selected_equipment",
      get_list_equipment: "get_list_equipment",
      del_equipment: "del_equipment",
    }),
    //////////////////////////////////////////////////////////////////////////////////////
    confirm_del_equipment(a) {
      this.id_selected_equipment = a.id_equipment;
      console.log(a.id_equipment);
      this.confirm = true;
      this.text_dialog = `Удалить  ${a.name_type_equipment}  с серийным номером  "${a.sn_equipment}" ?`;
    },
    filtered_sn() {
      this.filtered_list_equipment = this.name_type_list_equipment.filter(
        (equipment) => {
          let regexpfiltersn = new RegExp(`^${this.filter_sn}`, "i");
          if (regexpfiltersn.test(`${equipment.sn_equipment}`)) {
            return true;
          } else {
            return false;
          }
        }
      );
    },
    async change_form_edit_equipment(a) {
      console.log(a.id_equipment);

      await this.get_selected_equipment({
        id_selected_equipment: a.id_equipment,
      });

      this.form_edit_equipment = !this.form_edit_equipmenttrue;
    },
  },

  watch: {
    result_del_equipment(val) {
      console.log(`изменилось значение на ${val}`);
      if (val == 1) {
        this.showNotifydeleq();
      } else if (val == 2) {
        this.showNotifydeleqerror();
      }
    },
    name_type_list_equipment() {
      this.filtered_sn();
    },
  },
  components: {
    FormEditEquipment,
  },
};
</script>
<style lang="scss" scoped>
.width_80vw {
  width: 80vw !important;
}
.q-dialog__inner--minimized > div {
  max-width: calc(100vw - 40px);
}
</style>