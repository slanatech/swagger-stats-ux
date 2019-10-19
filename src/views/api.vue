<template>
  <q-page padding>
    <db-dashboard v-if="ready" :dbspec="dbspec" :dbdata="dbdata" :dark="isDark"> </db-dashboard>
    <div style="padding: 4px;">
      <vue-good-table
        :columns="columns"
        :rows="rows"
        styleClass="vgt-table condensed bordered"
        :search-options="{
          enabled: true,
          skipDiacritics: true
        }"
      />
    </div>
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
  name: 'ApiView',
  components: {
    DbDashboard
  },
  data() {
    return {
      timer: null,
      isDark: false,
      columns: [
        {
          label: 'Method',
          field: 'method'
        },
        {
          label: 'Path',
          field: 'path'
        },
        {
          label: 'Requests',
          field: 'requests',
          type: 'number'
        },
        {
          label: 'Errors',
          field: 'errors',
          type: 'number'
        }
      ],
      rows: [],
      dbdata: new DbData(),
      dbspec: {
        layout: {
          type: 'grid',
          size: 12
        },
        // prettier-ignore
        widgets: [
          { id: 'w1', type: 'DbNumber', cspan: 2, properties: {
              title: 'Current Apdex Score', subtitle: 'Apdex Score', total: 1, trendMax: 1, format: '%.2f',
              percentRanges: [
                { value: 50, color: 'red'},
                { value: 60, color: 'orange'},
                { value: 100, color: 'green'},
              ]}
          },
          { id: 'w2', type: 'DbNumber', cspan: 2, properties: { title: 'Current Req Rate', subtitle: 'Requests per second', format: '%.2f', icon: 'fa fa-exchange-alt' } },
          { id: 'w3', type: 'DbNumber', cspan: 2, properties: { title: 'Current Err Rate', subtitle: 'Errors per second', format: '%.2f' } },
          { id: 'w4', type: 'DbNumber', cspan: 2, properties: { title: 'Current Max HT', subtitle: 'Max Handle Time', format: '%.2f', icon: 'fa fa-exclamation' } },
          { id: 'w5', type: 'DbNumber', cspan: 2, properties: { title: 'Current Avg HT', subtitle: 'Avg Handle Time', format: '%.2f', icon: 'fa fa-exclamation' } },
          { id: 'w6', type: 'DbNumber', cspan: 2, properties: { title: 'OPA', subtitle: 'Average Handle Time', format: '%d ms',icon: 'fa fa-hourglass-half' } },
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
    this.getStats({ fields: ['apistats'] });
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
      this.dbdata.setWData('w5', { value: 0 });
      this.dbdata.setWData('w6', { value: 0 });
    },

    // TODO Reconsider
    loadStats: function() {
      this.timer = setTimeout(() => {
        this.getStats({ fields: ['apistats'] });
      }, 1000);
    },

    updateStats: function() {
      // Update numbers
      //let requestsTotal = pathOr(0, ['all', 'requests'], statsContainer);
      this.rows = statsContainer.getApiStatsArray();

      this.loadStats();
    }
  }
};
</script>
