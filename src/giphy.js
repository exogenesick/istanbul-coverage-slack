const request = require('request-promise');
const _ = require('underscore');
const q = require('q');
const winston = require('winston');

module.exports = (threshold) => {
  const thresholdData = threshold;
  const requestUrl = `http://api.giphy.com/v1/gifs/search?q=${threshold.words}&api_key=dc6zaTOxFJmzC`;

  winston.debug('Giphy request', requestUrl);

  const options = {
    method: 'GET',
    uri: requestUrl,
    json: true,
  };

  return request(requestUrl, options)
    .then((json) => {
      winston.debug('Giphy response', JSON.stringify(json, null, 2));
      return q.resolve(_.sample(json.data).images.downsized.url);
    })
    .then((imageUrl) => {
      thresholdData.meme = imageUrl;
      return q.resolve(thresholdData);
    })
    .catch(() => {
      throw new Error('Unable to fetch meme');
    });
};
