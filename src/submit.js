import querystring from 'querystring';
import jsdom from 'jsdom';
import http from 'http';
import _const from './const';

export default class Submit {
  constructor() {
  }

  submit_report(record_id, cookie) {
    return new Promise((resolve, reject) => {
      let data = querystring.stringify({
        record_id: record_id
      });

      let opt = {
        method: 'POST',
        host: _const.host,
        port: _const.port,
        path: _const.path_submit,
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
            this.jsdom_submit_result(body).then(
              (data) => resolve(data),
              (err) => reject(err)
            );
          });
        } else {
          reject(`submit report error! code: ${serverFeedback.statusCode} post: ${data}`);
        }
      });
      req.write(data);
      req.end();
    });
  }

  // get submit result
  jsdom_submit_result(dom) {
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
