import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TvShowRss } from '../tv-show.service';
import { TvShowDetailParams } from 'app/tv-shows/tv-show-detail/tv-show-detail.component';

@Component({
  selector: 'app-my-shows',
  templateUrl: './my-shows.component.html',
  styleUrls: ['./my-shows.component.scss']
})
export class MyShowsComponent implements OnInit {

  @Input() subscribedShows: TvShowRss[];

  @Output() removeShow = new EventEmitter<TvShowRss>();

  params: TvShowDetailParams = {
    buttonCaption: 'Remove',
    buttonColor: 'warn',
    panelInitiallyExpanded: false
  };

  constructor() { }

  ngOnInit() {
  }

  onRemoveShowClicked(show: TvShowRss) {
    this.removeShow.emit(show);
  }

}
