
export class TorrentSearchItem {
    url: string;
    scrapeUrl: string;
    title: string;
    size: number;
    seeders?: number;
    leechers?: number;

    constructor(obj: any) {
        Object.assign(this, obj);
    }
}
