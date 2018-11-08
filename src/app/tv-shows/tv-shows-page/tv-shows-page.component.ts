import { Component, OnInit } from '@angular/core';
import { TvShowService, TvShowRss } from '../tv-show.service';
import { SnackbarService } from 'app/helpers/snackbar.service';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-my-shows-page',
  templateUrl: './tv-shows-page.component.html',
  styleUrls: ['./tv-shows-page.component.scss']
})
export class TvShowsPageComponent implements OnInit {

  _subscribedShows: TvShowRss[] = [];
  _allShows: TvShowRss[] = [];

  get subscribableShows(): TvShowRss[] {
    const diff = _.differenceBy(this._allShows, this._subscribedShows, 'showRssId');
    return _.sortBy(diff, ['title']);
  }

  get subscribedShows(): TvShowRss[] {
    return _.sortBy(this._subscribedShows, ['title']);
  }

  constructor(public service: TvShowService, public snackbar: SnackbarService) { }

  ngOnInit() {
    this.service.getAllShows().subscribe(shows => this._allShows = shows);
    this.service.getSubscribedShows().subscribe(shows => this._subscribedShows = shows);
  }

  subscribe(show: TvShowRss) {
    this.service
      .subscribeToShow(show.showRssId)
      .subscribe(
        res => {
          this._subscribedShows.push(show);
          this.snackbar.info(`${show.showTitle} added`);
        }, err => {
          this.snackbar.warn(err.error);
        });
  }

  unsubscribe(show: TvShowRss) {
    this.service
      .unsubscribe(show.showRssId)
      .subscribe(
        res => {
          _.remove(this._subscribedShows, s => s.showRssId === show.showRssId);
          this.snackbar.info(`${show.showTitle} removed`);
        }, err => {
          this.snackbar.warn(err.error);
        });
  }

}
