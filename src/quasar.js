import Vue from 'vue';

import './styles/quasar.styl';
import '@quasar/extras/roboto-font/roboto-font.css';
import '@quasar/extras/material-icons/material-icons.css';
import '@quasar/extras/fontawesome-v5/fontawesome-v5.css';
import '@quasar/extras/eva-icons/eva-icons.css';

import {
  Quasar,
  QLayout,
  QHeader,
  QDrawer,
  QPageContainer,
  QPage,
  QToolbar,
  QToolbarTitle,
  QBtn,
  QIcon,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  QSplitter,
  QScrollArea,
  QExpansionItem,
  QAvatar,
  QBtnToggle,
  QSeparator,
  QTooltip,
  QTable,
  QCard,
  QCardSection,
  QSelect,
  QToggle
} from 'quasar';

Vue.use(Quasar, {
  config: {},
  components: {
    QLayout,
    QHeader,
    QDrawer,
    QPageContainer,
    QPage,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon,
    QList,
    QItem,
    QItemSection,
    QItemLabel,
    QSplitter,
    QScrollArea,
    QExpansionItem,
    QAvatar,
    QBtnToggle,
    QSeparator,
    QTooltip,
    QTable,
    QCard,
    QCardSection,
    QSelect,
    QToggle
  },
  directives: {},
  plugins: {}
});
