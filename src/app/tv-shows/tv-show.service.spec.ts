import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TvMazeEpisode, TvMazeShowDetail, TvShowRss, TvShowService } from './tv-show.service';

describe('TvMazeEpisode', () => {
  it('formats the full name with padded season and episode', () => {
    const episode = new TvMazeEpisode({ season: 1, number: 2, name: 'Pilot' });
    expect(episode.fullName).toBe('S01 E02 - Pilot');
  });

  it('computes the duration until the airstamp', () => {
    const airstamp = new Date(Date.now() + 2 * 3600 * 1000).toISOString();
    const hours = new TvMazeEpisode({ airstamp }).durationFromNow.asHours();
    expect(hours).toBeGreaterThan(1.9);
    expect(hours).toBeLessThanOrEqual(2);
  });
});

describe('TvMazeShowDetail', () => {
  const dto = { name: 'Show', image: { medium: 'img' }, rating: { average: 8.1 } };

  it('maps image and rating', () => {
    const detail = new TvMazeShowDetail(dto);
    expect(detail.imageUrl).toBe('img');
    expect(detail.rating).toBe(8.1);
    expect(detail.nextEpisode).toBeUndefined();
  });

  it('maps the embedded next episode', () => {
    const detail = new TvMazeShowDetail({ ...dto, _embedded: { nextepisode: { season: 3, number: 4, name: 'X' } } });
    expect(detail.nextEpisode.fullName).toBe('S03 E04 - X');
  });
});

describe('TvShowService', () => {
  let service: TvShowService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TvShowService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(TvShowService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('lists subscribed shows', () => {
    let result: TvShowRss[];
    service.getSubscribedShows().subscribe(r => result = r);
    const req = http.expectOne(r => r.url.endsWith('/api/tvShow/subscribedShows'));
    expect(req.request.method).toBe('GET');
    req.flush([{ showTitle: 'A', showRssId: 1 }]);
    expect(result[0] instanceof TvShowRss).toBe(true);
    expect(result[0].showTitle).toBe('A');
  });
  it('lists all shows', () => {
    service.getAllShows().subscribe();
    http.expectOne(r => r.url.endsWith('/api/tvShow/allShows')).flush([]);
  });

  it('fetches the tv maze detail', () => {
    let detail: TvMazeShowDetail;
    service.getTvMazeDetail(7).subscribe(d => detail = d);
    http.expectOne(r => r.url.endsWith('/api/tvShow/7'))
      .flush({ name: 'S', image: { medium: 'i' }, rating: { average: 1 } });
    expect(detail.imageUrl).toBe('i');
  });

  it('subscribes and unsubscribes', () => {
    service.subscribeToShow(3).subscribe();
    const sub = http.expectOne(r => r.url.endsWith('/api/tvShow/subscribe/3'));
    expect(sub.request.method).toBe('POST');
    sub.flush('ok');
    service.unsubscribe(3).subscribe();
    http.expectOne(r => r.url.endsWith('/api/tvShow/unsubscribe/3')).flush('ok');
  });
});
