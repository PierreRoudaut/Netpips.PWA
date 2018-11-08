import { PlainMediaItem } from '../media/plain-media-item';

export enum DownloadState {
    Downloading = 'Downloading',
    Canceled = 'Canceled',
    Completed = 'Completed',
    Processing = 'Processing'
}

export enum DownloadType {
    P2P = 'P2P',
    DDL = 'DDL'
}

export class OwnerProfile {
    givenName: string;
    familyName: string;
    email: string;
    picture: string;
}

export class DownloadItem {
    name: string;
    totalSize: number;
    type: DownloadType;
    downloadedSize?: number;
    state: DownloadState;
    token: string;
    fileUrl: string;
    startedAt: Date;
    downloadedAt: Date;
    completedAt?: Date;
    canceledAt?: Date;
    movedFiles?: PlainMediaItem[];
    owner: OwnerProfile;
    constructor(obj: any) {
        this.name = obj.name;
        this.totalSize = parseInt(obj.totalSize);
        this.type = obj.type;
        this.state = obj.state;
        this.token = obj.token;
        this.fileUrl = obj.fileUrl;
        this.startedAt = new Date(obj.startedAt);
        this.owner = obj.owner;

        switch (this.state) {
            case DownloadState.Downloading:
                this.downloadedSize = parseInt(obj.downloadedSize);
                break;
            case DownloadState.Processing:
                this.downloadedAt = new Date(obj.downloadedAt);
                break;
            case DownloadState.Canceled:
                this.canceledAt = new Date(obj.canceledAt);
                break;
            case DownloadState.Completed:
                this.completedAt = new Date(obj.completedAt);
                this.movedFiles = obj.movedFiles.map(e => new PlainMediaItem(e));
                break;
        }
    }
}
