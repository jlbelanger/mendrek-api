import chai from 'chai';
import crypto from 'crypto';
import dotenv from 'dotenv';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import Authenticate from '../../controllers/authenticate';
import { mockDatabase, mockSpotify } from '../helper';

chai.use(sinonChai);
dotenv.config();

const expect = chai.expect;
const mockReq = {
	header: () => null,
	query: {
		token: null,
	},
	cookies: {},
};
const mockRes = {
	cookie: sinon.spy(),
	redirect: sinon.spy(),
	send: sinon.spy(),
	status: sinon.spy(),
};
sinon.stub(crypto, 'randomBytes').returns('12345678901234567890');

describe('Authenticate', () => {
	describe('index', () => {
		beforeEach(() => mockSpotify());

		it('sets the state cookie', () => {
			Authenticate.index(mockReq, mockRes);
			expect(mockRes.cookie).to.have.been.calledWith('state', '12345678901234567890');
		});

		it('redirects to Spotify', () => {
			Authenticate.index(mockReq, mockRes);
			const redirectUri = `${process.env.MENDREK_API_DOMAIN}${process.env.MENDREK_API_PATH}authenticate/callback`;
			const cont = `https://accounts.spotify.com/authorize?client_id=${process.env.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${redirectUri}&scope=playlist-read-private&state=12345678901234567890`;
			expect(mockRes.redirect).to.have.been.calledWith(cont);
		});
	});

	describe('callback', () => {
		beforeEach(() => {
			mockSpotify();
			return mockDatabase();
		});

		context('with no state param', () => {
			beforeEach(() => {
				mockReq.query.state = null;
			});

			it('returns 401', () => (
				Authenticate.callback(mockReq, mockRes).then(() => {
					expect(mockRes.status).to.have.been.calledWith(401);
					expect(mockRes.send).to.have.been.calledWith({
						success: false,
						data: 'Missing state parameter.',
					});
				})
			));
		});

		context('with state param', () => {
			beforeEach(() => {
				mockReq.query.state = 'example_state';
			});

			context('with no code param', () => {
				beforeEach(() => {
					mockReq.query.code = null;
				});

				it('returns 401', () => (
					Authenticate.callback(mockReq, mockRes).then(() => {
						expect(mockRes.status).to.have.been.calledWith(401);
						expect(mockRes.send).to.have.been.calledWith({
							success: false,
							data: 'Missing code parameter.',
						});
					})
				));
			});

			context('with code param', () => {
				beforeEach(() => {
					mockReq.query.code = 'example_code';
				});

				context('with no state cookie', () => {
					beforeEach(() => {
						mockReq.cookies.state = null;
					});

					it('returns 401', () => (
						Authenticate.callback(mockReq, mockRes).then(() => {
							expect(mockRes.status).to.have.been.calledWith(401);
							expect(mockRes.send).to.have.been.calledWith({
								success: false,
								data: 'Missing state cookie.',
							});
						})
					));
				});

				context('with state cookie', () => {
					context('with invalid state cookie', () => {
						beforeEach(() => {
							mockReq.cookies.state = 'invalid';
						});

						it('returns 401', () => (
							Authenticate.callback(mockReq, mockRes).then(() => {
								expect(mockRes.status).to.have.been.calledWith(401);
								expect(mockRes.send).to.have.been.calledWith({
									success: false,
									data: 'Invalid state.',
								});
							})
						));
					});

					context('with valid state cookie', () => {
						beforeEach(() => {
							mockReq.cookies.state = 'example_state';
						});

						context('with invalid code param', () => {
							beforeEach(() => {
								mockReq.query.code = 'invalid';
							});

							it('returns 401', () => (
								Authenticate.callback(mockReq, mockRes).then(() => {
									expect(mockRes.status).to.have.been.calledWith(401);
									expect(mockRes.send).to.have.been.calledWith({
										success: false,
										data: 'Invalid code.',
									});
								})
							));
						});

						context('with valid code param', () => {
							beforeEach(() => {
								mockReq.query.code = 'valid_code';
							});

							it('redirects to the app with the access token', () => (
								Authenticate.callback(mockReq, mockRes).then(() => {
									const redirectUrl = `${process.env.MENDREK_APP_URL}/?token=new_access_token&expires=2001-02-03%2001%3A00%3A00`;
									expect(mockRes.redirect).to.have.been.calledWith(redirectUrl);
								})
							));
						});
					});
				});
			});
		});
	});

	describe('refresh', () => {
		beforeEach(() => mockSpotify());

		context('with no token', () => {
			it('returns 401', () => (
				Authenticate.refresh(mockReq, mockRes).then(() => {
					expect(mockRes.status).to.have.been.calledWith(401);
					expect(mockRes.send).to.have.been.calledWith({
						success: false,
						data: 'No authentication token.',
					});
				})
			));
		});

		context('with token', () => {
			context('with invalid token', () => {
				beforeEach(() => {
					mockReq.header = () => 'invalid';
				});

				it('returns 401', () => (
					Authenticate.refresh(mockReq, mockRes).then(() => {
						expect(mockRes.status).to.have.been.calledWith(401);
						expect(mockRes.send).to.have.been.calledWith({
							success: false,
							data: 'Invalid authentication token.',
						});
					})
				));
			});

			context('with valid token', () => {
				beforeEach(() => {
					mockReq.header = () => 'existing_access_token';
				});

				it('returns 200', () => (
					Authenticate.refresh(mockReq, mockRes).then(() => {
						expect(mockRes.status).to.have.been.calledWith(200);
					})
				));

				it('returns response', () => (
					Authenticate.refresh(mockReq, mockRes).then(() => {
						expect(mockRes.send).to.have.been.calledWith({
							success: true,
							data: {
								access_token: 'new_access_token',
								expires: '2001-02-03 01:00:00',
							},
						});
					})
				));
			});
		});
	});

	describe('logout', () => {
		beforeEach(() => mockDatabase());

		context('with no token', () => {
			beforeEach(() => {
				mockReq.header = () => null;
			});

			it('returns 401', () => (
				Authenticate.logout(mockReq, mockRes).then(() => {
					expect(mockRes.status).to.have.been.calledWith(401);
					expect(mockRes.send).to.have.been.calledWith({
						success: false,
						data: 'No authentication token.',
					});
				})
			));
		});

		context('with token', () => {
			context('with invalid token', () => {
				beforeEach(() => {
					mockReq.header = () => 'invalid';
				});

				it('returns 401', () => (
					Authenticate.logout(mockReq, mockRes).then(() => {
						expect(mockRes.status).to.have.been.calledWith(401);
						expect(mockRes.send).to.have.been.calledWith({
							success: false,
							data: 'Invalid authentication token.',
						});
					})
				));
			});

			context('with valid token', () => {
				beforeEach(() => {
					mockReq.header = () => 'existing_access_token';
				});

				it('returns 200', () => (
					Authenticate.logout(mockReq, mockRes).then(() => {
						expect(mockRes.status).to.have.been.calledWith(200);
					})
				));

				it('returns response', () => (
					Authenticate.logout(mockReq, mockRes).then(() => {
						expect(mockRes.send).to.have.been.calledWith({
							success: true,
							data: 'Logged out.',
						});
					})
				));
			});
		});
	});
});
