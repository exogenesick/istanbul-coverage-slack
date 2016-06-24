#!/usr/bin/env node

var nconf = require('nconf');
var config = require('../src/config');
var report = require('../src/report');

nconf
    .argv()
    .env();

config()
    .then(report.bind(null))
    .then(() => {
        console.log('ok');
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
