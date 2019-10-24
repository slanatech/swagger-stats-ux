<template>
  <q-page padding>
    <db-dashboard v-if="ready" :dbspec="dbspec" :dbdata="dbdata" :dark="isDark"> </db-dashboard>
    <div style="padding: 4px;">
      <vue-good-table
        :columns="columns"
        :rows="rows"
        styleClass="vgt-table condensed bordered striped sws-table"
        :search-options="{
          enabled: true,
          skipDiacritics: true
        }"
        :pagination-options="{
          enabled: true,
          mode: 'records',
          perPage: 30,
          perPageDropdown: [10, 20, 30, 50, 80, 100],
          dropdownAllowAll: true
        }"
      >
        <template slot="table-row" slot-scope="props">
          <span v-if="props.column.field == 'path'">
            <!--<span style="font-weight: bold; color: blue;">{{ props.row.path }}</span>-->
            <router-link :to="{ path: 'apiop', query: { method: props.row.method, path: props.row.path } }">{{ props.row.path }}</router-link>
          </span>
          <span v-else>
            {{ props.formattedRow[props.column.field] }}
          </span>
        </template>
      </vue-good-table>
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
import { vgtMethods } from '../mixins/vgtmethods';

export default {
  name: 'ApiView',
  components: {
    DbDashboard
  },
  mixins: [vgtMethods],
  data() {
    return {
      timer: null,
      isDark: false,
      columns: [
        { label: 'Method', field: 'method', tdClass: 'text-weight-bold' },
        { label: 'Path', field: 'path', tdClass: 'text-weight-bold' },
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
    this.getStats({ fields: ['apidefs', 'apistats'] });
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

      //this.loadStats();
    }
  }
};
</script>
