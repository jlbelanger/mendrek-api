import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import Artists from '../../controllers/artists';
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

describe('Artists', () => {
	describe('show', () => {
		shared.shouldCheckAccessToken(Artists.show, { id: 'foo' });

		context('with valid token', () => {
			beforeEach(() => mockSpotify());

			context('with a single page of albums', () => {
				beforeEach(() => {
					mockReq.params.id = 'foo';
				});

				it('returns 200', () => (
					Artists.show(mockReq, mockRes).then(() => {
						expect(mockRes.status).to.have.been.calledWith(200);
					})
				));

				it('returns response', () => (
					Artists.show(mockReq, mockRes).then(() => {
						expect(mockRes.send).to.have.been.calledWith(sinon.match({
							success: true,
							data: {
								id: '320EPCSEezHt1rtbfwH6Ck',
								name: 'The Monkees',
								tracks: [sinon.match.object, sinon.match.object],
							},
						}));
					})
				));
			});

			context('with multiple pages of albums', () => {
				beforeEach(() => {
					mockReq.params.id = 'foo-many-albums';
				});

				it('returns 200', () => (
					Artists.show(mockReq, mockRes).then(() => {
						expect(mockRes.status).to.have.been.calledWith(200);
					})
				));

				it('returns response', () => (
					Artists.show(mockReq, mockRes).then(() => {
						expect(mockRes.send).to.have.been.calledWith(sinon.match({
							success: true,
							data: {
								id: '320EPCSEezHt1rtbfwH6Ck',
								name: 'The Monkees',
								tracks: [
									sinon.match.object, sinon.match.object,
									sinon.match.object, sinon.match.object,
								],
							},
						}));
					})
				));
			});
		});
	});
});
