import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';

const expect = chai.expect;

chai.use(chaiHttp);

describe('/', () => {
  it('returns 200', () => {
    chai.request(app)
      .get('/')
      .end((_, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.eql({ success: true });
      });
  });
});

describe('/404', () => {
  it('returns 404', () => {
    chai.request(app)
      .get('/404')
      .end((_, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.eql({ success: false, data: 'Not found.' });
      });
  });
});
