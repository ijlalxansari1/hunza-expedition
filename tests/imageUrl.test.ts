import { optimizedImageUrl } from '../src/lib/imageUrl';

describe('optimizedImageUrl', () => {
  it('uses the WebP variant for local JPEG assets', () => {
    expect(optimizedImageUrl('/images/hunza-hero.jpg')).toBe('/images/hunza-hero.webp');
  });

  it('preserves image query strings and fragments', () => {
    expect(optimizedImageUrl('/images/passu-cones.jpg?width=800#hero'))
      .toBe('/images/passu-cones.webp?width=800#hero');
  });

  it('leaves remote and non-JPEG image URLs unchanged', () => {
    expect(optimizedImageUrl('https://images.example.com/landscape.jpg'))
      .toBe('https://images.example.com/landscape.jpg');
    expect(optimizedImageUrl('/images/landscape.png')).toBe('/images/landscape.png');
  });
});
