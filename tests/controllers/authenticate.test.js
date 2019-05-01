import chai from 'chai';
import chaiHttp from 'chai-http';
import crypto from 'crypto';
import dotenv from 'dotenv';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import app from '../../app';
import Authenticate from '../../controllers/authenticate';
import { mockApp, mockDatabase, mockSpotify } from '../helper';

const expect = chai.expect;
let url;
let cookies = [];
let mockReq = {
  header: () => null,
  query: {
    token: null,
  },
};
const mockRes = {
  status: sinon.spy(),
  send: sinon.spy(),
};

chai.use(chaiHttp);
chai.use(sinonChai);
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

describe('/authenticate/callback', () => {
  beforeEach(() => {
    url = '/authenticate/callback';

    mockApp();
    mockSpotify();
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
              url = '/authenticate/callback?state=example_state&code=valid_code';
            });

            it('redirects to the app with the access token', () => {
              chai.request(app)
                .get(url)
                .set('cookie', cookies)
                .end((_, res) => {
                  const redirectUrl = `${process.env.MENDREK_APP_URL}/?token=new_access_token&expires=2001-02-03%2001%3A00%3A00`;
                  expect(res).to.redirectTo(redirectUrl);
                });
            });
          });
        });
      });
    });
  });
});

describe('/authenticate/refresh', () => {
  beforeEach(() => {
    mockSpotify();
  });

  context('with no token', () => {
    it('returns 401', () => (
      Authenticate.refresh(mockReq, mockRes).then(() => {
        expect(mockRes.status).to.have.been.calledWith(401);
        expect(mockRes.send).to.have.been.calledWith({
          success: false,
          data: 'No authentication token.',
        });
      })
    ));
  });

  context('with token', () => {
    context('with invalid token', () => {
      beforeEach(() => {
        mockReq = {
          header: () => 'invalid',
        };
      });

      it('returns 401', () => (
        Authenticate.refresh(mockReq, mockRes).then(() => {
          expect(mockRes.status).to.have.been.calledWith(401);
          expect(mockRes.send).to.have.been.calledWith({
            success: false,
            data: 'Invalid authentication token.',
          });
        })
      ));
    });

    context('with valid token', () => {
      beforeEach(() => {
        mockReq = {
          header: () => 'existing_access_token',
        };
      });

      it('returns 200', () => (
        Authenticate.refresh(mockReq, mockRes).then(() => {
          expect(mockRes.status).to.have.been.calledWith(200);
          expect(mockRes.send).to.have.been.calledWith({
            success: true,
            data: {
              access_token: 'new_access_token',
              expires: '2001-02-03 01:00:00',
            },
          });
        })
      ));
    });
  });
});

describe('/authenticate/logout', () => {
  beforeEach(() => mockDatabase());

  context('with no token', () => {
    it('returns 401', () => (
      Authenticate.logout(mockReq, mockRes).then(() => {
        expect(mockRes.status).to.have.been.calledWith(401);
        expect(mockRes.send).to.have.been.calledWith({
          success: false,
          data: 'No authentication token.',
        });
      })
    ));
  });

  context('with token', () => {
    context('with invalid token', () => {
      beforeEach(() => {
        mockReq = {
          header: () => 'invalid',
        };
      });

      it('returns 401', () => (
        Authenticate.logout(mockReq, mockRes).then(() => {
          expect(mockRes.status).to.have.been.calledWith(401);
          expect(mockRes.send).to.have.been.calledWith({
            success: false,
            data: 'Invalid authentication token.',
          });
        })
      ));
    });

    context('with valid token', () => {
      beforeEach(() => {
        mockReq = {
          header: () => 'existing_access_token',
        };
      });

      it('returns 200', () => (
        Authenticate.logout(mockReq, mockRes).then(() => {
          expect(mockRes.status).to.have.been.calledWith(200);
          expect(mockRes.send).to.have.been.calledWith({
            success: true,
            data: 'Logged out.',
          });
        })
      ));
    });
  });
});
