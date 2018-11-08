
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { trigger, style, animate, transition, query, stagger, state } from '@angular/animations';
import { DownloadItem, DownloadState, DownloadType } from '../download-item';
import { DownloadService } from '../download.service';
import { NotificationService } from '../../helpers/notification.service';

import * as _ from 'lodash-es';
import * as moment from 'moment';
import * as filesize from 'filesize';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';
import { MediaItemType } from '../../media/plain-media-item';
import { Role } from '../../auth/user';
import { ScaleInOut } from 'app/core/animations';

export class ItemProgress {
    constructor(public date: Date, public size: number) { }
}

@Component({
    selector: 'app-download-card',
    templateUrl: './download-card.component.html',
    styleUrls: ['./download-card.component.scss'],
    animations: [
        trigger('movedFilesListAnimation', [
        ])
    ]
})
export class DownloadCardComponent implements OnInit, OnDestroy {
    private readonly progressIntervalDuration = 1000;
    private intervalId: number = null;
    private isBusy = false;
    private previousProgress: ItemProgress;
    private currentProgress: ItemProgress;
    movedFilesExpanded = false;
    @Input() item: DownloadItem;
    @Output() removeFromList = new EventEmitter<string>();

    constructor(private downloadService: DownloadService, private notificationService: NotificationService,
        private authService: AuthService) {
        this.progress = this.progress.bind(this);
        this.currentProgress = new ItemProgress(new Date(), 0);
        this.previousProgress = null;
    }

    ngOnInit(): void {
        if (this.item.state === DownloadState.Downloading || this.item.state === DownloadState.Processing) {
            this.intervalId = window.setInterval(this.progress, this.progressIntervalDuration);
        }
    }
    ngOnDestroy(): void {
        if (this.intervalId != null) {
            window.clearInterval(this.intervalId);
        }
    }

    canEditDownloadItem() {
        return this.authService.isLoggedIn &&
            (this.authService.user.email === this.item.owner.email || this.authService.user.role === Role.SuperAdmin);
    }

    getFilename = (path: string): string => _.last(path.split('/'));

    formatPath = (path: string): string => path.split('/').join(' / ');

    itemUrl = (): string => (this.item.type === DownloadType.DDL ? this.item.fileUrl : 'magnet / torrent');

    get movedFilesOnly() {
        return this.item.movedFiles.filter(f => f.type !== MediaItemType.Folder);
    }

    get percentageProgress(): number {
        const perc = Math.floor((this.item.downloadedSize / this.item.totalSize) * 100);
        return perc;
    }

    get remainingSeconds(): number {
        const remainingLength = this.item.totalSize - this.item.downloadedSize;
        const remainingSeconds = remainingLength / this.speed;
        return remainingSeconds;
    }

    get humanizedRemainingDuration(): string {
        if (this.remainingSeconds < 60)
            return Math.round(this.remainingSeconds) + ' seconds';
        return moment.duration(this.remainingSeconds, 'seconds').humanize(true);
    }

    get ownerPictureUrl(): string {
        if (this.item.owner.picture) {
            return this.item.owner.picture;
        }
        return '/assets/user-placeholder-picture.jpg';
    }

    /**
     * eg. 23% - 12.23MB/s - in 2 minutes
     * @returns {string}
     */
    get progressLine(): string {
        const progress = this.percentageProgress > 100 ? 100 : this.percentageProgress;
        let line = progress + '% - ';
        line += '(' + filesize(this.item.downloadedSize, { round: 2 }) + ' / ' + filesize(this.item.totalSize, { round: 2 }) + ') - ';
        line += filesize(this.speed, { round: 1 }) + '/s - ';
        line += this.humanizedRemainingDuration;
        return line;
    }

    /**
     * In Bytes per second
     * @returns {number}
     */
    get speed(): number {
        if (this.previousProgress == null)
            return 0;
        const timeDifference = (this.currentProgress.date.valueOf() - this.previousProgress.date.valueOf()) / 1000;
        const sizeDifference = this.currentProgress.size - this.previousProgress.size;
        return sizeDifference / timeDifference;
    }

    progress(): void {
        if (this.isBusy) return;
        this.isBusy = true;
        this.downloadService.get(this.item.token).subscribe(download => {
            this.isBusy = false;
            this.item.state = download.state;
            switch (this.item.state) {
                case DownloadState.Downloading:
                    this.item.downloadedSize = download.downloadedSize;
                    this.previousProgress = this.currentProgress;
                    this.currentProgress = new ItemProgress(new Date(), download.downloadedSize);
                    break;
                case DownloadState.Processing:
                    break;
                case DownloadState.Canceled:
                    window.clearInterval(this.intervalId);
                    this.intervalId = null;
                    break;
                case DownloadState.Completed:
                    this.item.movedFiles = download.movedFiles;
                    window.clearInterval(this.intervalId);
                    this.intervalId = null;
                    this.notifyDownloadCompleted();
                    break;
            }
        }, err => this.handleDownloadActionError(err));
    }

    cancel(): void {
        window.clearInterval(this.intervalId);
        this.intervalId = null;
        this.downloadService.cancel(this.item.token).subscribe(download => {
            this.item.state = download.state;
            this.item.canceledAt = download.canceledAt;
        }, res => this.handleDownloadActionError(res));
    }

    archive = () =>
        this.downloadService
            .archive(this.item.token)
            .subscribe(
                () => this.removeFromList.emit(this.item.token),
                res => this.handleDownloadActionError(res))


    private notifyDownloadCompleted = () =>
        this.notificationService.show('Download Completed', {
            'icon': 'assets/netpips_icon_128.png',
            'body': this.item.movedFiles.length > 1 ? this.item.name : this.item.movedFiles[0].name
        })

    private handleDownloadActionError(res: HttpErrorResponse): void {
        console.warn(res.error);
        if (res.status === 404)
            this.removeFromList.emit(this.item.token);
    }
}
