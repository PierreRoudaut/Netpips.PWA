import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaService } from './media.service';
import { DevextremeModule } from '../devextreme.module';
import { MediaPageComponent } from './media-page/media-page.component';
import { MediaLibraryTreeviewComponent } from './media-library-treeview/media-library-treeview.component';
import { MaterialModule } from '../material.module';
import { DeleteMediaItemDialogComponent } from './delete-media-item-dialog/delete-media-item-dialog.component';
import { RenameMediaItemDialogComponent } from './rename-media-item-dialog/rename-media-item-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MediaLibraryDistributionComponent } from './media-library-distribution/media-library-distribution.component';
import { AvailableDiskUsageComponent } from './available-disk-usage/available-disk-usage.component';
import { MediaLibraryTreemapComponent } from './media-library-treemap/media-library-treemap.component';

@NgModule({
    declarations: [
        MediaPageComponent,
        MediaLibraryTreeviewComponent,
        DeleteMediaItemDialogComponent,
        RenameMediaItemDialogComponent,
        MediaLibraryDistributionComponent,
        AvailableDiskUsageComponent,
        MediaLibraryTreemapComponent,
    ],
    imports: [
        DevextremeModule,
        MaterialModule,
        CommonModule,
        FormsModule, ReactiveFormsModule
    ],
    providers: [
        MediaService
    ],
    entryComponents: [
        DeleteMediaItemDialogComponent,
        RenameMediaItemDialogComponent
    ]
})
export class MediaModule { }
