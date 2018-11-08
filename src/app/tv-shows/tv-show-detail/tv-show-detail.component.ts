import { Component, Input, OnChanges, SimpleChange, Output, EventEmitter } from '@angular/core';
import { TvShowService, TvShowRss } from '../tv-show.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-tv-show-detail',
  templateUrl: './tv-show-detail.component.html',
  styleUrls: ['./tv-show-detail.component.scss']
})
export class TvShowDetailComponent implements OnChanges {

  @Input() show: TvShowRss;

  @Input() params: TvShowDetailParams;

  @Output() actionFn = new EventEmitter<TvShowRss>();

  loadingPanelVisible = false;

  constructor(private tvShowService: TvShowService) { }


  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    this.loadingPanelVisible = true;
    this.tvShowService
      .getTvMazeDetail(this.show.showRssId)
      .pipe(finalize(() => { this.loadingPanelVisible = false; }))
      .subscribe(d => this.show.detail = d);
  }

}

export interface TvShowDetailParams {
  buttonCaption: 'Add' | 'Remove';
  buttonColor: 'warn' | 'accent' | 'primary';
  panelInitiallyExpanded: boolean;
}
