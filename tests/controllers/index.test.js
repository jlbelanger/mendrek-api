import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import Index from '../../controllers/index';

chai.use(sinonChai);

const expect = chai.expect;
const mockReq = {};
const mockRes = {
	send: sinon.spy(),
	status: sinon.spy(),
};

describe('Index', () => {
	describe('index', () => {
		it('returns 200', () => (
			Index.index(mockReq, mockRes).then(() => {
				expect(mockRes.status).to.have.been.calledWith(200);
			})
		));

		it('returns response', () => (
			Index.index(mockReq, mockRes).then(() => {
				expect(mockRes.send).to.have.been.calledWith({
					success: true,
					data: null,
				});
			})
		));
	});
});
