/* Storage for all stats retrieved via api */

class StatsContainer {
  constructor() {}

  updateStats(stats) {
    for (let key of Object.keys(stats)) {
      // Store whatever we loaded
      this[key] = stats[key];
    }
  }
}
let statsContainer = new StatsContainer();
export default statsContainer;
