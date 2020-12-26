/**
 * Formats a list of tracks in CSV format.
 * @param {object} data
 * @returns {string}
 */
export function csv(data) {
	let output = data.body.tracks.items;
	output = output.map((item) => (
		[
			item.track.id,
			item.track.name,
			item.track.artists.map((artist) => artist.name).join(', '),
			item.track.album.name,
			item.track.album.release_date ? item.track.album.release_date.slice(0, 4) : null,
		]
			.map((i) => (i ? `"${i.replace('"', '\\"')}"` : ''))
			.join(',')
	));
	output.unshift('ID,Name,Artist,Album,Year');
	return output.join('\n');
}

/**
 * Formats a list of tracks in JSON format.
 * @param {object} data
 * @returns {string}
 */
export function json(data) {
	const output = data.body.tracks.items.map((item) => (
		{
			id: item.track.id,
			name: item.track.name,
			artist: item.track.artists.map((artist) => artist.name).join(', '),
			album: item.track.album.name,
			year: item.track.album.release_date ? item.track.album.release_date.slice(0, 4) : '',
		}
	));
	return JSON.stringify(output, null, 2);
}
