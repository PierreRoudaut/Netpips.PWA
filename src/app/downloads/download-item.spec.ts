import { DownloadItem, DownloadState } from './download-item';

describe('DownloadItem', () => {
  const base = { name: 'n', totalSize: '2048', type: 'P2P', token: 't', fileUrl: 'u', startedAt: '2020-01-01T00:00:00Z', owner: { email: 'e' } };

  it('parses a downloading item', () => {
    const item = new DownloadItem({ ...base, state: DownloadState.Downloading, downloadedSize: '512' });
    expect(item.totalSize).toBe(2048);
    expect(item.downloadedSize).toBe(512);
    expect(item.startedAt.getUTCFullYear()).toBe(2020);
  });

  it('parses a processing item', () => {
    const item = new DownloadItem({ ...base, state: DownloadState.Processing, downloadedAt: '2020-01-02T00:00:00Z' });
    expect(item.downloadedAt.getUTCDate()).toBe(2);
  });

  it('parses a canceled item', () => {
    const item = new DownloadItem({ ...base, state: DownloadState.Canceled, canceledAt: '2020-01-03T00:00:00Z' });
    expect(item.canceledAt.getUTCDate()).toBe(3);
  });

  it('parses a completed item with its moved files', () => {
    const item = new DownloadItem({
      ...base, state: DownloadState.Completed, completedAt: '2020-01-04T00:00:00Z',
      movedFiles: [{ path: 'a/b.mkv', size: 1 }]
    });
    expect(item.completedAt.getUTCDate()).toBe(4);
    expect(item.movedFiles[0].name).toBe('b.mkv');
  });
});
