import querystring from 'querystring';
import http from 'http';
import jsdom from 'jsdom';
import _const from './const';

export default class Draft {
  constructor() {
    this.data = {
      'proj_id': 144, // 所属项目
      'user_id': 0, // 用户ID
      'encoding': '', // 日报编码
      'daily_type': 1, // 日报类型 1：技术日报
      'add_time': '', // 日报时间
      'trip': 0, // 是否出差
      'city': '', // 出差城市
      'working': 0, // 工作时段 0：全天
      'working1': 0, // 工作时段 0：全天
      'working2': 0, // 工作时段 0：全天
      'content': '',// 工作内容
      'doSubmit': 'doSubmit' // 必填
    };
  }

  write_report(add_time, cookie) {
    return new Promise((resolve, reject) => {
      this.get_user_id_and_encoding(cookie).then((param) => {
        this.data['add_time'] = add_time;
        this.data['user_id'] = param.user_id;
        this.data['encoding'] = param.encoding;

        let data = querystring.stringify(this.data);
        let opt = {
          method: 'POST',
          host: _const.host,
          port: _const.port,
          path: _const.path_add,
          headers: {
            'Cookie': cookie,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        };

        let req = http.request(opt, (serverFeedback) => {
          if (200 === serverFeedback.statusCode) {
            let body = '';
            serverFeedback.on('data', (data) => body += data);
            serverFeedback.on('end', () => {
              this.jsdom_write_result(body).then(
                (data) => resolve(data),
                (err) => reject(err)
              );
            });
          } else {
            reject(`${serverFeedback.statusCode} write error! post: ${data}`);
          }
        });
        req.write(data);
        req.end();
      }, (err) => reject(err));
    });
  }

  // get user_id and encoding
  get_user_id_and_encoding(cookie) {
    return new Promise((resolve, reject) => {
      let opt = {
        method: 'GET',
        host: _const.host,
        port: _const.port,
        path: _const.path_add,
        headers: {
          'Cookie': cookie
        }
      };
      let req = http.request(opt, (serverFeedback) => {
        if (200 === serverFeedback.statusCode) {
          let body = '';
          serverFeedback.on('data', (data) => body += data);
          serverFeedback.on('end', () => {
            this.jsdom_user_id_and_encoding(body).then(
              (data) => resolve(data),
              (err) => reject(err)
            );
          })
        } else {
          reject(`get user_id and encoding error! ${serverFeedback.statusCode}`);
        }
      })
      req.end();
    });
  }

  // get user_id and encoding
  jsdom_user_id_and_encoding(dom) {
    return new Promise((resolve, reject) => {
      jsdom.env(dom, _const.libjquery, (err, window) => {
          if (err) {
            reject(err);
          } else {
            resolve({
              user_id: window.$("input[name='user_id']").val(),
              encoding: window.$("input[name='encoding']").val()
            });
          }
        }
      );
    });
  }

  // get write result
  jsdom_write_result(dom) {
    return new Promise((resolve, reject) => {
      jsdom.env(dom, _const.libjquery, (err, window) => {
        if (err) {
          reject(err);
        } else {
          resolve(window.$('.sweetalert_content h3').html());
        }
      });
    });
  }
}
