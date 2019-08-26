
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DownloadItem, DownloadState } from '../download-item';
import { DownloadService } from '../download.service';
import { SnackbarService, SnackbarOptions } from '../../helpers/snackbar.service';

import { finalize } from 'rxjs/operators';

import * as _ from 'lodash-es';

import { trigger, style, animate, transition, query, stagger } from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { MatDialog } from '@angular/material';
import { DownloadDialogComponent } from '../download-dialog/download-dialog.component';

@Component({
    selector: 'app-download-cards-list',
    templateUrl: './download-cards-list.component.html',
    styleUrls: ['./download-cards-list-component.scss'],
    animations: [
        trigger('downloadItemsAnimation', [
            transition('* => *', [
                query(':leave', [
                    stagger(100, [
                        animate('0.2s', style({ transform: 'scale(0)', opacity: 0 }))
                    ])
                ], { optional: true }),
                query(':enter', [
                    style({ transform: 'scale(0.5)', opacity: 0.1 }),
                    stagger(100, [
                        animate('0.2s', style({ transform: 'scale(1)', opacity: 1 }))
                    ])
                ], { optional: true })
            ])
        ])
    ]
})

export class DownloadCardsListComponent implements OnInit, OnDestroy {
    downloads: DownloadItem[] = [];

    pendingRequests: string[] = [];
    awaitingDownloadItems = false;

    private localStorageChangedListener: any;

    constructor(private downloadService: DownloadService,
        private snackbarService: SnackbarService, public downloadDialog: MatDialog) {
        this.localStorageChangedListener = () => this.onLocalStorageChanged();
    }

    fetchDownloads() {
        this.awaitingDownloadItems = true;
        this.downloadService
            .list()
            .pipe(finalize(() => this.awaitingDownloadItems = false))
            .subscribe(downloads => this.downloads = _.orderBy(downloads, 'startedAt', 'desc'));
    }

    refreshAll() {
        this.downloads = [];
        this.fetchDownloads();
    }

    ngOnInit() {
        this.onLocalStorageChanged();
        window.addEventListener('storage', () => this.localStorageChangedListener);
        this.fetchDownloads();
    }

    ngOnDestroy() {
        document.removeEventListener('storage', this.localStorageChangedListener);
    }

    openDownloadDialog() {
        const dialogRef = this.downloadDialog.open(DownloadDialogComponent, {
            width: '400px'
        });
        dialogRef.afterClosed().subscribe(url => this.startDownload(url));
    }

    private onLocalStorageChanged() {
        const strUrls = localStorage.getItem('urls');
        if (strUrls == null) return;
        try {
            const urls: string[] = JSON.parse(strUrls);
            localStorage.setItem('urls', '[]');
            urls.forEach(url => {
                this.startDownload(url);
            });
        } catch (e) {
            console.warn(e);
        }
    }

    /**
     * Removes a download from the list
     * @param token the token
     */
    public removeDownload = (token: string): void =>
        _.remove(this.downloads, e => e.token === token)

    private downloadActionErrorHandler(res: HttpErrorResponse, url: string) {
        switch (res.error) {
            case 'DownloadabilityFailure':
                if (url.startsWith('magnet')) {
                    this.snackbarService.warn('No peers found');
                } else {
                    this.snackbarService.warn('File not found');
                }
                break;
            case 'DuplicateDownload':
                this.snackbarService.info('Cleanup existing download for: ' + url + ' and try again');
                break;
        }
    }

    /**
     * Make
     * @param url the url
     */
    public startDownload(fileUrl: string): void {

        if (fileUrl === undefined || fileUrl === null) return;

        this.pendingRequests.push(fileUrl);
        this.downloadService
            .start(fileUrl)
            .pipe(finalize(() => _.remove(this.pendingRequests, i => i === fileUrl)))
            .subscribe(
                download => this.downloads.unshift(download),
                err => this.downloadActionErrorHandler(err, fileUrl));
    }

    public cleanAll(): void {
        this.downloads.forEach(download => {
            if (download.state === DownloadState.Completed || download.state === DownloadState.Canceled)
                this.downloadService
                    .archive(download.token)
                    .subscribe(
                        () => this.removeDownload(download.token),
                        err => this.downloadActionErrorHandler(err, ''));
        });
    }
}
