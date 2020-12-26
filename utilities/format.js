export function formatAlbum(album, includeTracks) {
	const output = {
		id: album.id,
		name: album.name,
		release_date: album.release_date,
	};
	if (includeTracks) {
		output.tracks = formatTracks(album, album.tracks); // eslint-disable-line no-use-before-define
	}
	return output;
}

export function formatArtist(artist, albums) {
	const output = {
		id: artist.id,
		name: artist.name,
		tracks: [],
	};
	albums.forEach((album) => {
		album.body.albums.forEach((a) => {
			// eslint-disable-next-line no-use-before-define
			output.tracks = output.tracks.concat(formatTracks(a, a.tracks));
		});
	});
	return output;
}

export function formatPlaylist(playlist) {
	return {
		id: playlist.id,
		name: playlist.name,
		tracks: formatTracks(null, playlist.tracks), // eslint-disable-line no-use-before-define
	};
}

export function formatPlaylists(playlists) {
	return playlists.items.map((playlist) => (
		{
			id: playlist.id,
			name: playlist.name,
		}
	));
}

export function formatTracks(album, tracks) {
	return tracks.items.map((t) => {
		let track = t;
		if (t.track) {
			track = t.track;
		}
		const output = {
			id: track.id,
			name: track.name,
			artists: track.artists.map((trackArtist) => (
				{
					id: trackArtist.id,
					name: trackArtist.name,
				}
			)),
		};
		if (album) {
			output.album = formatAlbum(album, false);
		} else if (track.album) {
			output.album = formatAlbum(track.album, false);
		}
		return output;
	});
}

export function formatUser(user) {
	return {
		id: user.id,
	};
}
