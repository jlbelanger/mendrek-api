import Albums from '../../controllers/albums';
import shared from '../shared';

describe('/albums/:id', () => {
  shared.shouldCheckAccessToken(Albums.show, { id: 'foo' });
});
