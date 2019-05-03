/* eslint-disable import/no-extraneous-dependencies */
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { mockSpotify } from './helper';

chai.use(sinonChai);

const expect = chai.expect;
const mockReq = {
  header: () => null,
  query: {
    token: null,
  },
};
const mockRes = {
  send: sinon.spy(),
  set: sinon.spy(),
  status: sinon.spy(),
};

exports.shouldCheckAccessToken = (promise, params) => {
  beforeEach(() => {
    mockReq.params = params;

    mockSpotify();
  });

  context('with no token', () => {
    it('returns 401', () => (
      promise(mockReq, mockRes).then(() => {
        expect(mockRes.status).to.have.been.calledWith(401);
        expect(mockRes.send).to.have.been.calledWith({
          success: false,
          data: 'No authentication token.',
        });
      })
    ));
  });

  context('with invalid token', () => {
    beforeEach(() => {
      mockReq.header = () => 'Bearer invalid';
    });

    it('returns 401', () => (
      promise(mockReq, mockRes).then(() => {
        expect(mockRes.status).to.have.been.calledWith(401);
        expect(mockRes.send).to.have.been.calledWith({
          success: false,
          data: 'Unauthorized',
        });
      })
    ));
  });

  context('with valid token', () => {
    beforeEach(() => {
      mockReq.header = () => 'Bearer existing_access_token';
    });

    it('returns 401', () => (
      promise(mockReq, mockRes).then(() => {
        expect(mockRes.status).to.have.been.calledWith(200);
      })
    ));
  });
};
