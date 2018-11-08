
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MediaService } from '../media.service';
import { MediaLibrary } from '../media-library';

@Component({
    selector: 'app-media-page',
    templateUrl: './media-page.component.html',
    styleUrls: ['./media-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MediaPageComponent implements OnInit {

    library: MediaLibrary = new MediaLibrary([]);

    ngOnInit(): void {
        this.mediaService
            .mediaLibrairyPlain()
            .subscribe(items => {
                this.library = new MediaLibrary(items);
            });
    }
    constructor(private mediaService: MediaService) {
    }
}
