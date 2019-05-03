import knex from 'knex';
import knexConfig from './knexfile';

const environment = process.env.NODE_ENV;

export default knex(knexConfig[environment]);
