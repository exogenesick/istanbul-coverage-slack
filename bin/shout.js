#!/usr/bin/env node

const nconf = require('nconf');
const winston = require('winston');

const config = require('../src/config');
const Report = require('../src/report');
const SlackWebhook = require('../src/webhook');
const giphy = require('../src/giphy');

winston.level = nconf.get('VERBOSE') || 'info';

nconf.use('memory');
nconf
  .argv()
  .env();

const report = new Report();
const slackWebhook = new SlackWebhook();

config()
  .then((x) => report.generate(x))
  .then((y) => report.read(y))
  .then((threshold) => giphy(threshold))
  .then((z) => slackWebhook.send(z))
  .catch((err) => { console.error(err); process.exit(1); });
