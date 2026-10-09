import { MediaItemType, PlainMediaItem } from './plain-media-item';

describe('PlainMediaItem', () => {
  const item = (path: string, size?: number) => new PlainMediaItem({ path, size });

  it('exposes the file name', () => {
    expect(item('shows/foo/bar.mkv', 1).name).toBe('bar.mkv');
  });

  it('leaves parent and size undefined when not provided', () => {
    const i = new PlainMediaItem({ path: 'a' });
    expect(i.parent).toBeUndefined();
    expect(i.size).toBeUndefined();
  });

  it('detects folders (no size)', () => {
    expect(item('shows').type).toBe(MediaItemType.Folder);
  });

  it('detects media types from the extension', () => {
    expect(item('a.MKV', 1).type).toBe(MediaItemType.Video);
    expect(item('a.avi', 1).type).toBe(MediaItemType.Video);
    expect(item('a.mp4', 1).type).toBe(MediaItemType.Video);
    expect(item('a.mp3', 1).type).toBe(MediaItemType.Music);
    expect(item('a.en.srt', 1).type).toBe(MediaItemType.Subtitle);
    expect(item('a.nfo', 1).type).toBe(MediaItemType.Other);
    expect(item('README', 1).type).toBe(MediaItemType.Other);
  });
});
