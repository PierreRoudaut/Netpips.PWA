import { Injectable } from '@angular/core';
import { APIService } from '../api.service';
import { Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { PlainMediaItem } from './plain-media-item';

export class MediaFolderSummary {
  name: string;
  size: number;
  humanizedSize: string;
  constructor(obj: any) {
    Object.assign(this, obj);
  }
}

export class DiskUsageReport {
  totalSize: number;
  availableFreeSpace: number;
  constructor(obj: any) {
    Object.assign(this, obj);
  }
}

@Injectable()
export class MediaService extends APIService {

  private readonly API_URL = this.API_BASE_URL + '/media';

  constructor(injector: Injector) {
    super(injector);
  }

  getDiskUsage(): Observable<DiskUsageReport> {
    return this.httpClient
      .get<DiskUsageReport>(this.API_URL + '/diskUsage')
      .pipe(map(report => new DiskUsageReport(report)));
  }

  medialibraryDistribution(): Observable<MediaFolderSummary[]> {
    return this.httpClient
      .get<MediaFolderSummary[]>(this.API_URL + '/libraryDistribution')
      .pipe(
        map(items => items.map(i => new MediaFolderSummary(i))),
    );
  }

  mediaLibrairyPlain = (): Observable<PlainMediaItem[]> =>
    this.httpClient
      .get<PlainMediaItem[]>(this.API_URL + '/libraryPlain')
      .pipe(
        map(items => items.map(f => new PlainMediaItem(f)))
      )

  delete(item: PlainMediaItem): Observable<boolean> {
    const body = JSON.stringify(item.path);

    return this.httpClient.post<boolean>(this.API_URL + '/delete', body);
  }

  rename(item: PlainMediaItem, newName: string): Observable<PlainMediaItem> {
    const body = JSON.stringify({
      path: item.path,
      newName: newName
    });

    return this.httpClient
      .post<any>(this.API_URL + '/rename', body)
      .pipe(map(f => new PlainMediaItem(f)));
  }

  autoRename(item: PlainMediaItem): Observable<PlainMediaItem[]> {
    const body = JSON.stringify(item.path);

    return this.httpClient
      .post<PlainMediaItem[]>(this.API_URL + '/autoRename', body)
      .pipe(map(items => items.map(f => new PlainMediaItem(f))));
  }

  getSubtitles(item: PlainMediaItem, lang: string): Observable<PlainMediaItem> {
    const body = JSON.stringify({
      path: item.path,
      lang: lang
    });

    return this.httpClient
      .post<PlainMediaItem>(this.API_URL + '/getSubtitles', body)
      .pipe(map(f => new PlainMediaItem(f)));
  }

  download(item: PlainMediaItem) {
    window.open(this.API_BASE_URL + '/file/' + item.path, '_blank');
  }

  getDownloadLink(item: PlainMediaItem) {
    return this.API_BASE_URL + '/file/' + item.path;
  }

}
