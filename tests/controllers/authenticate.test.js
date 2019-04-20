import chai from 'chai';
import chaiHttp from 'chai-http';
import crypto from 'crypto';
import dotenv from 'dotenv';
import sinon from 'sinon';
import app from '../../app';
import { mockApp, mockDatabase, mockSpotify } from '../helper';

const expect = chai.expect;

chai.use(chaiHttp);
dotenv.config();

describe('/authenticate', () => {
  beforeEach(mockSpotify);

  it('sets the state cookie', () => {
    const agent = chai.request.agent(app);
    agent.get('/authenticate')
      .end(() => {
        expect(agent).to.have.cookie('state');
        agent.close();
      });
  });

  it('redirects to Spotify', () => {
    sinon.stub(crypto, 'randomBytes').returns('12345678901234567890');

    chai.request(app)
      .get('/authenticate')
      .end((_, res) => {
        const redirectUri = `${process.env.MENDREK_API_DOMAIN}${process.env.MENDREK_API_PATH}authenticate/callback`;
        const cont = `https://accounts.spotify.com/authorize?client_id=${process.env.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${redirectUri}&scope=playlist-read-private&state=12345678901234567890`;
        expect(res).to.redirectTo(cont);
      });
  });
});

let url;
let cookies = [];

describe('/authenticate/callback', () => {
  beforeEach(() => {
    url = '/authenticate/callback';

    mockApp();
    mockSpotify();

    return mockDatabase();
  });

  context('with no state param', () => {
    it('returns 401', () => {
      chai.request(app)
        .get(url)
        .set('cookie', cookies)
        .end((_, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.be.eql({
            success: false,
            data: 'Missing state parameter.',
          });
        });
    });
  });

  context('with state param', () => {
    beforeEach('', () => {
      url = '/authenticate/callback?state=example_state';
    });

    context('with no code param', () => {
      it('returns 401', () => {
        chai.request(app)
          .get(url)
          .set('cookie', cookies)
          .end((_, res) => {
            expect(res).to.have.status(401);
            expect(res.body).to.be.eql({
              success: false,
              data: 'Missing code parameter.',
            });
          });
      });
    });

    context('with code param', () => {
      beforeEach('', () => {
        url = '/authenticate/callback?state=example_state&code=example_code';
      });

      context('with no state cookie', () => {
        it('returns 401', () => {
          chai.request(app)
            .get(url)
            .set('cookie', cookies)
            .end((_, res) => {
              expect(res).to.have.status(401);
              expect(res.body).to.be.eql({
                success: false,
                data: 'Missing state cookie.',
              });
            });
        });
      });

      context('with state cookie', () => {
        beforeEach('', () => {
          cookies = ['state=example_state'];
        });

        context('with invalid state cookie', () => {
          beforeEach('', () => {
            cookies = ['state=invalid'];
          });

          it('returns 401', () => {
            chai.request(app)
              .get(url)
              .set('cookie', cookies)
              .end((_, res) => {
                expect(res).to.have.status(401);
                expect(res.body).to.be.eql({
                  success: false,
                  data: 'Invalid state.',
                });
              });
          });
        });

        context('with valid state cookie', () => {
          context('with invalid code param', () => {
            beforeEach('', () => {
              url = '/authenticate/callback?state=example_state&code=invalid';
            });

            it('returns 401', () => {
              chai.request(app)
                .get(url)
                .set('cookie', cookies)
                .end((_, res) => {
                  expect(res).to.have.status(401);
                  expect(res.body).to.be.eql({
                    success: false,
                    data: 'Invalid code.',
                  });
                });
            });
          });

          context('with valid code param', () => {
            beforeEach('', () => {
              url = '/authenticate/callback?state=example_state&code=example_code';
            });

            it('redirects to the app with the access token', () => {
              chai.request(app)
                .get(url)
                .set('cookie', cookies)
                .end((_, res) => {
                  const redirectUrl = `${process.env.MENDREK_APP_URL}/?token=example_access_token`;
                  expect(res).to.redirectTo(redirectUrl);
                });
            });
          });
        });
      });
    });
  });
});
