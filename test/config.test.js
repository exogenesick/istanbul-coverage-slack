var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');
var config = require('../src/config');
var nconf = require('nconf');

chai.use(chaiAsPromised);

describe('src/config', () => {
    describe('#()', () => {
        before(() => {
            nconf.use('memory');
            nconf.argv().env();
        });

        beforeEach(() => {
            nconf.clear('SLACK_WEBHOOK_URL');
        });

        it('should reject when SLACK_WEBHOOK_URL not passed', () => {
            var promise = config();

            return expect(promise)
                .to
                .be
                .rejectedWith('Error: SLACK_WEBHOOK_URL is not specified');
        });

        it('should reject when SLACK_WEBHOOK_URL is invalid', () => {
            nconf.set('SLACK_WEBHOOK_URL', 'hdttp://invalid_slack_addr');

            var promise = config();

            return(expect(promise))
                .to
                .be
                .rejectedWith('Error: SLACK_WEBHOOK_URL is not valid');
        });

        // it('should resolve when SLACK_WEBHOOK_URL is valid', () => {
        //     var slackWebhookUrl = 'http://slack_webhook_url.com/some/addr';
        //     nconf.set('SLACK_WEBHOOK_URL', slackWebhookUrl);
        //
        //     var expectedResolve = {
        //         slackWebhookUrl: slackWebhookUrl,
        //         branchName: 'BRANCH_NAME',
        //         project: 'PROJECT_NAME'
        //     }
        //
        //     var promise = config();
        //
        //     return(expect(promise))
        //         .to
        //         .become(expectedResolve);
        // });
    });
});
