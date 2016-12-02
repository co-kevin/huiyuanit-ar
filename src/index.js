import colors from 'colors';
import Draft from './draft';
import Login from './login';
import Submit from './submit';
import DraftRecord from './draft_record';
import workday from '../workday';
import yargs from 'yargs';
import pkg from '../package';

if (yargs.argv.v) {
  console.log(pkg.version);
  process.exit(0);
}

const argv = yargs
  .option('u', {
    alias: 'username',
    demand: true,
    describe: 'The esap.huiyuanit.com login username'
  })
  .option('p', {
    alias: 'password',
    demand: true,
    describe: 'The esap.huiyuanit.com login password'
  })
  .option('s', {
    alias: 'submit',
    describe: 'Do submit draft',
    boolean: true
  })
  .option('i', {
    alias: 'project-id',
    demand: true,
    default: 144,
    describe: 'The project id',
    type: 'int'
  })
  .option('t', {
    alias: 'trip',
    describe: 'The trip is true',
    boolean: true
  })
  .option('c', {
    alias: 'city',
    describe: 'The trip city, if trip is true',
    type: 'string'
  })
  .option('v', {
    alias: 'version',
    describe: 'Print the current version',
    boolean: true
  })
  .argv;

let draft = new Draft();
let login = new Login();
let draft_record = new DraftRecord();
let submit = new Submit();

if (argv.s) {
  // submit
  login.login(argv.u, argv.p).then(
    (cookie) => submit_all_draft(cookie),
    (err) => error(err)
  );
} else {
  // draft
  login.login(argv.u, argv.p).then(
    (cookie) => write_draft(cookie),
    (err) => error(err)
  );
}

function write_draft(cookie) {
  let now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const days = report_dates(year, month);

  if (days) {
    days.map((day) => {
      const report_date = `${year}-${month}-${day}`;
      draft.write_report(report_date, cookie, argv).then(
        (data) => console.log(`DRAFT: ${report_date} ${data}`.green),
        (err) => console.log(`DRAFT: ${report_date} ${err}`.red)
      );
    });
  } else {
    console.log(`Missing workday data month ${year}-${month}`.red);
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

function report_dates($year, $month) {
  let year = workday[$year];
  let days = year[$month];

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
    return null;
  }
}

function error(err) {
  console.log(err.red);
  process.exit(1);
}
