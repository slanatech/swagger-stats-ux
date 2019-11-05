<template>
  <q-page padding>
    <q-splitter v-model="splitterModel" :limits="[50, 100]" after-class="q-splitter-panel-height-auto">
      <template v-slot:before>
        <div style="padding: 4px;">
          <vue-good-table
            :columns="columns"
            :rows="rows"
            styleClass="vgt-table condensed bordered striped sws-table"
            :row-style-class="getRowClass"
            :search-options="{ enabled: true, skipDiacritics: true }"
            :pagination-options="{ enabled: true, mode: 'records', perPage: 30, perPageDropdown: [10, 20, 30, 50, 80, 100], dropdownAllowAll: true }"
            :sort-options="{
              enabled: true,
              initialSortBy: { field: sortField, type: 'desc' }
            }"
          >
            <template slot="table-row" slot-scope="props">
              <span v-if="props.column.field == 'expand'">
                <!--<q-icon name="visibility" />-->
                <q-btn flat round color="secondary" icon="play_arrow" size="xs" @click="handleShow(props.row.originalIndex)" />
              </span>
              <span v-else-if="props.column.field == 'api.path'">
                <!--<span style="font-weight: bold; color: blue;">{{ props.row.path }}</span>-->
                <router-link :to="{ path: 'apiop', query: { method: props.row.method, path: props.row.api.path } }">{{ props.row.api.path }}</router-link>
              </span>
              <span v-else-if="props.column.field == 'path'">
                <div style="font-weight: bold; color: blue;position: relative;">{{ props.row.path }}<div class="sws-css-bar" :style="`width: ${props.row.responsetime/122*100}%;`"></div></div>
              </span>
              <span v-else>
                {{ props.formattedRow[props.column.field] }}
              </span>
            </template>
          </vue-good-table>
        </div>
      </template>

      <template v-slot:after>
        <div class="q-pa-xs full-height" style="min-height: 90vh;">
          <q-scroll-area ref="scrollArea" class="full-height" style="min-height: 90vh;">
            <q-list bordered class="rounded-borders" style="min-height: 90vh;">
              <div v-for="(item, index) in storedItems" v-bind:key="item.key" :id="item.key">
                <q-expansion-item v-model="expanded[index]" header-class="sws-bg-gradient-a3a1a3">
                  <template v-slot:header>
                    <q-item-section avatar>
                      <q-avatar icon="sync_alt" color="accent" text-color="white" />
                    </q-item-section>

                    <q-item-section>
                      <div>{{ getTitle(item.data) }}</div>
                      <div class="text-caption">{{ item.data['@timestamp'] }}</div>
                    </q-item-section>

                    <q-item-section side>
                      <q-btn flat round icon="clear" size="sm" v-on:click.stop="handleClear(index)" />
                    </q-item-section>
                  </template>
                  <q-card>
                    <q-card-section>
                      <pre><code class="language-json">{{JSON.stringify(item.data,null,'\t')}}</code></pre>
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
                <q-separator />
              </div>
            </q-list>
          </q-scroll-area>
        </div>
      </template>
    </q-splitter>
  </q-page>
</template>

<script>
import { pathOr, propEq, findIndex } from 'ramda';
import statsContainer from '@/store/statscontainer';
import { mapState, mapActions } from 'vuex';
import { vgtMethods } from '../mixins/vgtmethods';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
//import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-json';

