exports.seed = knex => (
	knex('sessions')
		.del()
		.then(() => (
			knex('sessions').insert([
				{
					id: 1,
					access_token: 'existing_access_token',
					refresh_token: 'existing_refresh_token',
					expires: '2001-02-03 03:05:06',
				},
			])
		))
);
