const nconf = require('nconf');
const Slack = require('slack-node');
const q = require('q');
const winston = require('winston');

class SlackWebhook {
  send(threshold) {
    return q.promise((resolve, reject) => {
      winston.debug('SlackWebhook sending prepare', threshold);

      const slack = new Slack();
      slack.setWebhook(nconf.get('SLACK_WEBHOOK_URL'));

      const percent = threshold.percent;
      const branch = nconf.get('BRANCH_NAME');

      const payload = {
        channel: nconf.get('SLACK_CHANNEL'),
        username: nconf.get('SLACK_USERNAME'),
        icon_emoji: nconf.get('SLACK_ICON'),
        attachments: [
          {
            image_url: threshold.meme,
            mrkdwn_in: ['text', 'author_name'],
            author_name: `Code coverage report for ${nconf.get('PROJECT_NAME')}`,
            text: `Tests covers *${percent}%* of source code on branch *${branch}*`,
            color: threshold.color,
          },
        ],
      };

      winston.debug('SlackWebhook payload', payload);

      const slackRequestTimeout = setTimeout(() => {
        reject(new Error('Slack request timeout'));
      }, parseInt(nconf.get('SLACK_TIMEOUT'), 10));

      slack.webhook(payload, (err) => {
        if (err) {
          return reject(err);
        }
        clearTimeout(slackRequestTimeout);

        winston.debug('SlackWebhook send ok');

        return resolve();
      });
    });
  }
}

module.exports = SlackWebhook;
