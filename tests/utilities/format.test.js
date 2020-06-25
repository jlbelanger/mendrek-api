import chai from 'chai';
import {
	formatAlbum,
	formatArtist,
	formatPlaylist,
	formatPlaylists,
	formatTracks,
	formatUser,
} from '../../utilities/format';
import artistData from '../data/v1/artists/foo.json';
import albumData from '../data/v1/albums/foo.json';
import albumSearchData from '../data/v1/albums/search.json';
import playlistData from '../data/v1/playlists/foo.json';
import playlistsData from '../data/v1/me/playlists.json';
import userData from '../data/v1/me.json';

const expect = chai.expect;

describe('formatAlbum', () => {
	context('when includeTracks is true', () => {
		it('returns relevant album fields', () => {
			const expected = {
				id: '618fk3ITH2nXQtT0nTTZ84',
				name: 'Good Times!',
				release_date: '2016-05-27',
				tracks: [
					{
						id: '3MGZYMyQQ1bR6Koeydw7nE',
						name: 'Good Times',
						artists: [
							{
								id: '320EPCSEezHt1rtbfwH6Ck',
								name: 'The Monkees',
							},
						],
						album: {
							id: '618fk3ITH2nXQtT0nTTZ84',
							name: 'Good Times!',
							release_date: '2016-05-27',
						},
					},
					{
						id: '5WsTyr4yoElATvkio72fP7',
						name: 'You Bring the Summer',
						artists: [
							{
								id: '320EPCSEezHt1rtbfwH6Ck',
								name: 'The Monkees',
							},
						],
						album: {
							id: '618fk3ITH2nXQtT0nTTZ84',
							name: 'Good Times!',
							release_date: '2016-05-27',
						},
					},
				],
			};
			expect(formatAlbum(albumData, true)).to.eql(expected);
		});
	});

	context('when includeTracks is false', () => {
		it('returns relevant album fields', () => {
			const expected = {
				id: '618fk3ITH2nXQtT0nTTZ84',
				name: 'Good Times!',
				release_date: '2016-05-27',
			};
			expect(formatAlbum(albumData, false)).to.eql(expected);
		});
	});
});

describe('formatArtist', () => {
	it('returns relevant artist fields', () => {
		const expected = {
			id: '320EPCSEezHt1rtbfwH6Ck',
			name: 'The Monkees',
			tracks: [
				{
					id: '3MGZYMyQQ1bR6Koeydw7nE',
					name: 'Good Times',
					artists: [
						{
							id: '320EPCSEezHt1rtbfwH6Ck',
							name: 'The Monkees',
						},
					],
					album: {
						id: '618fk3ITH2nXQtT0nTTZ84',
						name: 'Good Times!',
						release_date: '2016-05-27',
					},
				},
				{
					id: '5WsTyr4yoElATvkio72fP7',
					name: 'You Bring the Summer',
					artists: [
						{
							id: '320EPCSEezHt1rtbfwH6Ck',
							name: 'The Monkees',
						},
					],
					album: {
						id: '618fk3ITH2nXQtT0nTTZ84',
						name: 'Good Times!',
						release_date: '2016-05-27',
					},
				},
			],
		};
		expect(formatArtist(artistData, [{ body: albumSearchData }])).to.eql(expected);
	});
});

describe('formatPlaylist', () => {
	it('returns relevant playlist fields', () => {
		const expected = {
			id: 'aaaaaaaaaaaaaaaaaaaaaa',
			name: 'Songs Covered by The Monkees',
			tracks: [
				{
					id: '4AHU8QRdwCUWxPC53cw4Hh',
					name: 'Whole Wide World',
					artists: [
						{
							id: '46mRV6kvhsGvih0dMKktto',
							name: 'Wreckless Eric',
						},
					],
					album: {
						id: '1i7X9E0WxvC8uI6OcS7HNY',
						name: 'Wreckless Eric',
						release_date: '1978-06-01',
					},
				},
				{
					id: '676Na0pPcHstYSMaJyarg7',
					name: 'I\'m Not Your Stepping Stone',
					artists: [
						{
							id: '32HPpJAhgnGPT3V7UOggzi',
							name: 'Paul Revere & The Raiders',
						},
					],
					album: {
						id: '6y0iDWriJnSH9ABuyKk3AO',
						name: 'Greatest Hits',
						release_date: '1967-04-10',
					},
				},
			],
		};
		expect(formatPlaylist(playlistData)).to.eql(expected);
	});
});

