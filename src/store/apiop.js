/* API Operation */

import axios from 'axios';

// TODO Logging

class ApiOp {
  constructor(options = {}) {
    this.options = options;
    this.success = false;
    this.code = 0;
    this.message = '';
    this.payload = null;
  }

  execute() {
    let apiop = this;
    return new Promise(function(resolve) {
      axios(apiop.options)
        .then(function(response) {
          apiop.success = true;
          apiop.code = response.status;
          apiop.payload = response.data;
          apiop.message = response.statusText;
          resolve(apiop);
        })
        .catch(function(error) {
          apiop.success = false;
          apiop.code = error.response.status;
          apiop.message = error.response.statusText;
          apiop.payload = error.response.data;
          resolve(apiop);
        });
    });
  }
}

export default ApiOp;
