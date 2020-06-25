import chai from 'chai';
import { getExpiryDate, getSessionData, getToken } from '../../utilities/authentication';

const expect = chai.expect;
const mockReq = {
	header: () => null,
	query: {},
};

describe('getExpiryDate', () => {
	context('with invalid value', () => {
		it('returns empty string', () => {
			expect(getExpiryDate(null)).to.eql('');
		});
	});

	context('with valid value', () => {
		it('adds the expiry time to the current date', () => {
			expect(getExpiryDate(3600)).to.eql('2001-02-03 01:00:00');
		});
	});
});

describe('getSessionData', () => {
	context('with no refresh token', () => {
		it('returns the relevant attributes', () => {
			const body = {
				access_token: 'foo',
				expires_in: 3600,
			};
			const expected = {
				access_token: 'foo',
				expires: '2001-02-03 01:00:00',
			};
			expect(getSessionData(body)).to.eql(expected);
		});
	});

	context('with refresh token', () => {
		it('returns the relevant attributes', () => {
			const body = {
				access_token: 'foo',
				expires_in: 3600,
				refresh_token: 'bar',
			};
			const expected = {
				access_token: 'foo',
				expires: '2001-02-03 01:00:00',
				refresh_token: 'bar',
			};
			expect(getSessionData(body)).to.eql(expected);
		});
	});
});

describe('getToken', () => {
	context('with no token', () => {
		it('returns empty string', () => {
			expect(getToken(mockReq)).to.eql('');
		});
	});

	context('with token in the header', () => {
		beforeEach(() => {
			mockReq.header = name => (name === 'Authentication' ? 'foo' : null);
		});

		it('returns the token', () => {
			expect(getToken(mockReq)).to.eql('foo');
		});
	});

	context('with token in the query parameters', () => {
		beforeEach(() => {
			mockReq.header = () => null;
			mockReq.query.token = 'foo';
		});

		it('returns the token', () => {
			expect(getToken(mockReq)).to.eql('foo');
		});
	});
});
