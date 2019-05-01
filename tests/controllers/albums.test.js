import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import Albums from '../../controllers/albums';

chai.use(sinonChai);

const expect = chai.expect;
const mockReq = {
  header: () => null,
  query: {
    token: null,
  },
};
const mockRes = {
  status: sinon.spy(),
  send: sinon.spy(),
};

describe('/albums/:id', () => {
  context('with no token', () => {
    it('returns 401', () => (
      Albums.show(mockReq, mockRes).then(() => {
        expect(mockRes.status).to.have.been.calledWith(401);
        expect(mockRes.send).to.have.been.calledWith({
          success: false,
          data: 'No authentication token.',
        });
      })
    ));
  });
});
