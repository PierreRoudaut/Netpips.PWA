import { Injectable } from '@angular/core';
import { APIService } from '../api.service';
import { Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import * as _ from 'lodash-es';
import * as moment from 'moment';


export class TvShowRss {
  detail: TvMazeShowDetail = null;
  showTitle: string;
  showRssId: number;
  constructor(obj: any) {
    Object.assign(this, obj);
  }
}

export class TvMazeEpisode {

  airstamp: string;
  summary: string;
  name: string;
  number: number;
  season: number;

  get durationFromNow(): moment.Duration {
    return moment.duration(moment(this.airstamp).diff(new Date()));
  }

  get fullName(): string {
    let str = `S${this.season.toString().padStart(2, '0')}`;
    str += ` E${this.number.toString().padStart(2, '0')}`;
    str += ` - ${this.name}`;
    return str;
  }

  constructor(obj: any) {
    Object.assign(this, obj);
  }
}

export class TvMazeShowDetail {
  name: string;
  id: number;
  rating: number;
  summary: string;
  imageUrl: string;
  genres: string[];
  runtime: number;
  nextEpisode: TvMazeEpisode;

  constructor(obj: any) {
    Object.assign(this, obj);
    this.imageUrl = obj.image.medium;
    this.rating = obj.rating.average;
    const nextEpisode = _.get(obj, '_embedded.nextepisode', null);
    if (nextEpisode != null) {
      this.nextEpisode = new TvMazeEpisode(nextEpisode);
    }
  }
}


@Injectable()
export class TvShowService extends APIService {

  private readonly API_URL = `${this.API_BASE_URL}/tvShow`;

  constructor(injector: Injector) {
    super(injector);
  }

  getSubscribedShows(): Observable<TvShowRss[]> {
    return this.httpClient
      .get<TvShowRss[]>(`${this.API_URL}/subscribedShows`)
      .pipe(map(shows => shows.map(s => new TvShowRss(s))));
  }

  getAllShows(): Observable<TvShowRss[]> {
    return this.httpClient
      .get<TvShowRss[]>(`${this.API_URL}/allShows`)
      .pipe(map(shows => shows.map(s => new TvShowRss(s))));
  }

  getTvMazeDetail(showRssId: number): Observable<TvMazeShowDetail> {
    return this.httpClient
      .get<TvMazeShowDetail>(`${this.API_URL}/${showRssId}`)
      .pipe(map(data => new TvMazeShowDetail(data)));
  }

  subscribeToShow(showRssId: number): Observable<string> {
    return this.httpClient.post<string>(`${this.API_URL}/subscribe/${showRssId}`, null);
  }

  unsubscribe(showRssId: number): Observable<string> {
    return this.httpClient.post<string>(`${this.API_URL}/unsubscribe/${showRssId}`, null);
  }
}
