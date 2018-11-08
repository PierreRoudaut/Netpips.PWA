import { PlainMediaItem, MediaItemType } from './plain-media-item';
import * as filesize from 'filesize';
import * as _ from 'lodash-es';

export class MediaLibrary {
    private _items: PlainMediaItem[] = [];

    constructor(mediaItems: PlainMediaItem[]) {
        this._items = mediaItems;
    }

    get items() {
        return this._items;
    }

    getChildItems(item: PlainMediaItem): PlainMediaItem[] {
        return this._items.filter(i => i.path !== item.path
            && i.path.startsWith(item.path));
    }

    computeSize(elt: PlainMediaItem | string) {
        const item = elt instanceof PlainMediaItem ? elt : this._items.find(i => i.path === elt);
        let size = 0;
        if (item.size) {
            size = item.size;
        } else {
            size = _.sumBy(this.getChildItems(item), 'size');
            if (!size) size = 0;
        }
        return filesize(size);
    }

    hasSubtitle(item: PlainMediaItem, lang: string) {
        let basePath = item.path.substring(0, item.path.lastIndexOf('.'));
        basePath += '.' + lang + '.srt';
        return this._items.find(x => x.path === basePath) !== undefined;
    }

    remove(item: PlainMediaItem): PlainMediaItem[] {
        return _.remove(this._items, i => i.path.startsWith(item.path));
    }

    rename(oldItem: PlainMediaItem, newItem: PlainMediaItem) {
        if (newItem.type === MediaItemType.Folder) {
            this._items
                .filter(i => i.parent && i.path !== oldItem.path && i.parent.startsWith(oldItem.path))
                .forEach(i => {
                    i.parent = newItem.path + i.parent.substr(oldItem.path.length);
                    i.path = newItem.path + i.path.substr(oldItem.path.length);
                });
        }
        oldItem.path = newItem.path;
    }

}
