import { isUrl } from './url';

describe('isUrl', () => {
  it('accepts http, https and ftp urls', () => {
    expect(isUrl('http://example.com')).toBe(true);
    expect(isUrl('https://example.com/path/file.torrent?x=1')).toBe(true);
    expect(isUrl('ftp://files.example.com/a.mkv')).toBe(true);
  });

  it('trims surrounding whitespace', () => {
    expect(isUrl('  https://example.com  ')).toBe(true);
  });

  it('rejects magnet links, plain text and other schemes', () => {
    expect(isUrl('magnet:?xt=urn:btih:abc')).toBe(false);
    expect(isUrl('not a url')).toBe(false);
    expect(isUrl('javascript:alert(1)')).toBe(false);
    expect(isUrl('')).toBe(false);
  });

  it('rejects non-string values', () => {
    expect(isUrl(null)).toBe(false);
    expect(isUrl(undefined)).toBe(false);
    expect(isUrl(42 as any)).toBe(false);
  });
});
