import chai from 'chai';
import Session from '../../models/session';
import { mockDatabase } from '../helper';

const expect = chai.expect;

describe('get', () => {
  beforeEach(() => mockDatabase());

  context('when session does not exist', () => {
    it('returns empty array', () => (
      Session.get('does_not_exist')
        .then((results) => {
          expect(results).to.eql([]);
        })
    ));
  });

  context('when session exists', () => {
    beforeEach(() => Session.add({ access_token: 'example_access_token', refresh_token: 'example_refresh_token', expires: '2001-02-03 04:05:06' }));

    it('returns the session', () => (
      Session.get('example_access_token')
        .then((results) => {
          expect(results[0].access_token).to.eql('example_access_token');
        })
    ));
  });
});
