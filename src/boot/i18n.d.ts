import VueI18n from 'vue-i18n'
import Vue from 'vue';

declare module "vue/types/vue" {
  interface VueConstructor {
    i18n: VueI18n;
  }

  interface Vue {
    // Note this only on root Vue componet: `this.$root`
    i18n: VueI18n;
  }
}
