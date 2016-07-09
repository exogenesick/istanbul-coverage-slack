const nock = require('nock');
const chai = require('chai');
const expect = require('chai').expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const giphy = require('../src/giphy');

describe('src/giphy', () => {
  describe('()', () => {
    it('should resolve with expected meme', () => {
      // given
      const words = 'cat';

      const expectedHttpResponse = {
        data: [
          {
            type: 'gif',
            id: '9V8Iksyz50BVK',
            slug: '9V8Iksyz50BVK',
            url: 'http://giphy.com/gifs/9V8Iksyz50BVK',
            bitly_gif_url: 'http://gph.is/28KS7c9',
            bitly_url: 'http://gph.is/28KS7c9',
            embed_url: 'http://giphy.com/embed/9V8Iksyz50BVK',
            username: '',
            source: 'http://imgur.com/gallery/yqpsz6z',
            rating: 'pg-13',
            content_url: '',
            source_tld: 'imgur.com',
            source_post_url: 'http://imgur.com/gallery/yqpsz6z',
            is_indexable: 0,
            import_datetime: '2016-06-21 21:59:24',
            trending_datetime: '1970-01-01 00:00:00',
            images: {
              downsized: {
                url: 'https://media.giphy.com/media/9V8Iksyz50BVK/giphy-tumblr.gif',
                width: '250',
                height: '140',
                size: '1362152',
              },
              original: {
                url: 'https://media.giphy.com/media/9V8Iksyz50BVK/giphy-tumblr.gif',
                width: '250',
                height: '140',
                size: '1362152',
              },
            },
          },
        ],
      };

      nock('http://api.giphy.com')
        .get('/v1/gifs/search')
        .query({ q: 'cat', api_key: 'dc6zaTOxFJmzC' })
        .reply(200, expectedHttpResponse);

      const expectedResolve = {
        words,
        meme: expectedHttpResponse.data[0].images.downsized.url,
      };

      // when
      const promise = giphy({ words });

      // then
      return expect(promise).to.become(expectedResolve);
    });

    it('should reject when could not retrieve meme from giphy', () => {
      nock('http://api.giphy.com')
        .get('/v1/gifs/search')
        .query({ q: 'bad cat', api_key: 'dc6zaTOxFJmzC' })
        .reply(500);

      // when
      const promise = giphy({ words: 'bad cat' });

      // then
      return expect(promise).to.be.rejectedWith('Unable to fetch meme');
    });
  });
});
