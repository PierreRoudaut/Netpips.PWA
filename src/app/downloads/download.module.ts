import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DownloadService } from './download.service';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DownloadCardComponent } from './download-card/download-card.component';
import { DownloadCardsListComponent } from './download-cards-list/download-cards-list.component';
import { DownloadDialogComponent } from './download-dialog/download-dialog.component';
import { DownloadPageComponent } from './download-page/download-page.component';
import { SearchCardComponent } from './search-card/search-card.component';
import { TorrentSearchService } from './torrent-search.service';
import { DevextremeModule } from '../devextreme.module';


@NgModule({
    declarations: [
        DownloadPageComponent,
        DownloadCardsListComponent,
        DownloadCardComponent,
        DownloadDialogComponent,
        SearchCardComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        DevextremeModule,
        FormsModule, ReactiveFormsModule
    ],
    providers: [,
        TorrentSearchService,
        DownloadService
    ],
    entryComponents: [
        DownloadDialogComponent
    ]
})
export class DownloadModule { }
