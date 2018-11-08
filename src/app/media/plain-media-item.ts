import * as _ from 'lodash-es';

export enum MediaItemType {
    Video = 'Video',
    Subtitle = 'Subtitle',
    Music = 'Music',
    Other = 'Other',
    Folder = 'Folder'
  }
  export class PlainMediaItem {
    path: string;
    parent?: string;
    size?: number;

    constructor(obj: any) {
      this.path = obj.path;
      if (obj.parent) {
        this.parent = obj.parent;
      }
      if (obj.size) {
        this.size = obj.size;
      }
    }

    get name() {
      return _.last(this.path.split('/'));
    }
    get type(): MediaItemType {
      if (this.size == null) return MediaItemType.Folder;
      if (this.name.indexOf('.') === -1) return MediaItemType.Other;
      const ext = this.path.split('.').pop().toLowerCase();
      switch (ext) {
        case 'avi':
        case 'mkv':
        case 'mp4':
          return MediaItemType.Video;
        case 'mp3':
          return MediaItemType.Music;
        case 'srt':
          return MediaItemType.Subtitle;
        default:
          return MediaItemType.Other;
      }
    }
  }
