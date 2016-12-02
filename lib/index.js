'use strict';

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _draft = require('./draft');

var _draft2 = _interopRequireDefault(_draft);

var _login = require('./login');

var _login2 = _interopRequireDefault(_login);

var _submit = require('./submit');

var _submit2 = _interopRequireDefault(_submit);

var _draft_record = require('./draft_record');

var _draft_record2 = _interopRequireDefault(_draft_record);

var _config = require('../config');

var _workday = require('../workday');

var _workday2 = _interopRequireDefault(_workday);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (process.argv.length != 3) {
  console.log('Usage: index.js <option> \n option: draft or submit');
  process.exit(1);
}

const option = process.argv[2];

let draft = new _draft2.default();
let login = new _login2.default();
let draft_record = new _draft_record2.default();
let submit = new _submit2.default();

if ('draft' === option) {
  login.login(_config.user.username, _config.user.password).then(cookie => write_draft(cookie), err => error(err));
} else if ('submit' === option) {
  login.login(_config.user.username, _config.user.password).then(cookie => submit_all_draft(cookie), err => error(err));
} else {
  console.log(`We don't have this option: ${ option }. Expect draft or submit`.red);
  process.exit(1);
}

function write_draft(cookie) {
  const days = report_dates();
  if (days) {
    days.map(day => {
      const report_date = `${ _config.report.year }-${ _config.report.month }-${ day }`;
      draft.write_report(report_date, cookie).then(data => console.log(`DRAFT: ${ report_date } ${ data }`.green), err => console.log(`DRAFT: ${ report_date } ${ err }`.red));
    });
  }
}

function submit_all_draft(cookie) {
  draft_record.record_ids(cookie).then(record_ids => {
    record_ids.map(record_id => {
      submit.submit_report(record_id, cookie).then(data => console.log(`SUBMIT: ${ record_id } ${ data }`.green), err => console.log(`SUBMIT: ${ record_id } ${ err }`.red));
    });
    if (0 === record_ids.length) {
      console.log('Nothing to submit'.green);
    }
  }, err => error(err));
}

function report_dates() {
  let year = _workday2.default[_config.report.year];
  let days = year[_config.report.month];

  if (year && days) {
    // get before now days
    const now_date = new Date().getDate();
    let before_days = [];
    for (let i in days) {
      const day = days[i];
      if (Number(day) > now_date) {
        break;
      } else {
        before_days.push(day);
      }
    }
    return before_days;
  } else {
    console.log(`Missing workday data month ${ _config.report.year }-${ _config.report.month }`.red);
  }
}

function is_report_time_after_now() {
  let now = new Date();
  if (Number(_config.report.year) > now.getFullYear()) {
    return true;
  }
  return Number(_config.report.month) > now.getMonth() + 1;
}

function error(err) {
  console.log(err.red);
  process.exit(1);
}