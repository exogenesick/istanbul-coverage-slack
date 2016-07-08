const istanbul = require('istanbul');
const fs = require('fs');
const q = require('q');
const nconf = require('nconf');
const winston = require('winston');
const _ = require('underscore');

class Report {
  generate() {
    let files = nconf.get('COVERAGE_REPORTS_FILES') || [];
    files = files.map((file) => `${nconf.get('ROOT_DIR')}/${file}`);

    winston.debug('Report coverage files', files);

    const collector = new istanbul.Collector();

    try {
      files.forEach((file) => collector.add(JSON.parse(fs.readFileSync(file, 'utf8'))));
    } catch (e) {
      throw new Error('Could not read all coverage files. Generate istanbul report first.');
    }

    const reporter = new istanbul.Reporter();
    reporter.addAll(['json-summary']);

    return q.promise((resolve, reject) => {
      reporter.write(collector, false, (err) => {
        if (err) {
          return reject(err);
        }

        return resolve();
      });
    });
  }

  read() {
    return q.nfcall(fs.readFile, `${nconf.get('ROOT_DIR')}/coverage/coverage-summary.json`, 'utf-8')
      .then((json) => {
        let percent = 0;

        try {
          percent = JSON.parse(json).total.statements.pct;
        } catch (e) {
          throw new Error('Cannot read summary.');
        }

        nconf.set('COVERAGE_PERCENT', percent);
        winston.debug('Report percent', percent);

        return q.resolve(percent);
      })
      .then((coveragePercent) => {
        let coverageThresholds = nconf.get('THRESHOLDS') || [];
        coverageThresholds = _.sortBy(coverageThresholds, 'percent')
          .reverse();

        const foundThreshold = _.find(coverageThresholds, (threshold) =>
          coveragePercent >= threshold.percent
        );

        winston.debug('Report threshold', foundThreshold);

        foundThreshold.percent = coveragePercent;

        return q.resolve(foundThreshold);
      });
  }
}

module.exports = Report;
