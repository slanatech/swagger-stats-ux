<template>
  <q-page padding>
    <db-dashboard v-if="ready" :dbspec="dbspec" :dbdata="dbdata" :dark="isDark"> </db-dashboard>
  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { DbData, DbDashboard } from 'dashblocks';
import { pathOr } from 'ramda';
import statsContainer from '@/store/statscontainer';

export default {
  name: 'SampleDashboard',
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
            height: 150
          },
          {
            id: 'w2',
            type: 'DbNumber',
            cspan: 4
          },
          {
            id: 'w3',
            type: 'DbNumber',
            cspan: 4
          },
          {
            id: 'w4',
            type: 'DbNumber',
            cspan: 4
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
                ylabel: 'Requests, Mil.',
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
      this.dbdata.setWData('w1', { value: 0 });
      this.dbdata.setWData('w2', { value: 0 });
      this.dbdata.setWData('w3', { value: 0 });
      this.dbdata.setWData('w4', { value: 0 });
      this.dbdata.setWData('w5', { data: [] });
    },

    loadStats: function() {
      this.timer = setTimeout(() => {
        this.getStats({ fields: ['timeline', 'apidefs'] });
      }, 10000);
    },

    updateStats: function() {
      // Update numbers
      this.dbdata.setWData('w1', { value: pathOr(0, ['all', 'requests'], statsContainer) });
      this.dbdata.setWData('w2', { value: pathOr(0, ['all', 'apdex_score'], statsContainer) });
      this.dbdata.setWData('w3', { value: pathOr(0, ['all', 'req_rate'], statsContainer) });
      this.dbdata.setWData('w4', { value: pathOr(0, ['all', 'err_rate'], statsContainer) });

      // Update timeline. need to sort as timestampts are object keys
      // TODO add API to return timeline in array already sorted
      let timelineSorted = [];
      let timelineSettings = pathOr(null, ['timeline', 'settings'], statsContainer);
      let timelineData = pathOr(null, ['timeline', 'data'], statsContainer);
      if (timelineData && timelineSettings) {
        for (let key of Object.keys(timelineData)) {
          let entry = timelineData[key];
          entry.tc = parseInt(key);
          entry.ts = entry.tc * (timelineSettings.bucket_duration || 60000);
          timelineSorted.push(entry);
        }
      }
      // Sort it by timecode ascending
      timelineSorted.sort(function(a, b) {
        return a.tc - b.tc;
      });

      let dthData = [];
      for (let entry of timelineSorted) {
        dthData.push([new Date(entry.ts), pathOr(0, ['stats', 'requests'], entry), pathOr(0, ['stats', 'errors'], entry)]);
      }
      this.dbdata.setWData('w5', { data: dthData });

      this.loadStats();
    }
  }
};
</script>