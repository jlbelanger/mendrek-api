import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';

const expect = chai.expect;

chai.use(chaiHttp);

describe('/playlists/foo.csv', () => {
  context('with no token', () => {
    it('returns 401', () => {
      chai.request(app)
        .get('/playlists/foo.csv')
        .end((_, res) => {
          expect(res).to.have.status(401);
        });
    });
  });
});

describe('/playlists/foo.json', () => {
  context('with no token', () => {
    it('returns 401', () => {
      chai.request(app)
        .get('/playlists/foo.json')
        .end((_, res) => {
          expect(res).to.have.status(401);
        });
    });
  });
});

describe('/playlists/foo', () => {
  context('with no token', () => {
    it('returns 401', () => {
      chai.request(app)
        .get('/playlists/foo')
        .end((_, res) => {
          expect(res).to.have.status(401);
        });
    });
  });
});
