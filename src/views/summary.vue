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
          type: 'grid',
          size: 12
        },
        widgets: [
          {
            id: 'w1',
            type: 'DbNumber',
            cspan: 2,
            properties: {
              title: 'Requests',
              subtitle: 'Total requests received',
              icon: 'fa fa-signal'
            }
          },
          {
            id: 'w2',
            type: 'DbNumber',
            cspan: 2,
            properties: {
              title: 'Apdex Score',
              subtitle: 'Overall Apdex Score',
              total: 1,
              format: '%.2f'
            }
          },
          {
            id: 'w3',
            type: 'DbNumber',
            cspan: 2,
            properties: {
              title: 'Requests Rate',
              subtitle: 'Requests per second',
              format: '%.2f'
            }
          },
          {
            id: 'w4',
            type: 'DbNumber',
            cspan: 2,
            properties: {
              title: 'Error Rate',
              subtitle: 'Errors per second',
              format: '%.2f'
            }
          },
          {
            id: 'w5',
            type: 'DbNumber',
            cspan: 2,
            properties: {
              title: 'CPU',
              subtitle: 'CPU Usage',
              total: 100,
              format: '%.2f %s',
              qualifier: '%'
            }
          },
          {
            id: 'w6',
            type: 'DbNumber',
            cspan: 2,
            properties: {
              title: 'Memory',
              subtitle: 'Memory Usage',
              format: '%.2f %s'
            }
          },
          {
            id: 'w15',
            type: 'DbDygraphsBar',
            cspan: 12,
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
      this.dbdata.setWData('w2', { value: 0, trend: [] });
      this.dbdata.setWData('w3', { value: 0, trend: [] });
      this.dbdata.setWData('w4', { value: 0, trend: [] });
      this.dbdata.setWData('w5', { value: 0, trend: [] });
      this.dbdata.setWData('w6', { value: 0, qualifier:'', trend: [] });
      this.dbdata.setWData('w15', { data: [] });
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
      this.dbdata.w5.value = pathOr(0, ['sys', 'cpu'], statsContainer);
      // TODO Fix error - value should be number
      //this.dbdata.setWData('w6', { value: , trend: [] });
      let {value,qualifier} = this.formatBytes(pathOr(0, ['sys', 'heapUsed'], statsContainer), 2);
      this.dbdata.w6.value = value;
      this.dbdata.w6.qualifier = qualifier;

      this.dbdata.w1.trend = [];
      this.dbdata.w2.trend = [];
      this.dbdata.w3.trend = [];
      this.dbdata.w4.trend = [];
      this.dbdata.w5.trend = [];
      this.dbdata.w6.trend = [];

      let timelineSorted = statsContainer.getSortedTimeline();
      let dthData = [];
      //let trendReqData =  [];
      for (let entry of timelineSorted) {
        dthData.push([new Date(entry.ts), pathOr(0, ['stats', 'requests'], entry), pathOr(0, ['stats', 'errors'], entry)]);
        // Trend for requests
        this.dbdata.w1.trend.push(pathOr(0, ['stats', 'requests'], entry));
        this.dbdata.w2.trend.push(pathOr(0, ['stats', 'apdex_score'], entry));
        this.dbdata.w3.trend.push(pathOr(0, ['stats', 'req_rate'], entry));
        this.dbdata.w4.trend.push(pathOr(0, ['stats', 'err_rate'], entry));
        this.dbdata.w5.trend.push(pathOr(0, ['sys', 'cpu'], entry));
        this.dbdata.w6.trend.push(pathOr(0, ['sys', 'heapUsed'], entry));
        //trendReqData.push(pathOr(0, ['stats', 'requests'], entry));
      }
      //trendReqData = this.collapse(trendReqData, 1);
      //this.dbdata.w1.trend = trendReqData;
      this.dbdata.setWData('w15', { data: dthData });
      this.dbdata.touch('w1');
      this.dbdata.touch('w2');
      this.dbdata.touch('w3');
      this.dbdata.touch('w4');
      this.dbdata.touch('w5');
      this.dbdata.touch('w6');
      this.loadStats();
    },

    formatBytes: function(a, b) {
      if (0 === a) return {value:0,qualifier:'Bytes'};
      let c = 1e3,
        d = b || 2,
        e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        f = Math.floor(Math.log(a) / Math.log(c));
      return { value:parseFloat((a / Math.pow(c, f)).toFixed(d)),qualifier:e[f]};
    },

    collapse: function(array, chunkSize) {
      let res = [];
      let cidx = 0;
      let aggr = 0;
      for (let v of array) {
        aggr += v;
        cidx++;
        if (cidx === chunkSize) {
          res.push(aggr);
          cidx = 0;
          aggr = 0;
        }
      }
      if (cidx > 0) {
        res.push(aggr);
      }
      return res;
    }
  }
};
</script>
