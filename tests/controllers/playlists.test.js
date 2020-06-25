import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import Playlists from '../../controllers/playlists';
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

describe('Playlists', () => {
	describe('show', () => {
		shared.shouldCheckAccessToken(Playlists.show, { id: 'foo' });

		context('with valid token', () => {
			beforeEach(() => mockSpotify());

			it('returns 200', () => (
				Playlists.show(mockReq, mockRes).then(() => {
					expect(mockRes.status).to.have.been.calledWith(200);
				})
			));

			it('returns response', () => (
				Playlists.show(mockReq, mockRes).then(() => {
					expect(mockRes.send).to.have.been.calledWith(sinon.match({
						success: true,
						data: {
							id: 'aaaaaaaaaaaaaaaaaaaaaa',
							name: 'Songs Covered by The Monkees',
							tracks: [sinon.match.object, sinon.match.object],
						},
					}));
				})
			));
		});
	});

	describe('csv', () => {
		shared.shouldCheckAccessToken(Playlists.csv, { id: 'foo' });

		context('with valid token', () => {
			beforeEach(() => mockSpotify());

			it('sets the filename', () => (
				Playlists.csv(mockReq, mockRes).then(() => {
					expect(mockRes.set).to.have.been.calledWith('Content-Disposition', 'attachment; filename=mendrek-playlist-foo.csv');
				})
			));

			it('returns response', () => (
				Playlists.csv(mockReq, mockRes).then(() => {
					expect(mockRes.send).to.have.been.calledWith([
						'ID,Name,Artist,Album,Year',
						'"4AHU8QRdwCUWxPC53cw4Hh","Whole Wide World","Wreckless Eric","Wreckless Eric","1978"',
						'"676Na0pPcHstYSMaJyarg7","I\'m Not Your Stepping Stone","Paul Revere & The Raiders","Greatest Hits","1967"',
					].join('\n'));
				})
			));
		});
	});

	describe('json', () => {
		shared.shouldCheckAccessToken(Playlists.json, { id: 'foo' });

		context('with valid token', () => {
			beforeEach(() => mockSpotify());

			it('sets the filename', () => (
				Playlists.json(mockReq, mockRes).then(() => {
					expect(mockRes.set).to.have.been.calledWith('Content-Disposition', 'attachment; filename=mendrek-playlist-foo.json');
				})
			));

			it('returns response', () => (
				Playlists.json(mockReq, mockRes).then(() => {
					expect(mockRes.send).to.have.been.calledWith(JSON.stringify([
						{
							id: '4AHU8QRdwCUWxPC53cw4Hh',
							name: 'Whole Wide World',
							artist: 'Wreckless Eric',
							album: 'Wreckless Eric',
							year: '1978',
						},
						{
							id: '676Na0pPcHstYSMaJyarg7',
							name: 'I\'m Not Your Stepping Stone',
							artist: 'Paul Revere & The Raiders',
							album: 'Greatest Hits',
							year: '1967',
						},
					], null, 2));
				})
			));
		});
	});
});
