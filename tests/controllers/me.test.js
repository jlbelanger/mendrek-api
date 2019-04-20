import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';

const expect = chai.expect;

chai.use(chaiHttp);

describe('/me', () => {
  context('with no token', () => {
    it('returns 401', () => {
      chai.request(app)
        .get('/me')
        .end((_, res) => {
          expect(res).to.have.status(401);
        });
    });
  });
});

describe('/me/playlists', () => {
  context('with no token', () => {
    it('returns 401', () => {
      chai.request(app)
        .get('/me/playlists')
        .end((_, res) => {
          expect(res).to.have.status(401);
        });
    });
  });
});
