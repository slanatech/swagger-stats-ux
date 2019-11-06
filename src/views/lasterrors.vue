<script>
import RRRTableWithPreview from '@/components/rrrtablewithpreview.vue';
import { mapState, mapActions } from 'vuex';
export default {
  name: 'LongestRequests',
  extends: RRRTableWithPreview,
  data() {
    return {
      statsField: 'lasterrors',
      sortField: '@timestamp',
    };
  },
  computed: {
    ...mapState({
      statsUpdated: state => state.stats.updated,
      storedItems: state => state.lasterrors.items,
      expandedState: state => state.lasterrors.expanded
    })
  },
  methods: {
    ...mapActions({
      getStats: 'stats/getStats',
      addStoredItem: 'lasterrors/add',
      removeStoredItem: 'lasterrors/remove',
      setExpanded: 'lasterrors/setExpanded'
    }),
  }
};
</script>
