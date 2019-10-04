<template>
  <q-page padding>
    <db-dashboard v-if="ready" :dbspec="dbspec" :dbdata="dbdata" :dark="isDark"> </db-dashboard>
  </q-page>
</template>

<script>
// Development
import { DbData, DbDashboard } from 'dashblocks_dev/src/components';
// Prod
// import { DbData, DbDashboard } from 'dashblocks';
import { pathOr } from 'ramda';
import statsContainer from '@/store/statscontainer';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'SummaryView',
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
            id: 'w1',
            type: 'DbNumber',
            cspan: 4,
            height: 150,
            properties: {
              title: 'Requests',
              subtitle: 'Total requests received'
            }
          },
          {
            id: 'w2',
            type: 'DbNumber',
            cspan: 4,
            properties: {
              title: 'Apdex Score',
              subtitle: 'Overall Apdex Score'
            }
          },
          {
            id: 'w3',
            type: 'DbNumber',
            cspan: 4,
            properties: {
              title: 'Requests Rate',
              subtitle: 'Requests per second'
            }
          },
          {
            id: 'w4',
            type: 'DbNumber',
            cspan: 4,
            properties: {
              title: 'Error Rate',
              subtitle: 'Errors per second'
            }
          },
          {
            id: 'w5',
            type: 'DbDygraphsBar',
            cspan: 16,
            height: 250,
            properties: {
              options: {
                stackedGraph: true,
                title: 'Traffic over time',
                ylabel: 'Requests',
                labels: ['Date', 'Success', 'Error'],
                legend: 'always'
              }
            }
          }
        ]
      },
      ready: false
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
      this.dbdata.setWData('w1', { value: 0, trend: [] });
      this.dbdata.setWData('w2', { value: 0 });
      this.dbdata.setWData('w3', { value: 0 });
      this.dbdata.setWData('w4', { value: 0 });
      this.dbdata.setWData('w5', { data: [] });
    },

    // TODO Reconsider
    loadStats: function() {
      this.timer = setTimeout(() => {
        this.getStats({ fields: ['timeline', 'apidefs'] });
      }, 1000);
    },


    updateStats: function() {

      // Update numbers
      this.dbdata.w1.value = pathOr(0, ['all', 'requests'], statsContainer);
      this.dbdata.w2.value = pathOr(0, ['all', 'apdex_score'], statsContainer);
      this.dbdata.w3.value = pathOr(0, ['all', 'req_rate'], statsContainer);
      this.dbdata.w4.value = pathOr(0, ['all', 'err_rate'], statsContainer);

      this.dbdata.w1.trend = [];

      let timelineSorted = statsContainer.getSortedTimeline();
      let dthData = [];
      for (let entry of timelineSorted) {
        dthData.push([new Date(entry.ts), pathOr(0, ['stats', 'requests'], entry), pathOr(0, ['stats', 'errors'], entry)]);
        // Trend for requests
        this.dbdata.w1.trend.push(pathOr(0, ['stats', 'requests'], entry));
      }
      this.dbdata.setWData('w5', { data: dthData });
      this.dbdata.touch('w1');
      this.loadStats();
    }
  }
};
</script>
