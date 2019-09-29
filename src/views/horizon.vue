<template>
  <q-page padding>
    <db-dashboard v-if="ready" :dbspec="dbspec" :dbdata="dbdata" :dark="isDark"> </db-dashboard>
  </q-page>
</template>

<script>
//import { DbData, DbDashboard } from '../../../dashblocks/src/components';
//import { DbData, DbDashboard } from 'dashblocks';
import DbDashboard from 'dashblocks/src/components/dashboard/DbDashboard.vue';
import DbData from 'dashblocks/src/components/dbdata';
import { mapState, mapActions } from 'vuex';
import { pathOr } from 'ramda';
import statsContainer from '@/store/statscontainer';

export default {
  name: 'HorizonView',
  components: {
    DbDashboard
  },
  data() {
    return {
      timer: null,
      isDark: false,
      dbdata: new DbData(),
      dbspec: {
        layout: {
          type: 'grid'
        },
        widgets: [
          {
            id: 'w6',
            type: 'DbDygraphsBar',
            cspan: 16,
            height: 250,
            properties: {
              options: {
                stackedGraph: true,
                title: 'Traffic over time',
                ylabel: 'Requests, Mil.',
                labels: ['Date', 'Success', 'Error'],
                legend: 'always'
              }
            }
          }
          /*
          {
            id: 'w1',
            type: 'DbHorizon',
            cspan: 16,
            properties:{
              scheme: 'schemeYlOrBr'
            }
          }
          */
        ]
      },
      ready: false,
      seriesDefs: [
        { key: 'requests', title: 'Requests' },
        { key: 'responses', title: 'Responses' },
        { key: 'success', title: 'Success' },
        { key: 'errors', title: 'Errors' },
        { key: 'redirect', title: 'Redirect' },
        { key: 'client_error', title: 'Client Error' },
        { key: 'server_error', title: 'Server Error' }
        //{ key: 'max_time', title: 'Max processing time' },
        //{ key: 'avg_time', title: 'Average processing time' }
      ]
    };
  },
  computed: {
    ...mapState({
      statsUpdated: state => state.stats.updated
    })
  },
  watch: {
    statsUpdated: {
      handler: function() {
        console.log(`stats updated`);
        this.updateStats();
      }
    }
  },
  mounted() {
    this.initialize();
    this.getStats({ fields: ['timeline', 'apidefs'] });
    this.ready = true;
  },
  methods: {
    ...mapActions({
      getStats: 'stats/getStats' // map `this.getStats()` to `... dispatch('getStats')`
    }),
    initialize: function() {
      // Init dashboard data
      //this.dbdata.setWData('w1', { data: [{key:'empty',values:[new Date(),0]}] });
      //this.dbdata.setWData('w6', { data: [] });
      this.dbdata.w6 = { _updated: 0, data: [] };
    },

    // TODO Reconsider
    loadStats: function() {
      this.timer = setTimeout(() => {
        this.getStats({ fields: ['timeline', 'apidefs'] });
      }, 10000);
    },

    updateStats: function() {
      /*
      let timelineSorted = statsContainer.getSortedTimeline();
      let chartData = [];
      for (let series of this.seriesDefs) {
        let seriesValues = [];
        for (let entry of timelineSorted) {
          let d = new Date(entry.ts);
          seriesValues.push({ date: d, value: pathOr(0, ['stats', series.key], entry) });
        }
        chartData.push({ key: series.title, values: seriesValues });
      }
      this.dbdata.setWData('w1', { data: chartData });
      */

      let timelineSorted = statsContainer.getSortedTimeline();
      let dthData = [];
      for (let entry of timelineSorted) {
        dthData.push([new Date(entry.ts), pathOr(0, ['stats', 'requests'], entry), pathOr(0, ['stats', 'errors'], entry)]);
      }
      this.dbdata.setWData('w6', { data: dthData });
      //this.dbdata.w6.data = dthData;
      //this.dbdata.w6['_updated'] = Date.now();


      this.loadStats();

      /* Update numbers
      this.dbdata.w1.value = pathOr(0, ['all', 'requests'], statsContainer).toFixed(4);
      this.dbdata.w2.value = pathOr(0, ['all', 'apdex_score'], statsContainer).toFixed(4);
      this.dbdata.w3.value = pathOr(0, ['all', 'req_rate'], statsContainer).toFixed(4);
      this.dbdata.w4.value = pathOr(0, ['all', 'err_rate'], statsContainer).toFixed(4);

      let timelineSorted = statsContainer.getSortedTimeline();
      let dthData = [];
      for (let entry of timelineSorted) {
        dthData.push([new Date(entry.ts), pathOr(0, ['stats', 'requests'], entry), pathOr(0, ['stats', 'errors'], entry)]);
      }
      this.dbdata.setWData('w5', { data: dthData });

       */
    }
  }
};
</script>
