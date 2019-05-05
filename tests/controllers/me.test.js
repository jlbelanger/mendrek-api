import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import Me from '../../controllers/me';
import shared from '../shared';
import { mockSpotify } from '../helper';

chai.use(sinonChai);

const expect = chai.expect;
const mockReq = {
  header: () => 'Bearer existing_access_token',
};
const mockRes = {
  send: sinon.spy(),
  set: sinon.spy(),
  status: sinon.spy(),
};

describe('Me', () => {
  describe('index', () => {
    shared.shouldCheckAccessToken(Me.index);

    context('with valid token', () => {
      beforeEach(() => mockSpotify());

      it('returns 200', () => (
        Me.index(mockReq, mockRes).then(() => {
          expect(mockRes.status).to.have.been.calledWith(200);
        })
      ));

      it('returns response', () => (
        Me.index(mockReq, mockRes).then(() => {
          expect(mockRes.send).to.have.been.calledWith(sinon.match({
            success: true,
            data: {
              id: 'example',
            },
          }));
        })
      ));
    });
  });

  describe('playlists', () => {
    shared.shouldCheckAccessToken(Me.playlists);

    context('with valid token', () => {
      beforeEach(() => mockSpotify());

      it('returns 200', () => (
        Me.playlists(mockReq, mockRes).then(() => {
          expect(mockRes.status).to.have.been.calledWith(200);
        })
      ));

      it('returns response', () => (
        Me.playlists(mockReq, mockRes).then(() => {
          expect(mockRes.send).to.have.been.calledWith(sinon.match({
            success: true,
            data: [
              {
                id: 'aaaaaaaaaaaaaaaaaaaaaa',
                name: 'Motown',
              },
              {
                id: 'bbbbbbbbbbbbbbbbbbbbbb',
                name: 'Bubblegum',
              },
            ],
          }));
        })
      ));
    });
  });
});
