exports.up = (knex) => (
	knex.schema.createTable('sessions', (table) => {
		table.increments('id');
		table.string('access_token', 255).notNullable();
		table.string('refresh_token', 255).notNullable();
		table.datetime('expires').notNullable();
	})
);

exports.down = (knex) => (
	knex.schema.dropTable('sessions')
);
