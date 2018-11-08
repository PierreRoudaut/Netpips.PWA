import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MediaService } from '../media.service';
import { MediaItemType, PlainMediaItem } from '../plain-media-item';
import * as filesize from 'filesize';
import * as _ from 'lodash-es';
import { pluralize } from '../../core/helper';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { DxContextMenuComponent } from 'devextreme-angular/ui/context-menu';
import { DeleteMediaItemDialogComponent } from '../delete-media-item-dialog/delete-media-item-dialog.component';
import { finalize } from 'rxjs/operators';
import { RenameMediaItemDialogComponent } from '../rename-media-item-dialog/rename-media-item-dialog.component';
import { MediaLibrary } from '../media-library';

export interface MediaItemContextMenuAction {
    text: string;
    action?: Function;
    params?: any[];
    items?: MediaItemContextMenuAction[];
}

@Component({
    selector: 'app-media-library-treeview',
    templateUrl: './media-library-treeview.component.html',
    styleUrls: ['./media-library-treeview.component.scss']
})
export class MediaLibraryTreeviewComponent implements OnInit {

    loadingPanelVisible = false;
    dataSource: any[] = [];
    @ViewChild(DxContextMenuComponent) itemMenu: DxContextMenuComponent;
    deleteDialogRef: MatDialogRef<DeleteMediaItemDialogComponent>;
    renameDialogRef: MatDialogRef<RenameMediaItemDialogComponent>;
    @Input() library: MediaLibrary;

    selectedItem = new PlainMediaItem({});
    targetNode: any;
    ngOnInit(): void {
    }
    constructor(private mediaService: MediaService, private dialog: MatDialog, public matSnackBar: MatSnackBar) {
    }

    // todo: prevent right click to open context menu
    // todo: autoRename/getSubtitles/rename should focus on the modified/created item

    itemMenuClick(e: MouseEvent, item: PlainMediaItem) {
        this.selectedItem = item;
        this.dataSource = this.buildMenuActions();
        this.itemMenu.target = <Element>e.target;
        this.itemMenu.instance.show();
    }

    buildMenuActions() {
        const actions = [];

        // download
        if (this.selectedItem.type !== MediaItemType.Folder) {

            actions.push({
                'text': 'Copy link',
                'action': this.copyLink,
                'icon': 'link-variant'
            });

            actions.push({
                'text': 'Download',
                'action': this.download,
                'icon': 'download'
            });
        }

        // rename
        actions.push({
            'text': 'Rename',
            'action': this.rename,
            'icon': 'pencil'
        });

        if (this.selectedItem.type === MediaItemType.Video) {

            // auto rename
            actions.push({
                'text': 'Auto rename',
                'action': this.autoRename,
                'icon': 'auto-fix'
            });

            // subtitles
            actions.push({
                'text': 'Get subtitles',
                'icon': 'comment-text',
                'items': [
                    {
                        'text': 'FR',
                        'action': this.getSubtitles,
                        'params': ['fr'],
                        'disabled': this.library.hasSubtitle(this.selectedItem, 'fr')
                    },
                    {
                        'text': 'EN',
                        'action': this.getSubtitles,
                        'params': ['en'],
                        'disabled': this.library.hasSubtitle(this.selectedItem, 'en')
                    },
                ]
            });
        }

        // delete
        actions.push({
            'text': 'Delete',
            'action': this.delete,
            'icon': 'delete'
        });
        return actions;
    }

    performMenuAction(e: any) {
        const a = <MediaItemContextMenuAction>e.itemData;
        if (a.action) {
            a.action.call(this, ...a.params);
        }
    }

    getFilename = (item: any) => _.last(item.path.split('/'));



    isRootItem = (item: PlainMediaItem) => item.path.split('/').length === 1;

