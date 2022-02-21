import { createWebHistory, createRouter } from "vue-router";
import list_equipment from "@/components/list_equipment.vue";
import add_equipment from "@/components/add_equipment.vue";

const routes = [
  {
    path: "/list_equipment",
    name: "list_equipment",
    component: list_equipment,
    meta: { title: "Список оборудования" },
  },
  {
    path: "/add_equipment",
    name: "add_equipment",
    component: add_equipment,

    meta: { title: "Редактирование, удаление оборудования" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
////////Меняем title страницы после перехода по роуту
const DEFAULT_TITLE = "Тест К-телеком";
router.afterEach((to) => {
  document.title = to.meta.title || DEFAULT_TITLE;
});

export default router;
