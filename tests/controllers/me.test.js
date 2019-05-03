import Me from '../../controllers/me';
import shared from '../shared';

describe('/me', () => {
  shared.shouldCheckAccessToken(Me.index);
});

describe('/me/playlists', () => {
  shared.shouldCheckAccessToken(Me.playlists);
});
