'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsdom = require('jsdom');

var _jsdom2 = _interopRequireDefault(_jsdom);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _const2 = require('./const');

var _const3 = _interopRequireDefault(_const2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DraftRecord {
  constructor() {}

  record_ids(cookie) {
    return new Promise((resolve, reject) => {
      let opt = {
        method: 'GET',
        host: _const3.default.host,
        port: _const3.default.port,
        path: _const3.default.path_index,
        headers: {
          'Cookie': cookie
        }
      };
      _http2.default.request(opt, serverFeedback => {
        if (200 === serverFeedback.statusCode) {
          let body = '';
          serverFeedback.on('data', data => body += data);
          serverFeedback.on('end', end => {
            this.jsdom_record_ids(body).then(data => resolve(data), err => reject(err));
          });
        } else {
          reject(`get record_ids error! ${ serverFeedback.statusCode }`);
        }
      }).end();
    });
  }

  // only status draft
  jsdom_record_ids(dom) {
    return new Promise((resolve, reject) => {
      _jsdom2.default.env(dom, _const3.default.libjquery, (err, window) => {
        if (err) {
          reject(err);
        } else {
          let record_ids = [];
          window.$("input[name = 'key[select][]']").each(function () {
            // <tr>
            //     <td><input name="key[select][]" type="checkbox" id="" value="5992"></td>
            //     <td>DY_201610_02001</td>
            //     <td>2016年互联网金融大数据分析平台</td>
            //     <td>软件研发中心</td>
            //     <td>张华</td>
            //     <td>2016-10-13</td>
            //     <td>技术日报</td>
            //     <td>草稿</td>
            // </tr>
            let record_status = window.$(this).parent().parent().find('td:eq(7)').html();
            if ('草稿' == record_status) {
              record_ids.push(window.$(this).val());
            }
          });
          resolve(record_ids);
        }
      });
    });
  }
}
exports.default = DraftRecord;