describe('formatPlaylists', () => {
	it('returns relevant playlists fields', () => {
		const expected = [
			{
				id: 'aaaaaaaaaaaaaaaaaaaaaa',
				name: 'Motown',
			},
			{
				id: 'bbbbbbbbbbbbbbbbbbbbbb',
				name: 'Bubblegum',
			},
		];
		expect(formatPlaylists(playlistsData)).to.eql(expected);
	});
});

describe('formatTracks', () => {
	context('when album is null', () => {
		context('when album is specified in track', () => {
			it('returns a list of tracks with album', () => {
				const expected = [
					{
						id: '4AHU8QRdwCUWxPC53cw4Hh',
						name: 'Whole Wide World',
						artists: [
							{
								id: '46mRV6kvhsGvih0dMKktto',
								name: 'Wreckless Eric',
							},
						],
						album: {
							id: '1i7X9E0WxvC8uI6OcS7HNY',
							name: 'Wreckless Eric',
							release_date: '1978-06-01',
						},
					},
					{
						id: '676Na0pPcHstYSMaJyarg7',
						name: 'I\'m Not Your Stepping Stone',
						artists: [
							{
								id: '32HPpJAhgnGPT3V7UOggzi',
								name: 'Paul Revere & The Raiders',
							},
						],
						album: {
							id: '6y0iDWriJnSH9ABuyKk3AO',
							name: 'Greatest Hits',
							release_date: '1967-04-10',
						},
					},
				];
				expect(formatTracks(null, playlistData.tracks)).to.eql(expected);
			});
		});

		context('when album is not specified in track', () => {
			it('returns a list of tracks without album', () => {
				const expected = [
					{
						artists: [
							{
								id: '320EPCSEezHt1rtbfwH6Ck',
								name: 'The Monkees',
							},
						],
						id: '3MGZYMyQQ1bR6Koeydw7nE',
						name: 'Good Times',
					},
					{
						artists: [
							{
								id: '320EPCSEezHt1rtbfwH6Ck',
								name: 'The Monkees',
							},
						],
						id: '5WsTyr4yoElATvkio72fP7',
						name: 'You Bring the Summer',
					},
				];
				expect(formatTracks(null, albumData.tracks)).to.eql(expected);
			});
		});
	});

	context('when album is not null', () => {
		it('returns a list of tracks with album', () => {
			const expected = [
				{
					artists: [
						{
							id: '320EPCSEezHt1rtbfwH6Ck',
							name: 'The Monkees',
						},
					],
					id: '3MGZYMyQQ1bR6Koeydw7nE',
					name: 'Good Times',
					album: {
						id: '618fk3ITH2nXQtT0nTTZ84',
						name: 'Good Times!',
						release_date: '2016-05-27',
					},
				},
				{
					artists: [
						{
							id: '320EPCSEezHt1rtbfwH6Ck',
							name: 'The Monkees',
						},
					],
					id: '5WsTyr4yoElATvkio72fP7',
					name: 'You Bring the Summer',
					album: {
						id: '618fk3ITH2nXQtT0nTTZ84',
						name: 'Good Times!',
						release_date: '2016-05-27',
					},
				},
			];
			expect(formatTracks(albumData, albumData.tracks)).to.eql(expected);
		});
	});
});

describe('formatUser', () => {
	it('returns relevant user fields', () => {
		const expected = {
			id: 'example',
		};
		expect(formatUser(userData)).to.eql(expected);
	});
});
