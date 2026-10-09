import { MediaLibrary } from './media-library';
import { PlainMediaItem } from './plain-media-item';

describe('MediaLibrary', () => {
  let library: MediaLibrary;
  let show: PlainMediaItem;
  let episode: PlainMediaItem;

  beforeEach(() => {
    show = new PlainMediaItem({ path: 'show' });
    episode = new PlainMediaItem({ path: 'show/s01e01.mkv', parent: 'show', size: 1000 });
    library = new MediaLibrary([
      show,
      new PlainMediaItem({ path: 'show/season', parent: 'show' }),
      episode,
      new PlainMediaItem({ path: 'show/s01e01.en.srt', parent: 'show', size: 24 }),
      new PlainMediaItem({ path: 'other', size: 5 })
    ]);
  });

  it('lists child items without the item itself', () => {
    const children = library.getChildItems(show).map(i => i.path);
    expect(children).toEqual(['show/season', 'show/s01e01.mkv', 'show/s01e01.en.srt']);
  });

  it('computes folder sizes from children and file sizes directly', () => {
    expect(library.computeSize(show)).toBe('1.02 kB');
    expect(library.computeSize('show/s01e01.en.srt')).toBe('24 B');
    expect(library.computeSize(new PlainMediaItem({ path: 'empty' }))).toBe('0 B');
  });

  it('detects existing subtitles', () => {
    expect(library.hasSubtitle(episode, 'en')).toBe(true);
    expect(library.hasSubtitle(episode, 'fr')).toBe(false);
  });

  it('removes an item and its children', () => {
    const removed = library.remove(show);
    expect(removed.length).toBe(4);
    expect(library.items.map(i => i.path)).toEqual(['other']);
  });

  it('renames a folder and re-parents its children', () => {
    library.rename(show, new PlainMediaItem({ path: 'renamed' }));
    expect(show.path).toBe('renamed');
    expect(episode.path).toBe('renamed/s01e01.mkv');
    expect(episode.parent).toBe('renamed');
  });

  it('renames a file without touching other items', () => {
    library.rename(episode, new PlainMediaItem({ path: 'show/new.mkv', size: 1000 }));
    expect(episode.path).toBe('show/new.mkv');
    expect(show.path).toBe('show');
  });
});
