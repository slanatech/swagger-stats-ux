<script>
import RRRTableWithPreview from '@/components/rrrtablewithpreview.vue';
import { mapState, mapActions } from 'vuex';
export default {
  name: 'LongestRequests',
  extends: RRRTableWithPreview,
  data() {
    return {
      statsField: 'longestreq',
      sortField: 'responsetime',
    };
  },
  computed: {
    ...mapState({
      statsUpdated: state => state.stats.updated,
      storedItems: state => state.longestrequests.items,
      expandedState: state => state.longestrequests.expanded
    })
  },
  methods: {
    ...mapActions({
      getStats: 'stats/getStats',
      addStoredItem: 'longestrequests/add',
      removeStoredItem: 'longestrequests/remove',
      setExpanded: 'longestrequests/setExpanded'
    }),
  }
};
</script>
