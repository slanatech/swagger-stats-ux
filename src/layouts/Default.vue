<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="leftShown = !leftShown" />

        <q-toolbar-title>
          swagger-stats
        </q-toolbar-title>

        <q-btn dense flat round icon="menu" @click="rightShown = !rightShown" />

        <q-btn dense flat size="md" round icon="refresh" @click="performRefresh" />

        <q-btn-toggle v-model="refreshTimeout" text-color="blue-grey-4" toggle-text-color="white" size="md" dense flat :options="refreshOptions" />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above :mini="miniState" v-model="leftShown" side="left" bordered @on-layout="handleLeftLayout">
      <q-list>
        <q-item v-for="item in menuItems" v-bind:key="item.link" :to="item.link" exact>
          <q-item-section avatar>
            <q-icon :name="item.icon">
              <q-tooltip anchor="top right" self="center middle">
                {{ item.title }}
              </q-tooltip>
            </q-icon>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ item.title }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator></q-separator>
        <q-btn :ripple="false" class="full-width" flat :icon="miniState ? 'chevron_right' : 'chevron_left'" size="md" @click="toggleMiniState" />
      </q-list>
    </q-drawer>

    <q-drawer v-model="rightShown" side="right" bordered>
      OPA
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  name: 'SwsUxLayout',

  data() {
    return {
      miniState: true,
      leftShown: true,
      rightShown: false,
      menuItems: [
        { title: 'Summary', link: '/', icon: 'timeline' },
        { title: 'Horizon', link: '/horizon', icon: 'waves' },
        { title: 'Requests', link: '/requests', icon: 'sync_alt' },
        { title: 'Errors', link: '/errors', icon: 'error' },
        { title: 'Last Errors', link: '/lasterrors', icon: 'error_outline' },
        { title: 'Longest Requests', link: '/longestrequests', icon: 'hourglass_empty' },
        { title: 'Rates & Durations', link: '/rates', icon: 'schedule' },
        { title: 'API', link: '/api', icon: 'code' },
        { title: 'API Method', link: '/apimethod', icon: 'radio_button_checked' },
        { title: 'Payload', link: '/payload', icon: 'swap_vert' }
      ],
      refreshOptions: [
        { icon: 'pause', value: 0 },
        { label: '1s', value: 1000 },
        { label: '5s', value: 5000 },
        { label: '15s', value: 15000 },
        { label: '30s', value: 30000 },
        { label: '1m', value: 60000 }
      ]
    };
  },
  computed: {
    refreshTimeout: {
      get() {
        return this.$store.state.refreshTimeout;
      },
      set(value) {
        this.setRefreshTimeout({ timeout: value });
      }
    }
  },
  mounted() {
    this.initRefresh();
  },
  methods: {
    ...mapActions({
      initRefresh: 'initRefresh',
      setRefreshTimeout: 'setRefreshTimeout', // map `this.getStats()` to `... dispatch('getStats')`
      performRefresh: 'performRefresh'
    }),
    toggleMiniState() {
      this.miniState = !this.miniState;
      // need to wait a bit till it fully expands/collapses
      this.$nextTick(() => {
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 200);
      });
    },
    handleLeftLayout(state) {
      console.log(`Left Layout ! ${state}`);
      this.$nextTick(() => {
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 100);
      });
    }
  }
};
</script>
