import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);

const expect = chai.expect;

describe('404', () => {
  it('returns 404', () => {
    chai.request(app)
      .get('/404')
      .end((_, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.eql({ success: false, data: 'Not found.' });
      });
  });
});
