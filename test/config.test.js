const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
const config = require('../src/config');
const nconf = require('nconf');

chai.use(chaiAsPromised);

describe('src/config', () => {
  describe('#()', () => {
    before(() => {
      nconf.use('memory');
      nconf.argv().env();
    });

    beforeEach(() => {
      nconf.set('SLACK_WEBHOOK_URL', null);
      nconf.set('BRANCH_NAME', null);
      nconf.set('PROJECT_NAME', null);
    });

    it('should reject when SLACK_WEBHOOK_URL not passed', () => {
      // given
      const promise = config();
      // then
      return expect(promise)
        .to
        .be
        .rejectedWith('Error: SLACK_WEBHOOK_URL is not specified');
    });

    it('should reject when SLACK_WEBHOOK_URL is invalid', () => {
      // given
      nconf.set('SLACK_WEBHOOK_URL', 'hdttp://invalid_slack_addr');
      // when
      const promise = config();
            // then
      return (expect(promise))
        .to
        .be
        .rejectedWith('Error: SLACK_WEBHOOK_URL is not valid');
    });

    it('should resolve when SLACK_WEBHOOK_URL is valid', () => {
      // given
      const slackWebhookUrl = 'http://slack_webhook_url.com/some/addr';
      nconf.set('SLACK_WEBHOOK_URL', slackWebhookUrl);

      // when
      const promise = config();

      // then
      return (expect(promise))
        .to
        .be
        .fullfiled;
    });

    it('should resolve and get default values on BRANCH_NAME and PROJECT_NAME', () => {
      // given
      const slackWebhookUrl = 'http://slack_webhook_url.com/some/addr';
      nconf.set('SLACK_WEBHOOK_URL', slackWebhookUrl);

      // when
      const promise = config();

      // then
      return promise
        .then(() => {
          expect(nconf.get('BRANCH_NAME')).to.be.equal('BRANCH_NAME');
          expect(nconf.get('PROJECT_NAME')).to.be.equal('PROJECT_NAME');
        });
    });

    it('should resolve and get setup values on BRANCH_NAME and PROJECT_NAME', () => {
      // given
      const slackWebhookUrl = 'http://slack_webhook_url.com/some/addr';
      nconf.set('SLACK_WEBHOOK_URL', slackWebhookUrl);

      const expectedBranchName = 'some-branch_NAME';
      const expectedProjectName = 'project-name';

      nconf.set('BRANCH_NAME', expectedBranchName);
      nconf.set('PROJECT_NAME', expectedProjectName);

      // when
      const promise = config();

      // then
      return promise
        .then(() => {
          expect(nconf.get('BRANCH_NAME')).to.be.equal(expectedBranchName);
          expect(nconf.get('PROJECT_NAME')).to.be.equal(expectedProjectName);
        });
    });
  });
});
