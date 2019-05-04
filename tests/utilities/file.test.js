import chai from 'chai';
import { csv, json } from '../../utilities/file';

const expect = chai.expect;
const data = {
  body: {
    tracks: {
      items: [
        {
          track: {
            id: '7uEcCGtM1FBBGIhPozhJjv',
            name: 'Daydream Believer',
            artists: [
              {
                name: 'The Monkees',
              },
            ],
            album: {
              name: 'The Birds, The Bees, & The Monkees',
              release_date: '1968-04-22',
            },
          },
        },
        {
          track: {
            id: '6fnpXCoMEMRIOB6fKuyuI7',
            name: 'That Was Then, This Is Now',
            artists: [
              {
                name: 'Micky Dolenz',
              },
              {
                name: 'Peter Tork',
              },
            ],
            album: {
              name: 'Then & Now ... The Best Of The Monkees',
              release_date: '1986',
            },
          },
        },
        {
          track: {
            id: '2v9IXyfpKGhPgES1911332',
            name: 'If I Learned To Play The Violin',
            artists: [
              {
                name: 'The Monkees',
              },
            ],
            album: {
              name: '',
              release_date: null,
            },
          },
        },
      ],
    },
  },
};

describe('csv', () => {
  it('converts to CSV', () => {
    const expected = [
      'ID,Name,Artist,Album,Year',
      '"7uEcCGtM1FBBGIhPozhJjv","Daydream Believer","The Monkees","The Birds, The Bees, & The Monkees","1968"',
      '"6fnpXCoMEMRIOB6fKuyuI7","That Was Then, This Is Now","Micky Dolenz, Peter Tork","Then & Now ... The Best Of The Monkees","1986"',
      '"2v9IXyfpKGhPgES1911332","If I Learned To Play The Violin","The Monkees",,',
    ];
    expect(csv(data)).to.eql(expected.join('\n'));
  });
});

describe('json', () => {
  it('converts to JSON', () => {
    const expected = [
      {
        id: '7uEcCGtM1FBBGIhPozhJjv',
        name: 'Daydream Believer',
        artist: 'The Monkees',
        album: 'The Birds, The Bees, & The Monkees',
        year: '1968',
      },
      {
        id: '6fnpXCoMEMRIOB6fKuyuI7',
        name: 'That Was Then, This Is Now',
        artist: 'Micky Dolenz, Peter Tork',
        album: 'Then & Now ... The Best Of The Monkees',
        year: '1986',
      },
      {
        id: '2v9IXyfpKGhPgES1911332',
        name: 'If I Learned To Play The Violin',
        artist: 'The Monkees',
        album: '',
        year: '',
      },
    ];
    expect(json(data)).to.eql(JSON.stringify(expected, null, 2));
  });
});
