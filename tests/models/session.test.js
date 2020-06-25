import chai from 'chai';
import Session from '../../models/session';
import { mockDatabase } from '../helper';

const expect = chai.expect;

describe('Session', () => {
	describe('get', () => {
		context('when session does not exist', () => {
			it('returns empty array', () => (
				Session.get('invalid')
					.then((results) => {
						expect(results).to.eql([]);
					})
			));
		});

		context('when session exists', () => {
			beforeEach(() => mockDatabase());

			it('returns the session', () => (
				Session.get('existing_access_token')
					.then((results) => {
						expect(results).to.eql([
							{
								id: 1,
								access_token: 'existing_access_token',
								refresh_token: 'existing_refresh_token',
								expires: new Date(2001, 1, 3, 3, 5, 6),
							},
						]);
					})
			));
		});
	});

	describe('add', () => {
		beforeEach(() => mockDatabase());

		it('adds a new session', () => {
			const data = {
				access_token: 'added_access_token',
				refresh_token: 'added_refresh_token',
				expires: new Date(2001, 1, 1, 1, 1, 1),
			};
			return Session.add(data)
				.then(() => Session.get('added_access_token'))
				.then((results) => {
					expect(results).to.eql([
						{
							id: 2,
							access_token: 'added_access_token',
							refresh_token: 'added_refresh_token',
							expires: new Date(2001, 1, 1, 1, 1, 1),
						},
					]);
				});
		});
	});

	describe('update', () => {
		beforeEach(() => mockDatabase());

		it('updates an existing session', () => {
			const newData = {
				access_token: 'updated_access_token',
				expires: new Date(2001, 1, 1, 1, 1, 1),
			};
			return Session.update('existing_access_token', newData)
				.then(() => Session.get('updated_access_token'))
				.then((results) => {
					expect(results).to.eql([
						{
							id: 1,
							access_token: 'updated_access_token',
							refresh_token: 'existing_refresh_token',
							expires: new Date(2001, 1, 1, 1, 1, 1),
						},
					]);
				});
		});
	});

	describe('delete', () => {
		beforeEach(() => mockDatabase());

		it('deletes an existing session', () => (
			Session.delete('existing_access_token')
				.then(() => Session.get('existing_access_token'))
				.then((results) => {
					expect(results).to.eql([]);
				})
		));
	});
});
