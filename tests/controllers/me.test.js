import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import Me from '../../controllers/me';

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

describe('/me', () => {
  context('with no token', () => {
    it('returns 401', () => (
      Me.index(mockReq, mockRes).then(() => {
        expect(mockRes.status).to.have.been.calledWith(401);
        expect(mockRes.send).to.have.been.calledWith({
          success: false,
          data: 'No authentication token.',
        });
      })
    ));
  });
});

describe('/me/playlists', () => {
  context('with no token', () => {
    it('returns 401', () => (
      Me.playlists(mockReq, mockRes).then(() => {
        expect(mockRes.status).to.have.been.calledWith(401);
        expect(mockRes.send).to.have.been.calledWith({
          success: false,
          data: 'No authentication token.',
        });
      })
    ));
  });
});
