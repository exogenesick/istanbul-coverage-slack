var Slack = require('slack-node');

function sendSlackMessage(percent, meme, color) {
    var slack = new Slack();
    slack.setWebhook(webhookUri);

    slack.webhook({
      channel: '#coverage-reports',
      username: 'Chuck Norris',
      icon_emoji: 'https://s3-us-west-2.amazonaws.com/slack-files2/bot_icons/2016-06-16/51472942259_48.png',
      attachments: [{
          image_url: meme,
          mrkdwn_in: ['text', 'author_name'],
          author_name: 'Code coverage report for ' + project,
          text: 'Tests covers *' + percent + '%* of source code on branch *' + branch + '*',
          color: color
      }]
    }, function(err, response) {
        if (err) {
            console.error(err);
            return;
        }

        console.log('Ok');
    });
}

module.exports = sendSlackMessage;
