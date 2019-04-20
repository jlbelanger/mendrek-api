import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { sendError, sendFile, sendSuccess } from '../../utilities/response';

chai.use(sinonChai);

const expect = chai.expect;

let res;

describe('sendError', () => {
  beforeEach('', () => {
    res = {
      status: sinon.spy(),
      send: sinon.spy(),
    };
  });

  it('sends an error status code', () => {
    sendError(res, { foo: 'bar' }, 500);
    expect(res.status).to.have.been.calledWith(500);
  });

  it('returns an unsuccessful body', () => {
    sendError(res, { foo: 'bar' }, 500);
    expect(res.send).to.have.been.calledWith({ success: false, data: { foo: 'bar' } });
  });
});

describe('sendFile', () => {
  beforeEach('', () => {
    res = {
      set: sinon.spy(),
      send: sinon.spy(),
    };
  });

  it('returns the output from the callback', () => {
    sendFile(res, null, 'example.txt', () => ({ example: true }));
    expect(res.send).to.have.been.calledWith({ example: true });
  });

  it('sets the filename', () => {
    sendFile(res, null, 'example.txt', () => ({ example: true }));
    expect(res.set).to.have.been.calledWith('Content-Disposition', 'attachment; filename=example.txt');
  });
});

describe('sendSuccess', () => {
  beforeEach('', () => {
    res = {
      send: sinon.spy(),
    };
  });

  it('returns a successful body', () => {
    sendSuccess(res, { body: { foo: 'bar' } });
    expect(res.send).to.have.been.calledWith({ success: true, data: { foo: 'bar' } });
  });
});
