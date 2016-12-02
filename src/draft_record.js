import jsdom from 'jsdom';
import http from 'http';
import _const from './const';

export default class DraftRecord {
  constructor() {
  }

  record_ids(cookie) {
    return new Promise((resolve, reject) => {
      let opt = {
        method: 'GET',
        host: _const.host,
        port: _const.port,
        path: _const.path_index,
        headers: {
          'Cookie': cookie
        }
      }
      http.request(opt, (serverFeedback) => {
        if (200 === serverFeedback.statusCode) {
          let body = '';
          serverFeedback.on('data', (data) => body += data);
          serverFeedback.on('end', (end) => {
            this.jsdom_record_ids(body).then(
              (data) => resolve(data),
              (err) => reject(err)
            );
          });
        } else {
          reject(`get record_ids error! ${serverFeedback.statusCode}`);
        }
      }).end();
    });
  }

  // only status draft
  jsdom_record_ids(dom) {
    return new Promise((resolve, reject) => {
      jsdom.env(dom, _const.libjquery, (err, window) => {
        if (err) {
          reject(err);
        } else {
          let record_ids = [];
          window.$("input[name = 'key[select][]']").each(
            function() {
              let record_status = window.$(this).parent().parent().find('td:eq(7)').html();
              if ('草稿' == record_status) {
                record_ids.push(window.$(this).val());
              }
            }
          );
          resolve(record_ids);
        }
      });
    });
  }
}
