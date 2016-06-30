#!/usr/bin/env node

const nconf = require('nconf');
const config = require('../src/config');
const report = require('../src/report');

nconf.use('memory');
nconf
    .argv()
    .env();

config()
    .then(report)
    .then(console.log)
    .catch(console.error);
