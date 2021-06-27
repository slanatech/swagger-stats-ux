<template>
  <q-page class="sws-page-padding">
    <title-bar title="API Responses" icon="pie_chart"></title-bar>
    <db-dashboard v-if="ready" :dbspec="dbspec" :dbdata="dbdata" :dark="dark"> </db-dashboard>
  </q-page>
</template>

<script>
import { DbData } from 'dashblocks';
import TitleBar from '@/components/titlebar.vue';
import statsContainer from '@/store/statscontainer';
import { swsdashboard } from '../mixins/swsdashboard';
import { mapState, mapActions } from 'vuex';
import Prism from 'prismjs';

export default {
  name: 'ApiResponses',
  mixins: [swsdashboard],
  components: {
    TitleBar,
  },
  data() {
    return {
      isDark: false,
      dbdata: new DbData(),
      dbspec: {
        layout: {
          type: 'grid',
          size: 12,
        },
        colorScheme: 'default',
        widgets: [],
      },
      ready: false,
      observer: null,
      apiOpsData: [],
      visibility: [],
    };
  },
  computed: {
    ...mapState({
      refreshTrigger: (state) => state.refreshTrigger,
      statsUpdated: (state) => state.stats.updated,
    }),
  },
  watch: {
    refreshTrigger: {
      handler: function () {
        // TODO Enable
        this.getStats({ fields: ['apistats'], method: this.apiOpMethod, path: this.apiOpPath });
      },
    },
    statsUpdated: {
      handler: function () {
        this.updateStats();
      },
    },
  },
  mounted() {
    this.observer = new IntersectionObserver(
      (entries) => {
        // isIntersecting is true when element and viewport are overlapping
        // isIntersecting is false when element and viewport don't overlap
        let needUpdate = false;
        //console.log(`VISIBILITY CHANGE: ${entries.length}`);
        entries.map((e) => {
          let classes = e.target.className.split(' ');
          let id = classes.find((x) => x.startsWith('dbw')).replace('dbw', '');
          //console.log(`${id} is ${e.isIntersecting ? 'VISIBLE' : 'NOT VISIBLE'}`);
          if (this.visibility[id] !== e.isIntersecting) {
            this.visibility[id] = e.isIntersecting;
            needUpdate = true;
          }
        });
        //console.log(`VISIBILITY: ${JSON.stringify(this.visibility)}`);

        if (needUpdate) {
          this.$nextTick(() => {
            this.updateVisible();
          });
        }
      },
      { threshold: [0] }
    );
    this.dbspec.colorScheme = this.dashboardColorScheme;
    this.getStats({ fields: ['apistats'], method: this.apiOpMethod, path: this.apiOpPath });
    this.ready = true;
  },
  methods: {
    ...mapActions({
      getStats: 'stats/getStats', // map `this.getStats()` to `... dispatch('getStats')`
    }),
    updateVisible: function () {
      let dbWidgets = this.generateWidgets();
      this.dbspec.widgets = dbWidgets;
    },
    generateWidgets: function () {
      let dbWidgets = [];
      //let idx = 0;
      //for (let apiOp of this.apiOpsData) {
      this.apiOpsData.map((apiOp, idx) => {
        let wid = `dbw${idx}`;
        if (this.visibility[idx]) {
          let wdef = {
            id: wid,
            type: 'DbChartjsDoughnut',
            cspan: 3,
            height: 220,
            class: wid,
            properties: {
              options: {
                title: { display: true, text: `${apiOp.method} ${apiOp.path}`, position: 'top' },
                legend: { position: 'right' },
              },
            },
          };
          dbWidgets.push(wdef);
          let wData = { labels: ['2XX', '3XX', '4XX', '5XX'], datasets: [{ data: [] }] };
          wData.datasets[0].data.push(apiOp.success);
          wData.datasets[0].data.push(apiOp.redirect);
          wData.datasets[0].data.push(apiOp.client_error);
          wData.datasets[0].data.push(apiOp.server_error);
          this.dbdata.setWData(wid, { data: wData });
        } else {
          let wdef = {
            id: wid,
            type: 'DbWidgetLoading',
            cspan: 3,
            class: wid,
            height: 220,
          };
          dbWidgets.push(wdef);
        }
      });
      return dbWidgets;
    },
    updateStats: function () {
      // First, stop observing old elements, if any
      this.visibility.map((e, i) => {
        this.observer.unobserve(document.querySelector(`.dbw${i}`));
      });

      // Generate dashboard dynamically and set data
      let apiOps = statsContainer.getApiStatsArray();
      this.apiOpsData = Object.freeze(apiOps); // Store cache, to update when visibility changes

      // If number of widgets changed, re-init visibility with all widgets set to non-visible
      // If it is not changed, we can assume this is refresh of data in already initialized widgets, so we preserve current visibility
      if (this.visibility.length !== apiOps.length) {
        this.visibility = Array(apiOps.length).fill(false);
      }

      let dbWidgets = this.generateWidgets();
      this.dbspec.widgets = dbWidgets;

      this.$nextTick(() => {
        for (let i = 0; i < apiOps.length; i++) {
          this.observer.observe(document.querySelector(`.dbw${i}`));
        }
      });
    },
  },
};
</script>
