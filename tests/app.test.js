import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);

const expect = chai.expect;

describe('OPTIONS', () => {
	it('returns 200', () => {
		chai.request(app)
			.options('/')
			.end((_, res) => {
				expect(res).to.have.status(200);
			});
	});
});