export default {
  name: 'LastErrorsView',
  components: {},
  mixins: [vgtMethods],
  data() {
    return {
      splitterModel: 100, // start at 50%
      statsField: 'lasterrors',
      sortField: '@timestamp',
      expanded: [],
      timer: null,
      isDark: false,
      columns: [
        { label: '', field: 'expand', width: '1%', tdClass: 'text-center pointer' },
        {
          label: 'Time',
          field: '@timestamp',
          width: '10%',
          thClass: 'text-left',
          tdClass: 'nowrap text-left text-body2',
          type: 'date',
          dateInputFormat: "yyyy-MM-dd'T'HH:mm:ss.SSSX",
          dateOutputFormat: 'LLL do yyyy, HH:mm:ss.SSS'
        },
        { label: 'Method', field: 'method', width: '10%', tdClass: 'text-weight-bold' },
        { label: 'Path', field: 'api.path', width: '30%', tdClass: 'text-weight-bold' },
        { label: 'URL', field: 'path', width: '39%' },
        { label: 'Response Time', field: 'responsetime', width: '5%', type: 'number', tdClass: 'text-weight-bold' },
        { label: 'Response Code', field: 'http.response.code', width: '5%', type: 'number', tdClass: 'text-weight-bold' }
      ],
      rows: [],
      requestResponseRecord: ''
    };
  },
  computed: {
    ...mapState({
      statsUpdated: state => state.stats.updated,
      storedItems: state => state.lasterrors.items,
      expandedState: state => state.lasterrors.expanded
    })
  },
  watch: {
    statsUpdated: {
      handler: function() {
        console.log(`stats updated`);
        this.updateStats();
      }
    },
    storedItems: {
      handler: function() {
        if (this.storedItems.length > 0) {
          if (this.splitterModel === 100) {
            this.splitterModel = 60;
          }
        } else {
          this.splitterModel = 100;
        }
        this.$nextTick(() => {
          Prism.highlightAll();
        });
      }
    }
  },
  mounted() {
    Prism.manual = true;
    this.initialize();
    this.splitterModel = this.storedItems.length > 0 ? 60 : 100;
    // Retrieve expanded state
    this.expanded = [...this.expandedState];
  },
  updated: function() {
    this.$nextTick(() => {
      Prism.highlightAll();
    });
  },
  beforeDestroy: function() {
    // Store expanded state
    this.setExpanded({ expanded: this.expanded });
  },
  methods: {
    ...mapActions({
      getStats: 'stats/getStats', // map `this.getStats()` to `... dispatch('getStats')`
      addStoredItem: 'lasterrors/add',
      removeStoredItem: 'lasterrors/remove',
      setExpanded: 'lasterrors/setExpanded'
    }),
    initialize: function() {
      this.getStats({ fields: [this.statsField] });
    },
    getKey(rrr) {
      return rrr.path + '.' + rrr.startts;
    },
    getTitle(rrr) {
      return `${rrr.method} ${rrr.path} - ${rrr.http.response.code} (${rrr.responsetime} ms)`;
    },
    getRowClass(row) {
      let key = this.getKey(row);
      let exists = findIndex(propEq('key', key))(this.storedItems);
      if (exists >= 0) {
        return 'sws-bg-gradient-a3a1a3';
      } else {
        return '';
      }
    },
    handleShow(rowIndex) {
      let item = this.rows[rowIndex];
      let key = this.getKey(item);
      let exists = findIndex(propEq('key', key))(this.storedItems);
      if (exists >= 0) {
        // Expand & Scroll to item already shown
        let child = document.getElementById(key);
        if (this.expanded[exists]) {
          this.$refs.scrollArea.setScrollPosition(child.offsetTop, 500);
        } else {
          this.$set(this.expanded, exists, true);
          // need to wait a bit till it fully expands
          setTimeout(() => {
            this.$refs.scrollArea.setScrollPosition(child.offsetTop, 500);
          }, 500);
        }
      } else {
        this.expanded.unshift(true);
        this.addStoredItem({ key: key, data: item });
        this.$refs.scrollArea.setScrollPosition(0);
      }
    },
    handleClear(index) {
      this.expanded.splice(index, 1);
      this.removeStoredItem({ index: index });
    },
    // TODO Reconsider
    loadStats: function() {
      this.timer = setTimeout(() => {
        this.getStats({ fields: [this.statsField] });
      }, 1000);
    },
    updateStats: function() {
      // Update numbers
      //let requestsTotal = pathOr(0, ['all', 'requests'], statsContainer);
      this.rows = pathOr([], [this.statsField], statsContainer);
      //this.loadStats();
    }
  }
};
</script>
