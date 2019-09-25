import ApiOp from '@/store/apiop';
//import { pathOr } from 'ramda';

// ??? Configurable
const baseURL = '/swagger-stats';

const swaggerStatsAPI = {
  getStats({ fields = null, method = null, path = null }) {
    let params = {};
    if (fields) {
      params.fields = fields;
    }
    if (method) {
      params.method = method;
    }
    if (path) {
      params.path = path;
    }
    return new ApiOp({
      method: 'get',
      url: `${baseURL}/stats`,
      params: params
    }).execute();
  }
};

export default swaggerStatsAPI;
