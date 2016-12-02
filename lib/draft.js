'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _jsdom = require('jsdom');

var _jsdom2 = _interopRequireDefault(_jsdom);

var _const2 = require('./const');

var _const3 = _interopRequireDefault(_const2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Draft {
  constructor() {
    this.data = {
      'DailyPaper[proj_id]': 144, // 所属项目
      'DailyPaper[user_id]': 0, // 用户ID
      'DailyPaper[encoding]': '', // 日报编码
      'DailyPaper[daily_type]': 1, // 日报类型 1：技术日报
      'DailyPaper[add_time]': '', // 日报时间
      'DailyPaper[trip]': 0, // 是否出差
      'DailyPaper[city]': '', // 出差城市
      'DailyPaper[working]': 0, // 工作时段 0：全天
      'doSubmit': '提交' // 必填
    };
  }

  write_report(add_time, cookie) {
    return new Promise((resolve, reject) => {
      this.get_user_id_and_encoding(cookie).then(param => {
        this.data['DailyPaper[add_time]'] = add_time;
        this.data['DailyPaper[user_id]'] = param.user_id;
        this.data['DailyPaper[encoding]'] = param.encoding;

        let data = _querystring2.default.stringify(this.data);
        let opt = {
          method: 'POST',
          host: _const3.default.host,
          port: _const3.default.port,
          path: _const3.default.path_add,
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
              this.jsdom_write_result(body).then(data => resolve(data), err => reject(err));
            });
          } else {
            reject(`write error! post: ${ data }`);
          }
        });
        req.write(data);
        req.end();
      }, err => reject(err));
    });
  }

  // get user_id and encoding
  get_user_id_and_encoding(cookie) {
    return new Promise((resolve, reject) => {
      let opt = {
        method: 'GET',
        host: _const3.default.host,
        port: _const3.default.port,
        path: _const3.default.path_add,
        headers: {
          'Cookie': cookie
        }
      };
      let req = _http2.default.request(opt, serverFeedback => {
        if (200 === serverFeedback.statusCode) {
          let body = '';
          serverFeedback.on('data', data => body += data);
          serverFeedback.on('end', () => {
            this.jsdom_user_id_and_encoding(body).then(data => resolve(data), err => reject(err));
          });
        } else {
          reject(`get user_id and encoding error! ${ serverFeedback.statusCode }`);
        }
      });
      req.end();
    });
  }

  // get user_id and encoding
  jsdom_user_id_and_encoding(dom) {
    return new Promise((resolve, reject) => {
      _jsdom2.default.env(dom, _const3.default.libjquery, (err, window) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            user_id: window.$("input[name='DailyPaper[user_id]']").val(),
            encoding: window.$("input[name='DailyPaper[encoding]']").val()
          });
        }
      });
    });
  }

  // get write result
  jsdom_write_result(dom) {
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
exports.default = Draft;