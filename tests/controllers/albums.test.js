import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import Albums from '../../controllers/albums';
import shared from '../shared';
import { mockSpotify } from '../helper';

chai.use(sinonChai);

const expect = chai.expect;
const mockReq = {
  header: () => 'Bearer existing_access_token',
  params: {
    id: 'foo',
  },
};
const mockRes = {
  send: sinon.spy(),
  set: sinon.spy(),
  status: sinon.spy(),
};

describe('Albums', () => {
  describe('show', () => {
    shared.shouldCheckAccessToken(Albums.show, { id: 'foo' });

    context('with valid token', () => {
      beforeEach(() => mockSpotify());

      it('returns 200', () => (
        Albums.show(mockReq, mockRes).then(() => {
          expect(mockRes.status).to.have.been.calledWith(200);
        })
      ));

      it('returns response', () => (
        Albums.show(mockReq, mockRes).then(() => {
          expect(mockRes.send).to.have.been.calledWith(sinon.match({
            success: true,
            data: {
              id: '618fk3ITH2nXQtT0nTTZ84',
              name: 'Good Times!',
              release_date: '2016-05-27',
              tracks: [sinon.match.object, sinon.match.object],
            },
          }));
        })
      ));
    });
  });
});
