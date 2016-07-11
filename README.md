# istanbul-coverage-slack

Sends coverage reports on Slack webhook.

[![Build Status](https://travis-ci.org/exogenesick/istanbul-coverage-slack.svg?branch=master)](https://travis-ci.org/exogenesick/istanbul-coverage-slack) [![Coverage Status](https://coveralls.io/repos/github/exogenesick/istanbul-coverage-slack/badge.svg?branch=master)](https://coveralls.io/github/exogenesick/istanbul-coverage-slack?branch=master)

## Install

```
npm i --save-dev istanbul-coverage-slack
```

## Before You run

Make sure You configure webhook on Your Slack team https://api.slack.com/incoming-webhooks

Put file ```shout.json``` (example below) into root directory of Your project.

```json
{
  "reports": {
    "files": ["coverage/coverage.json"]
  },
  "slack": {
    "username": "Chuck Norris",
    "channel": "reports",
    "icon": "https://s3-us-west-2.amazonaws.com/slack-files2/bot_icons/2016-06-16/51472942259_48.png",
    "timeout": 5000
  },
  "thresholds": [
    {
      "percent": 100,
      "words": "excellent",
      "color": "good"
    },
    {
      "percent": 80,
      "words": "nice",
      "color": "warning"
    },
    {
      "percent": 50,
      "words": "do it better",
      "color": "warning"
    },
    {
      "percent": 40,
      "words": "mad",
      "color": "danger"
    },
    {
      "percent": 0,
      "words": "crap",
      "color": "danger"
    }
  ]
}
```
**Notice:** Coverage report for You project must be generated. If not generate coverage report via istanbul. This coverage report should correspond with ```reports.files``` section located in ```shout.json```.

## Run

Inside Your project root directory You can use on of following run sequence.

### Via arguments

```bash
./node_modules/.bin/shout --SLACK_WEBHOOK_URL=https://hooks.slack.com/...
```

### Via env variables

```bash
export SLACK_WEBHOOK_URL=https://hooks.slack.com/... && ./node_modules/.bin/shout
```

### Via npm task

```json
...
"shout": "./node_modules/.bin/shout",
...
```

```bash
export SLACK_WEBHOOK_URL=https://hooks.slack.com/... && npm run shout
```

### Additional parameters

* ```--BRANCH_NAME``` - name of the branch
* ```--PROJECT_NAME``` - name of the project

You can also override ```shout.json``` factors

* ```--SLACK_CHANNEL``` - selected channel of Your Slack team
* ```--SLACK_TIMEOUT``` - in milliseconds request timeout to slack webhook (default 5000ms)
* ```--LOG``` - ```debug``` for verbose

This will send coverage report into Slack webhook and Your message should look like below

![Message example](https://s31.postimg.org/tv3esvdxn/slack_webhook_example.png "Message example")

## Debug

If You have troubles with receiving messages launch for more information about any issues.

```bash
./node_modules/.bin/shout --LOG=debug
```
