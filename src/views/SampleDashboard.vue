<template>
  <q-page padding>
    <db-dashboard v-if="ready" :dbspec="dbspec" :dbdata="dbdata" :dark="isDark"> </db-dashboard>
  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { DbData, DbDashboard } from 'dashblocks';
import { pathOr } from 'ramda';

export default {
  name: 'SampleDashboard',
  components: {
    DbDashboard
  },
  data() {
    return {
      isDark: false,
      dbdata: new DbData(),
      // Declare Dashboard Layout. Add widgets to your dashboard, specifying how many columns and rows
      // each widget takes. Dashblocks provides 16-columns CSS Grid layout.
      // Pass additional options to widgets to adjust appearance as needed.
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
      stats: state => state.stats
    })
  },
  watch: {
    stats: {
      handler: function() {
        console.log(`stats updated`);
        // Trigger refresh
        this.refresh();
      },
      deep: true
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
      // Initialize dashboard data - set data for each dashboard widget
      // This is obviously a sample that generates random data
      // In real dashboards you would get data from database, backend APIs, vuex, etc
      let dthData = [];
      let sTS = Date.now() - 100 * 3600 * 1000;
      for (let i = 0; i < 100; i++) {
        dthData.push([new Date(sTS + i * 3600 * 1000), Math.random(), Math.random()]);
      }

      this.dbdata.setWData('w5', {data: dthData});
    },
    refresh: function(){
      this.dbdata.setWData('w1', {value: pathOr(0,['all','requests'],this.stats)});
      console.log(`Set value: ${pathOr(0,['all','requests'],this.stats)}`);
    }
  }
};
</script>
