<template>
  <q-page padding>
    <q-splitter v-model="splitterModel" :limits="[50, 100]">
      <template v-slot:before>
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
              <span v-if="props.column.field == 'api.path'">
                <!--<span style="font-weight: bold; color: blue;">{{ props.row.path }}</span>-->
                <router-link :to="{ path: 'apiop', query: { method: props.row.method, path: props.row.api.path } }">{{ props.row.api.path }}</router-link>
              </span>
              <span v-else>
                {{ props.formattedRow[props.column.field] }}
              </span>
            </template>
          </vue-good-table>
        </div>
      </template>

      <template v-slot:after>
        <div class="q-pa-md">
          <pre><code ref="code" class="language-json"></code></pre>
        </div>
      </template>
    </q-splitter>
  </q-page>
</template>

<script>
import { pathOr } from 'ramda';
import statsContainer from '@/store/statscontainer';
import { mapState, mapActions } from 'vuex';
import { vgtMethods } from '../mixins/vgtmethods';
import Prism from 'prismjs';
//import 'prismjs/themes/prism.css';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-json';

export default {
  name: 'ApiView',
  components: {},
  mixins: [vgtMethods],
  data() {
    return {
      splitterModel: 60, // start at 50%
      timer: null,
      isDark: false,
      columns: [
        { label: 'Time', field: '@timestamp', tdClass: 'text-body2', type: 'date', dateInputFormat: "yyyy-MM-dd'T'HH:mm:ss.SSSX", dateOutputFormat: 'LLL do yyyy, HH:mm:ss.SSS' },
        { label: 'Method', field: 'method', tdClass: 'text-weight-bold' },
        { label: 'Path', field: 'api.path', tdClass: 'text-weight-bold' },
        { label: 'URL', field: 'http.request.url' },
        { label: 'Response Time', field: 'responsetime', type: 'number', tdClass: 'text-weight-bold' },
        { label: 'Response Code', field: 'http.response.code', type: 'number', tdClass: 'text-weight-bold' }
      ],
      rows: [],
      requestResponseRecord: '',
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
    Prism.manual = true;
    this.initialize();
    this.getStats({ fields: ['lasterrors'] });
    this.ready = true;
  },
  methods: {
    ...mapActions({
      getStats: 'stats/getStats' // map `this.getStats()` to `... dispatch('getStats')`
    }),
    initialize: function() {},
    preRender: function(code) {
      return code.replace(/\s+data-v-\S+="[^"]*"/g, '');
    },
    // TODO Reconsider
    loadStats: function() {
      this.timer = setTimeout(() => {
        this.getStats({ fields: ['lasterrors'] });
      }, 1000);
    },
    updateStats: function() {
      // Update numbers
      //let requestsTotal = pathOr(0, ['all', 'requests'], statsContainer);
      this.rows = pathOr([], ['lasterrors'], statsContainer);

      this.requestResponseRecord = JSON.stringify(this.rows[0], null, '\t');

      //this.loadStats();
      this.$refs.code.textContent = this.preRender(this.requestResponseRecord, this);
      Prism.highlightElement(this.$refs.code);
      //Prism.highlightAll();
    }
  }
};
</script>
