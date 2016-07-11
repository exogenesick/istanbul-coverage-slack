const q = require('q');
const nconf = require('nconf');
const isUrl = require('is-url');
const root = require('app-root-path');
const fs = require('fs');

module.exports = () => {
  nconf.set('ROOT_DIR', root);

  const slackWebhookUrl = nconf.get('SLACK_WEBHOOK_URL');

  if (!slackWebhookUrl) {
    return q.reject(new Error('SLACK_WEBHOOK_URL is not specified'));
  }

  if (isUrl(slackWebhookUrl) === false) {
    return q.reject(new Error('SLACK_WEBHOOK_URL is not valid'));
  }

  if (!nconf.get('BRANCH_NAME')) {
    nconf.set('BRANCH_NAME', 'BRANCH_NAME');
  }

  if (!nconf.get('PROJECT_NAME')) {
    nconf.set('PROJECT_NAME', 'PROJECT_NAME');
  }

  return q.nfcall(fs.readFile, `${root}/shout.json`, 'utf-8')
    .then((data) => {
      let parsedConfig;

      try {
        parsedConfig = JSON.parse(data);
      } catch (e) {
        throw new Error('Parse fail in .shout.json');
      }

      return q.resolve(parsedConfig);
    })
    .then((json) => {
      nconf.set('COVERAGE_REPORTS_FILES', json.reports.files);
      nconf.set('THRESHOLDS', json.thresholds);

      if (!nconf.get('SLACK_CHANNEL')) {
        nconf.set('SLACK_CHANNEL', json.slack.channel);
      }

      if (!nconf.get('SLACK_TIMEOUT')) {
        nconf.set('SLACK_TIMEOUT', json.slack.timeout);
      }
    });
};
