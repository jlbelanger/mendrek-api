import chai from 'chai';
import sinon from 'sinon';
import { getExpiryDate, getSessionData, getToken } from '../../utilities/authentication';

const expect = chai.expect;

let clock;
let req;

describe('getExpiryDate', () => {
  beforeEach('', () => {
    clock = sinon.useFakeTimers(new Date(Date.UTC(2001, 1, 3, 0, 0, 0)).getTime());
  });

  afterEach('', () => {
    clock.restore();
  });

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
  beforeEach('', () => {
    clock = sinon.useFakeTimers(new Date(Date.UTC(2001, 1, 3, 0, 0, 0)).getTime());
  });

  afterEach('', () => {
    clock.restore();
  });

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
    beforeEach('', () => {
      req = {
        header: () => null,
        query: {},
      };
    });

    it('returns empty string', () => {
      expect(getToken(req)).to.eql('');
    });
  });

  context('with token in the header', () => {
    beforeEach('', () => {
      req = {
        header: name => (name === 'Authentication' ? 'foo' : null),
        query: {},
      };
    });

    it('returns the token', () => {
      expect(getToken(req)).to.eql('foo');
    });
  });

  context('with token in the query parameters', () => {
    beforeEach('', () => {
      req = {
        header: () => null,
        query: {
          token: 'foo',
        },
      };
    });

    it('returns the token', () => {
      expect(getToken(req)).to.eql('foo');
    });
  });
});
