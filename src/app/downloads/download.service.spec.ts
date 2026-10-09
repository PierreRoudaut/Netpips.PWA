import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DownloadState } from './download-item';
import { DownloadService, UrlValidationResult } from './download.service';

describe('DownloadService', () => {
  let service: DownloadService;
  let http: HttpTestingController;
  const dto = { name: 'n', totalSize: '10', state: DownloadState.Downloading, downloadedSize: '5', token: 'tok', startedAt: '2020-01-01' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DownloadService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(DownloadService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('lists downloads as DownloadItems', () => {
    let items;
    service.list().subscribe(i => items = i);
    http.expectOne(r => r.method === 'GET' && r.url.endsWith('/api/downloadItem')).flush([dto]);
    expect(items[0].totalSize).toBe(10);
    expect(items[0].downloadedSize).toBe(5);
  });

  it('gets a download by token', () => {
    let item;
    service.get('tok').subscribe(i => item = i);
    http.expectOne(r => r.url.endsWith('/api/downloadItem/tok')).flush(dto);
    expect(item.token).toBe('tok');
  });

  it('starts a download with a json encoded body', () => {
    service.start('magnet:?x').subscribe();
    const req = http.expectOne(r => r.url.endsWith('/api/downloadItem/start'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe('"magnet:?x"');
    req.flush(dto);
  });

  it('cancels and archives a download', () => {
    service.cancel('tok').subscribe();
    http.expectOne(r => r.url.endsWith('/api/downloadItem/cancel')).flush(dto);
    service.archive('tok').subscribe();
    const req = http.expectOne(r => r.url.endsWith('/api/downloadItem/archive'));
    expect(req.request.body).toBe('"tok"');
    req.flush(true);
  });

  it('validates urls', () => {
    let result: UrlValidationResult;
    service.isUrlSupported('http://x').subscribe(r => result = r);
    http.expectOne(r => r.url.endsWith('/api/downloadItem/isUrlSupported')).flush({ isSupported: true, message: 'ok' });
    expect(result.isSupported).toBe(true);
  });
});
