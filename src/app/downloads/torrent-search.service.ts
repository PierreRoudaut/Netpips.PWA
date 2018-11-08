import { APIService } from '../api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injector, Injectable } from '@angular/core';
import { TorrentSearchItem } from './torrent-search-item';

@Injectable()
export class TorrentSearchService extends APIService  {

    protected readonly API_URL = this.API_BASE_URL + '/torrentSearch';

    constructor(injector: Injector) {
        super(injector);
    }
    /**
     * Search for a list of torrents against a query
     * @param token
     */
    search(query: string): Observable<TorrentSearchItem[]> {
        return this.httpClient
            .get<any>(this.API_URL + '/?q=' + query)
            .pipe(map(items => items.map(i => new TorrentSearchItem(i))));
    }

    scrapeTorrentUrl(scrapeUrl: string): Observable<string> {
        const body = JSON.stringify(scrapeUrl);
        return this.httpClient.post<string>(this.API_URL + '/scrapeTorrentUrl', body);
    }
}


