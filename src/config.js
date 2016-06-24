var q = require('q');
var nconf = require('nconf');
var isUrl = require('is-url');
var root = require('app-root-path');

module.exports = function() {
    var slackWebhookUrl = nconf.get('SLACK_WEBHOOK_URL');

    if (!slackWebhookUrl) {
        return q.reject(new Error('SLACK_WEBHOOK_URL is not specified'));
    }

    if (false === isUrl(slackWebhookUrl)) {
        return q.reject(new Error('SLACK_WEBHOOK_URL is not valid'));
    }

    return q.resolve({
        slackWebhookUrl: slackWebhookUrl,
        branchName: nconf.get('BRANCH_NAME') || 'BRANCH_NAME',
        project: nconf.get('PROJECT_NAME') || 'PROJECT_NAME',
        files: [root + '/']
    });
};
