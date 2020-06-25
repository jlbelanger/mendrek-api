import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { sendError, sendFile, sendSuccess } from '../../utilities/response';

chai.use(sinonChai);

const expect = chai.expect;
const mockRes = {
	send: sinon.spy(),
	set: sinon.spy(),
	status: sinon.spy(),
};

describe('sendError', () => {
	it('sends an error status code', () => {
		sendError(mockRes, { foo: 'bar' }, 500);
		expect(mockRes.status).to.have.been.calledWith(500);
	});

	it('returns an unsuccessful body', () => {
		sendError(mockRes, { foo: 'bar' }, 500);
		expect(mockRes.send).to.have.been.calledWith({ success: false, data: { foo: 'bar' } });
	});
});

describe('sendFile', () => {
	it('returns the data', () => {
		sendFile(mockRes, 'example.txt', { example: true });
		expect(mockRes.send).to.have.been.calledWith({ example: true });
	});

	it('sets the filename', () => {
		sendFile(mockRes, 'example.txt', { example: true });
		expect(mockRes.set).to.have.been.calledWith('Content-Disposition', 'attachment; filename=example.txt');
	});
});

describe('sendSuccess', () => {
	it('returns a successful body', () => {
		sendSuccess(mockRes, { foo: 'bar' });
		expect(mockRes.status).to.have.been.calledWith(200);
		expect(mockRes.send).to.have.been.calledWith({ success: true, data: { foo: 'bar' } });
	});
});
