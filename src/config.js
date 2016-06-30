let q = require('q');
let nconf = require('nconf');
let isUrl = require('is-url');
let root = require('app-root-path');
let fs = require('fs');

module.exports = function() {
    var slackWebhookUrl = nconf.get('SLACK_WEBHOOK_URL');

    if (!slackWebhookUrl) {
        return q.reject(new Error('SLACK_WEBHOOK_URL is not specified'));
    }

    if (false === isUrl(slackWebhookUrl)) {
        return q.reject(new Error('SLACK_WEBHOOK_URL is not valid'));
    }

    if (!nconf.get('BRANCH_NAME')) {
        nconf.set('BRANCH_NAME', 'BRANCH_NAME');
    }

    if (!nconf.get('PROJECT_NAME')) {
        nconf.set('PROJECT_NAME', 'PROJECT_NAME');
    }

    return q.nfcall(fs.readFile, root + '/' + 'shout.json', 'utf-8')
        .then(JSON.parse);
};
