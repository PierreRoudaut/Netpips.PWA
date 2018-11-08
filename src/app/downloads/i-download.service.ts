import { DownloadItem } from './download-item';
import { APIService } from '../api.service';
import { Observable } from 'rxjs';

export interface IDownloadService extends APIService {
    /**
     * List all downloads
     */
    list(): Observable<DownloadItem[]>;

    /**
     * Remove the download shell folder and .json file
     * @param token the token
     */
    archive(token: string): Observable<boolean>;

    /**
     * Make a request to cancel a download an return the status of the download
     * @param token
     */
    cancel(token: string): Observable<DownloadItem>;

    /**
     * Fetches the progress of the download
     * @param token
     */
    get(token: string): Observable<DownloadItem>;

    /**
     * Starts the download of a magnet/torrent/uptobox url
     * @param fileUrl
     */
    start(fileUrl: string): Observable<DownloadItem>;
}


