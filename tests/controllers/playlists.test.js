import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import Playlists from '../../controllers/playlists';

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

describe('/playlists/:id', () => {
  context('with no token', () => {
    it('returns 401', () => (
      Playlists.show(mockReq, mockRes).then(() => {
        expect(mockRes.status).to.have.been.calledWith(401);
        expect(mockRes.send).to.have.been.calledWith({
          success: false,
          data: 'No authentication token.',
        });
      })
    ));
  });
});

describe('/playlists/:id.csv', () => {
  context('with no token', () => {
    it('returns 401', () => (
      Playlists.csv(mockReq, mockRes).then(() => {
        expect(mockRes.status).to.have.been.calledWith(401);
        expect(mockRes.send).to.have.been.calledWith({
          success: false,
          data: 'No authentication token.',
        });
      })
    ));
  });
});

describe('/playlists/:id.json', () => {
  context('with no token', () => {
    it('returns 401', () => (
      Playlists.json(mockReq, mockRes).then(() => {
        expect(mockRes.status).to.have.been.calledWith(401);
        expect(mockRes.send).to.have.been.calledWith({
          success: false,
          data: 'No authentication token.',
        });
      })
    ));
  });
});
