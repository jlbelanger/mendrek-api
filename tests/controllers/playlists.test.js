import Playlists from '../../controllers/playlists';
import shared from '../shared';

describe('/playlists/:id', () => {
  shared.shouldCheckAccessToken(Playlists.show, { id: 'foo' });
});

describe('/playlists/:id.csv', () => {
  shared.shouldCheckAccessToken(Playlists.csv, { id: 'foo' });
});

describe('/playlists/:id.json', () => {
  shared.shouldCheckAccessToken(Playlists.json, { id: 'foo' });
});
