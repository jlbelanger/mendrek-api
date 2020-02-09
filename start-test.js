require('babel-register')({
  presets: ['env'],
});

const sinon = require('sinon'); // eslint-disable-line import/no-extraneous-dependencies
const helper = require('./tests/helper');

let clock;

before(() => {
  clock = sinon.useFakeTimers(Date.UTC(2001, 1, 3));
  return helper.mockDatabase();
});

after(() => {
  clock.restore();
  helper.mockDestroyDatabase();
});
