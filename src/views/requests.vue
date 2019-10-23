<template>
  <q-page padding>
    <div style="padding: 4px;">
      <vue-good-table :columns="columns" :rows="rows" styleClass="vgt-table condensed bordered striped sws-table"> </vue-good-table>
    </div>
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
  name: 'ApiView',
  components: {
    DbDashboard
  },
  data() {
    return {
      timer: null,
      isDark: false,
      columns: [
        { label: 'Method', field: 'method', tdClass: 'text-weight-bold' },
        { label: 'Requests', field: 'requests', type: 'number', tdClass: 'text-weight-bold' },
        { label: 'Responses', field: 'responses', type: 'number' },
        { label: 'Apdex Score', field: 'apdex_score', type: 'number', formatFn: this.formatToFixed2, tdClass: this.tdClassApdex },
        { label: 'Errors', field: 'errors', type: 'number', tdClass: this.tdClassErrors },
        { label: 'Req rate', field: 'req_rate', type: 'number', formatFn: this.formatToFixed2 },
        { label: 'Err rate', field: 'err_rate', type: 'number', formatFn: this.formatToFixed2, tdClass: this.tdClassErrRate },
        { label: 'Success', field: 'success', type: 'number' },
        { label: 'Redirect', field: 'redirect', type: 'number' },
        { label: 'Client Error', field: 'client_error', type: 'number', tdClass: this.tdClassCErr },
        { label: 'Server Error', field: 'server_error', type: 'number', tdClass: this.tdClassSErr },
        { label: 'Max Time (ms)', field: 'max_time', type: 'number' },
        { label: 'Avg Time (ms)', field: 'avg_time', type: 'number', formatFn: this.formatToFixed2 },
        { label: 'Avg Req Size', field: 'avg_req_clength', type: 'number', formatFn: this.formatToFixed0 },
        { label: 'Avg Res Size', field: 'avg_res_clength', type: 'number', formatFn: this.formatToFixed0 },
        { label: 'Tags', field: 'tags', type: 'string' }
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
          {
            id: 'w23',
            type: 'DbChartjsPie',
            cspan: 4,
            height: 250
          },
          {
            id: 'w24',
            type: 'DbChartjsBar',
            cspan: 4,
            height: 250
          },
          {
            id: 'w25',
            type: 'DbChartjsBar',
            cspan: 4
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
    this.getStats({ fields: ['method'] });
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

      this.dbdata.setWData('w23', {
        data: {
          labels: [],
          datasets: [{ label: 'Requests by method', data: [] }]
        }
      });
    },
    // TODO Reconsider
    loadStats: function() {
      this.timer = setTimeout(() => {
        this.getStats({ fields: ['method'] });
      }, 1000);
    },
    // TODO ->> to mixin
    formatToFixed2: function(value) {
      return value.toFixed(2);
    },
    formatToFixed0: function(value) {
      return value.toFixed(0);
    },
    tdClassErrors(row) {
      return row.errors > 0 ? 'sws-td-badge sws-td-badge-neg' : '';
    },
    tdClassErrRate(row) {
      return row.err_rate > 0 ? 'sws-td-badge sws-td-badge-neg' : '';
    },
    tdClassCErr(row) {
      return row.client_error > 0 ? 'sws-td-badge sws-td-badge-neg' : '';
    },
    tdClassSErr(row) {
      return row.server_error > 0 ? 'sws-td-badge sws-td-badge-neg' : '';
    },
    tdClassApdex(row) {
      return 'text-weight-bold ' + (row.apdex_score < 0.6 ? 'sws-td-badge sws-td-badge-warn' : '');
    },
    updateStats: function() {
      // Update table
      this.rows = statsContainer.getMethodStatsArray();

      let labelsRBM = Object.keys(pathOr({}, ['method'], statsContainer));
      this.dbdata['w23'].data.labels = labelsRBM;
      this.dbdata['w23'].data.datasets[0].data = labelsRBM.map(x => statsContainer.method[x].requests);
      this.dbdata.touch('w23');
    }
  }
};
</script>
