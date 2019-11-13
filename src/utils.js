// Utilities

class Utils {
  constructor() {}

  formatBytes(a, b) {
    if (0 === a) return { value: 0, qualifier: 'Bytes' };
    let c = 1e3,
      d = b || 2,
      e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      f = Math.floor(Math.log(a) / Math.log(c));
    return { value: parseFloat((a / Math.pow(c, f)).toFixed(d)), qualifier: e[f] };
  }

  bucketsToLabels(buckets) {
    let labels = [];
    if (Array.isArray(buckets) && buckets.length > 0) {
      let prevBucket = 0;
      for (let bucket of buckets) {
        labels.push(`${prevBucket}-${bucket}`);
        prevBucket = bucket;
      }
      labels.push(`${prevBucket}-inf`);
    }
    return labels;
  }
}

const utils = new Utils();
export default utils;
