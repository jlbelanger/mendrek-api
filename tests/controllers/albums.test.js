import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';

const expect = chai.expect;

chai.use(chaiHttp);

describe('/albums/foo', () => {
  context('with no token', () => {
    it('returns 401', () => {
      chai.request(app)
        .get('/albums/foo')
        .end((_, res) => {
          expect(res).to.have.status(401);
        });
    });
  });
});
