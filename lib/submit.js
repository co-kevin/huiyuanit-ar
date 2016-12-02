'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _jsdom = require('jsdom');

var _jsdom2 = _interopRequireDefault(_jsdom);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _const2 = require('./const');

var _const3 = _interopRequireDefault(_const2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Submit {
  constructor() {}

  submit_report(record_id, cookie) {
    return new Promise((resolve, reject) => {
      let data = _querystring2.default.stringify({
        record_id: record_id,
        doSubmit: '提交'
      });

      let opt = {
        method: 'POST',
        host: _const3.default.host,
        port: _const3.default.port,
        path: _const3.default.path_submit,
        headers: {
          'Cookie': cookie,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };

      let req = _http2.default.request(opt, serverFeedback => {
        if (200 === serverFeedback.statusCode) {
          let body = '';
          serverFeedback.on('data', data => body += data);
          serverFeedback.on('end', () => {
            this.jsdom_submit_result(body).then(data => resolve(data), err => reject(err));
          });
        } else {
          reject(`submit report error! code: ${ serverFeedback.statusCode } post: ${ data }`);
        }
      });
      req.write(data);
      req.end();
    });
  }

  // get submit result
  jsdom_submit_result(dom) {
    return new Promise((resolve, reject) => {
      _jsdom2.default.env(dom, _const3.default.libjquery, (err, window) => {
        if (err) {
          reject(err);
        } else {
          resolve(window.$('.content.guery').html());
        }
      });
    });
  }
}
exports.default = Submit;