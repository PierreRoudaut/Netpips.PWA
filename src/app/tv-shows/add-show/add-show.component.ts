import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TvShowRss } from '../tv-show.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { TvShowDetailParams } from 'app/tv-shows/tv-show-detail/tv-show-detail.component';

@Component({
  selector: 'app-add-show',
  templateUrl: './add-show.component.html',
  styleUrls: ['./add-show.component.scss']
})
export class AddShowComponent implements OnInit {

  @Input() subscribableShows: TvShowRss[];

  selectedShow: TvShowRss = null;

  @Output() addShow = new EventEmitter<TvShowRss>();

  inputControl = new FormControl();
  filteredsubscribableShows: Observable<TvShowRss[]>;

  params: TvShowDetailParams = {
    buttonCaption: 'Add',
    buttonColor: 'accent',
    panelInitiallyExpanded: true
  };


  constructor() {
    this.filteredsubscribableShows = this.inputControl.valueChanges
      .pipe(
        startWith(''),
        map(filterValue => filterValue ? this._filterShows(filterValue) : this.subscribableShows.slice())
      );
  }

  private _filterShows(show: string | TvShowRss): TvShowRss[] {
    if (typeof show === 'object') {
      return [];
    }
    const filterValue = show.toLowerCase();
    return this.subscribableShows.filter(s => s.showTitle.toLowerCase().indexOf(filterValue) !== -1);
  }

  displayFn(show: TvShowRss) {
    return show ? show.showTitle : '';
  }

  onAddShowClicked(show: TvShowRss) {
    this.selectedShow = null;
    this.addShow.emit(show);
  }

  onShowSelected(e) {
    this.selectedShow = e.option.value;
  }

  ngOnInit() {
  }

  onSearchClear() {
    this.inputControl.setValue('');
    this.selectedShow = null;
  }

}
