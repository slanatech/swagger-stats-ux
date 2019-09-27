/* Storage for all stats retrieved via api */
import { pathOr } from 'ramda';

class StatsContainer {
  constructor() {}

  updateStats(stats) {
    for (let key of Object.keys(stats)) {
      // Store whatever we loaded
      this[key] = stats[key];
    }
  }

  // Returns timeline sorted by timestampts asc
  // TODO add API to return timeline in array already sorted
  getSortedTimeline() {
    let timelineSorted = [];
    let timelineSettings = pathOr(null, ['timeline', 'settings'], this);
    let timelineData = pathOr(null, ['timeline', 'data'], this);
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
    return timelineSorted;
  }
}
let statsContainer = new StatsContainer();
export default statsContainer;
