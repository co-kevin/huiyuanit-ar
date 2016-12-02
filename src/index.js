import colors from 'colors';
import Draft from './draft';
import Login from './login';
import Submit from './submit';
import DraftRecord from './draft_record';
import {
  user,
  report
} from '../config';
import workday from '../workday';

if (process.argv.length != 3) {
  console.log('Usage: index.js <option> \n option: draft or submit');
  process.exit(1);
}

const option = process.argv[2];

let draft = new Draft();
let login = new Login();
let draft_record = new DraftRecord();
let submit = new Submit();

if ('draft' === option) {
  login.login(user.username, user.password).then(
    (cookie) => write_draft(cookie),
    (err) => error(err)
  );
} else if ('submit' === option) {
  login.login(user.username, user.password).then(
    (cookie) => submit_all_draft(cookie),
    (err) => error(err)
  );
} else {
  console.log(`We don't have this option: ${option}. Expect draft or submit`.red);
  process.exit(1);
}

function write_draft(cookie) {
  const days = report_dates();
  if (days) {
    days.map((day) => {
      const report_date = `${report.year}-${report.month}-${day}`;
      draft.write_report(report_date, cookie).then(
        (data) => console.log(`DRAFT: ${report_date} ${data}`.green),
        (err) => console.log(`DRAFT: ${report_date} ${err}`.red)
      );
    });
  }
}

function submit_all_draft(cookie) {
  draft_record.record_ids(cookie).then((record_ids) => {
    record_ids.map((record_id) => {
      submit.submit_report(record_id, cookie).then(
        (data) => console.log(`SUBMIT: ${record_id} ${data}`.green),
        (err) => console.log(`SUBMIT: ${record_id} ${err}`.red)
      );
    });
    if (0 === record_ids.length) {
      console.log('Nothing to submit'.green);
    }
  }, (err) => error(err));
}

function report_dates() {
  let year = workday[report.year];
  let days = year[report.month];

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
    console.log(`Missing workday data month ${report.year}-${report.month}`.red);
  }
}

function is_report_time_after_now() {
  let now = new Date();
  if (Number(report.year) > now.getFullYear()) {
    return true;
  }
  return Number(report.month) > (now.getMonth() + 1)
}

function error(err) {
  console.log(err.red);
  process.exit(1);
}
