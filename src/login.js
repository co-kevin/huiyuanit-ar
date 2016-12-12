import querystring from 'querystring';
import http from 'http';
import _const from './const';

export default class Login {
  constructor() {
    this.opt = {
      method: 'POST',
      host: _const.host,
      port: _const.port,
      path: _const.path_login,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': _const.user_agent
      }
    }
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
      data = querystring.stringify(data);
      let req = http.request(this.opt, (serverFeedback) => {
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
          reject(`Login error! status code: ${serverFeedback.statusCode}`);
        }
      });
      req.write(`${data}\n`);
      req.end();
    });
  }
}
