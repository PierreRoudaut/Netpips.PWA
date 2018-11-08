import { DownloadItem } from './download-item';
import { APIService } from '../api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injector, Injectable } from '@angular/core';
import { IDownloadService } from './i-download.service';

@Injectable()
export class DownloadService extends APIService implements IDownloadService {

    protected readonly API_URL = this.API_BASE_URL + '/downloadItem';

    constructor(injector: Injector) {
        super(injector);
    }


    /**
     * List all downloads
     */
    list(): Observable<DownloadItem[]> {
        return this.httpClient
            .get<any[]>(this.API_URL)
            .pipe(map(items => items.map(i => new DownloadItem(i))));
    }

    /**
     * Remove the download shell folder and .json file
     * @param token the token
     */
    archive(token: string): Observable<boolean> {
        const body = JSON.stringify(token);

        return this.httpClient.post<boolean>(this.API_URL + '/archive', body);
    }

    /**
     * Make a request to cancel a download an return the status of the download
     * @param token
     */
    cancel(token: string): Observable<DownloadItem> {
        const body = JSON.stringify(token);

        return this.httpClient
            .post<any>(this.API_URL + '/cancel', body)
            .pipe(map(res => new DownloadItem(res)));
    }

    /**
     * Fetches the progress of the download
     * @param token
     */
    get(token: string): Observable<DownloadItem> {
        return this.httpClient
            .get<any>(this.API_URL + '/' + token)
            .pipe(map(res => new DownloadItem(res)));
    }

    /**
     * Starts the download of a magnet/torrent/uptobox url
     * @param fileUrl
     */
    start(fileUrl: string): Observable<DownloadItem> {
        const body = JSON.stringify(fileUrl);

        return this.httpClient
            .post<any>(this.API_URL + '/start', body)
            .pipe(map(res => new DownloadItem(res)));
    }
}


