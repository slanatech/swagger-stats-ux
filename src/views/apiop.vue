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
import utils from '@/utils.js';

export default {
  name: 'SummaryView',
  components: {
    DbDashboard
  },
  data() {
    return {
      timer: null,
      isDark: false,
      apiOpMethod: null,
      apiOpPath: null,
      dbdata: new DbData(),
      dbspec: {
        layout: {
          type: 'grid',
          size: 12
        },
        // prettier-ignore
        widgets: [
          { id: 'w1', type: 'DbNumber', cspan: 2, properties: { title: 'Requests', subtitle: 'Total requests received', icon: 'fa fa-signal' } },
          { id: 'w2', type: 'DbNumber', cspan: 2, properties: {
            title: 'Apdex Score', subtitle: 'Overall Apdex Score', total: 1, trendMax: 1, format: '%.2f',
            percentRanges: [
              { value: 50, color: 'red'},
              { value: 60, color: 'orange'},
              { value: 100, color: 'green'},
            ]}
          },
          { id: 'w3', type: 'DbNumber', cspan: 2, properties: { title: 'Req Rate', subtitle: 'Requests per second', format: '%.2f', icon: 'fa fa-exchange-alt' } },
          { id: 'w4', type: 'DbNumber', cspan: 2, properties: { title: 'Err Rate', subtitle: 'Errors per second', format: '%.2f', icon: 'fa fa-exclamation' } },
          { id: 'w5', type: 'DbNumber', cspan: 2, properties: { title: 'Avg HT', subtitle: 'Average Handle Time', format: '%.0f %s', qualifier: 'ms' } },
          { id: 'w6', type: 'DbNumber', cspan: 2, properties: { title: 'Avg Req Payload', subtitle: 'Avg Req Content Len', format: '%.2f %s', icon: 'fa fa-sd-card' } },

          { id: 'w7', type: 'DbNumber', cspan: 2, properties: { title: 'Errors', subtitle: 'Total Error Responses' } },
          { id: 'w8', type: 'DbNumber', cspan: 2, properties: {
            title: '2XX', subtitle: 'Success Responses',
            percentRanges: [
              { value: 50, color: 'red'},
              { value: 70, color: 'orange'},
              { value: 100, color: 'green'}
            ]}
          },
          { id: 'w9', type: 'DbNumber', cspan: 2, properties: { title: '3XX', subtitle: 'Redirect Responses' } },
          { id: 'w10', type: 'DbNumber', cspan: 2, properties: { title: '4XX', subtitle: 'Client Error Responses' } },
          { id: 'w11', type: 'DbNumber', cspan: 2, properties: { title: '5XX', subtitle: 'Server Error Responses' } },
          { id: 'w12', type: 'DbNumber', cspan: 2, properties: { title: 'Avg Res Payload', subtitle: 'Avg Res Content Len', format: '%.2f %s', icon: 'fa fa-sd-card' } }
          // TODO
        ]
      },
      ready: false
    };
  },
  computed: {
    ...mapState({
      refreshTrigger: state => state.refreshTrigger,
      statsUpdated: state => state.stats.updated
    })
  },
  watch: {
    refreshTrigger: {
      handler: function() {
        // TODO Enable
        //this.getStats({ fields: ['apiop'], method: this.apiOpMethod, path: this.apiOpPath });
      }
    },
    statsUpdated: {
      handler: function() {
        console.log(`stats updated`);
        this.updateStats();
      }
    }
  },
  mounted() {
    this.apiOpMethod = this.$route.query.method || null;
    this.apiOpPath = this.$route.query.path || null;
    this.initialize();
    this.getStats({ fields: ['apiop'], method: this.apiOpMethod, path: this.apiOpPath });
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
      this.dbdata.setWData('w6', { value: 0, qualifier: '' });
      this.dbdata.setWData('w7', { value: 0 });
      this.dbdata.setWData('w8', { value: 0 });
      this.dbdata.setWData('w9', { value: 0 });
      this.dbdata.setWData('w10', { value: 0 });
      this.dbdata.setWData('w11', { value: 0 });
      this.dbdata.setWData('w12', { value: 0 });
    },

    updateStats: function() {
      // Update numbers
      let apiOpData = pathOr(null, ['apiop', this.apiOpPath, this.apiOpMethod], statsContainer);
      if (!apiOpData) {
        return;
      }
      let apiOpDefs = apiOpData.defs || null;
      let apiOpStats = apiOpData.stats || null;
      let apiOpDetails = apiOpData.details || null;

      let requestsTotal = pathOr(0, ['requests'], apiOpStats);
      this.dbdata.setWData('w1', { value: requestsTotal });
      this.dbdata.setWData('w2', { value: pathOr(0, ['apdex_score'], apiOpStats) });
      this.dbdata.setWData('w3', { value: pathOr(0, ['req_rate'], apiOpStats) });
      this.dbdata.setWData('w4', { value: pathOr(0, ['err_rate'], apiOpStats) });
      this.dbdata.setWData('w5', { value: pathOr(0, ['avg_time'], apiOpStats) });
      let { value, qualifier } = utils.formatBytes(pathOr(0, ['avg_req_clength'], apiOpStats), 2);
      this.dbdata.setWData('w6', { value: value, qualifier: qualifier });

      this.dbdata.setWData('w7', { value: pathOr(0, ['errors'], apiOpStats), total: requestsTotal });
      this.dbdata.setWData('w8', { value: pathOr(0, ['success'], apiOpStats), total: requestsTotal });
      this.dbdata.setWData('w9', { value: pathOr(0, ['redirect'], apiOpStats), total: requestsTotal });
      this.dbdata.setWData('w10', { value: pathOr(0, ['client_error'], apiOpStats), total: requestsTotal });
      this.dbdata.setWData('w11', { value: pathOr(0, ['server_error'], apiOpStats), total: requestsTotal });
      ({ value, qualifier } = utils.formatBytes(pathOr(0, ['avg_res_clength'], apiOpStats), 2));
      this.dbdata.setWData('w12', { value: value, qualifier: qualifier });
    }
  }
};
</script>
