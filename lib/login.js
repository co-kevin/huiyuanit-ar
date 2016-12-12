'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _const2 = require('./const');

var _const3 = _interopRequireDefault(_const2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Login {
  constructor() {
    this.opt = {
      method: 'POST',
      host: _const3.default.host,
      port: _const3.default.port,
      path: _const3.default.path_login,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': _const3.default.user_agent
      }
    };
  }

  adminphpsessid(headers) {
    let cookies = headers['set-cookie'];
    if (cookies && cookies.length > 0) {
      // if has one more cookies, get last cookie
      return cookies[cookies.length - 1];
    }
  }

  login(username, password) {
    return new Promise((resolve, reject) => {
      let data = {
        'AdminLoginForm[username]': username,
        'AdminLoginForm[password]': password
      };
      data = _querystring2.default.stringify(data);
      let req = _http2.default.request(this.opt, serverFeedback => {
        // console.log(serverFeedback.statusCode);
        // console.log(serverFeedback.headers);
        if (200 === serverFeedback.statusCode) {
          // username or password wrong
          reject('The username or password error! Please check and try again');
        } else if (302 === serverFeedback.statusCode) {
          // login success
          resolve(this.adminphpsessid(serverFeedback.headers));
        } else {
          // error
          reject(`Login error! status code: ${ serverFeedback.statusCode }`);
        }
      });
      req.write(`${ data }\n`);
      req.end();
    });
  }
}
exports.default = Login;