    getSubtitles(lang: string) {
        this.loadingPanelVisible = true;
        this.mediaService
            .getSubtitles(this.selectedItem, lang)
            .pipe(finalize(() => { this.loadingPanelVisible = false; }))
            .subscribe(subtitleItem => {
                this.library.items.splice(_.findIndex(this.library, { 'path': this.selectedItem.path }), 0, subtitleItem);
                // this.itemMenu.instance.selectItem()
                this.matSnackBar.open('Downloaded ' + subtitleItem.name, 'Done', { duration: 3000, panelClass: 'toast-primary' });
            }, errRes => {
                this.matSnackBar.open('No ' + lang + ' subtitles for ' + this.selectedItem.name, 'Done', {
                    duration: 3000, panelClass: 'toast-warn'
                });
            });
    }
    delete() {
        this.deleteDialogRef = this.dialog.open(DeleteMediaItemDialogComponent, {
            data: {
                totalSize: this.library.computeSize(this.selectedItem),
                item: this.selectedItem,
                childItemsCount: this.selectedItem.type !== MediaItemType.Folder ? 0 : this.library.getChildItems(this.selectedItem).length
            }
        });
        this.deleteDialogRef.afterClosed().subscribe(result => {
            this.deleteDialogRef = null;
            if (result) {
                this.loadingPanelVisible = true;
                this.mediaService
                    .delete(this.selectedItem)
                    .pipe(finalize(() => { this.loadingPanelVisible = false; }))
                    .subscribe(() => {
                        const deletedItems = this.library.remove(this.selectedItem);
                        this.matSnackBar.open(pluralize('item', deletedItems.length) + ' deleted', 'Done', {
                            duration: 3000, panelClass: 'toast-primary'
                        });
                    }, () => {
                        this.matSnackBar.open('Failed to delete ' + this.selectedItem.name, 'Done', {
                            duration: 3000, panelClass: 'toast-warn'
                        });
                    });
            }
        });
    }

    copyLink() {
        const downloadLink = this.mediaService.getDownloadLink(this.selectedItem);

        const selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = downloadLink;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
        this.matSnackBar.open('Copied to clipboard', 'Done', { duration: 1000 });
    }

    autoRename() {
        this.loadingPanelVisible = true;
        this.mediaService
            .autoRename(this.selectedItem)
            .pipe(finalize(() => { this.loadingPanelVisible = false; }))
            .subscribe(items => {
                _.remove(this.library, i => i.path === this.selectedItem.path);
                items.forEach(i => this.library.items.push(i));
                this.matSnackBar.open('Renamed: ' + this.getFilename(items.find(f => f.type === MediaItemType.Video)), 'Done',
                    { duration: 3000, panelClass: 'toast-primary' });
            }, () => {
                this.matSnackBar.open('Failed to auto rename', 'Done', {
                    duration: 3000, panelClass: 'toast-warn'
                });
            });
    }
    rename() {
        this.renameDialogRef = this.dialog.open(RenameMediaItemDialogComponent, {
            width: '600px',
            data: {
                item: this.selectedItem,
                sameDirectoryItems: this.library.items
                    .filter(i => i.parent === this.selectedItem.parent && i.path !== this.selectedItem.path)
            }
        });

        this.renameDialogRef.afterClosed().subscribe(result => {
            this.renameDialogRef = null;
            if (result) {
                this.loadingPanelVisible = true;
                this.mediaService
                    .rename(this.selectedItem, result)
                    .pipe(finalize(() => { this.loadingPanelVisible = false; }))
                    .subscribe(renamedItem => {
                        if (renamedItem.type === MediaItemType.Folder) {
                            this.library.items
                                .filter(i => i.parent && i.path !== this.selectedItem.path && i.parent.startsWith(this.selectedItem.path))
                                .forEach(i => {
                                    i.parent = renamedItem.path + i.parent.substr(this.selectedItem.path.length);
                                    i.path = renamedItem.path + i.path.substr(this.selectedItem.path.length);
                                });
                        }
                        this.selectedItem.path = renamedItem.path;
                    }, () => {
                        this.matSnackBar.open('Failed to rename ' + this.selectedItem.name, 'Done',
                            { duration: 3000, panelClass: 'toast-warn' });
                    });
            }
        });

    }

    download() {
        this.mediaService.download(this.selectedItem);
    }
}
