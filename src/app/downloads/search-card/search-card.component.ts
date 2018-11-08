import { Component, OnInit, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, finalize, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { TorrentSearchItem } from '../torrent-search-item';
import { TorrentSearchService } from '../torrent-search.service';
import * as filesize from 'filesize';
import { trigger, style, animate, transition, query, stagger } from '@angular/animations';
import { SnackbarService } from '../../helpers/snackbar.service';

@Component({
  selector: 'app-search-card',
  templateUrl: './search-card.component.html',
  styleUrls: ['./search-card.component.scss'],
  animations: [
    trigger('searchItemsAnimation', [
      transition('* => *', [
        query(':leave', [
          stagger(50, [
            animate('0.2s', style({ transform: 'scale(0)', opacity: 0 }))
          ])
        ], { optional: true }),
        query(':enter', [
          style({ transform: 'scale(0.5)', opacity: 0.1 }),
          stagger(50, [
            animate('0.2s', style({ transform: 'scale(1)', opacity: 1 }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class SearchCardComponent implements OnInit {
  searchFormControl = new FormControl();
  subscription: Subscription;
  searchQuery = '';
  inputText = '';
  awaitingSearch = false;
  noResults = false;
  @Output() startDownload = new EventEmitter<string>();
  @ViewChild('search') searchInput: ElementRef;

  // tslint:disable-next-line:max-line-length
  // torrentSearchItems: TorrentSearchItem[] = [{'url': 'magnet:?xt=urn:btih:f1443ed4c1c1cf0f18d03ac39a2c0ad732a0465c&amp;dn=The+Anatomy+Of+Dreams&amp;tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&amp;tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&amp;tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337', 'title': 'The Anatomy Of Dreams', 'size': 569815, 'leechers': 1, 'seeders': 26}, {'url': 'magnet:?xt=urn:btih:f5ea386081f293c11c14c7f17aacd9de9f33c70d&amp;dn=Essentials+Of+Anatomy+%26+Physiology+2nd+Edition+%5B2017%5D+%5BPDF%5D&amp;tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&amp;tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&amp;tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337', 'title': 'Essentials Of Anatomy &amp; Physiology 2nd Edition [2017] [PDF]', 'size': 78685143, 'leechers': 0, 'seeders': 25}, {'url': 'magnet:?xt=urn:btih:5f475d2c20a26fa775f0f97bfb22cc41dac58f0b&amp;dn=Human+Anatomy+And+Physiology+10th+Global+2016+By+Elaine+Marieb&amp;tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&amp;tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&amp;tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337', 'title': 'Human Anatomy And Physiology 10th Global 2016 By Elaine Marieb', 'size': 80069263, 'leechers': 0, 'seeders': 16}, {'url': 'magnet:?xt=urn:btih:3acc54f3f46f58698a19d49434d57bd5a490f90b&amp;dn=Greys+Anatomy+S14E09+(1080p+AMZN+WEB-DL+X265+HEVC+10bit+AAC+5.1+Qman)+%5BUTR%5D&amp;tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&amp;tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&amp;tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337', 'title': 'Greys Anatomy S14E09 (1080p AMZN WEB-DL X265 HEVC 10bit AA..', 'size': 555325849, 'leechers': 3, 'seeders': 1}, {'url': 'magnet:?xt=urn:btih:dfa3683ad9a08e25ca5e3f89dc79017b84a3c048&amp;dn=Greys+Anatomy+S14E10+(1080p+AMZN+WEB-DL+X265+HEVC+10bit+AAC+5.1+Qman)+%5BUTR%5D&amp;tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&amp;tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&amp;tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337', 'title': 'Greys Anatomy S14E10 (1080p AMZN WEB-DL X265 HEVC 10bit AA..', 'size': 557737574, 'leechers': 3, 'seeders': 2}, {'url': 'magnet:?xt=urn:btih:a11f9bccc184b30894cca34dcd59403c517b225a&amp;dn=Greys+Anatomy+S14E11+(1080p+AMZN+WEB-DL+X265+HEVC+10bit+AAC+5.1+Qman)+%5BUTR%5D&amp;tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&amp;tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&amp;tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337', 'title': 'Greys Anatomy S14E11 (1080p AMZN WEB-DL X265 HEVC 10bit AA..', 'size': 691850444, 'leechers': 2, 'seeders': 2}, {'url': 'magnet:?xt=urn:btih:2673928a0433acfe05a9db72381be2010fda4d50&amp;dn=Greys+Anatomy+S14E12+(1080p+AMZN+WEB-DL+X265+HEVC+10bit+AAC+5.1+Qman)+%5BUTR%5D&amp;tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&amp;tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&amp;tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337', 'title': 'Greys Anatomy S14E12 (1080p AMZN WEB-DL X265 HEVC 10bit AA..', 'size': 547251814, 'leechers': 2, 'seeders': 4}, {'url': 'magnet:?xt=urn:btih:feba78be0df251c4ff05ab3290294d7d2c8c508b&amp;dn=Greys+Anatomy+S14E13+(1080p+AMZN+WEB-DL+X265+HEVC+10bit+AAC+5.1+Qman)+%5BUTR%5D&amp;tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&amp;tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&amp;tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337', 'title': 'Greys Anatomy S14E13 (1080p AMZN WEB-DL X265 HEVC 10bit AA..', 'size': 651794841, 'leechers': 3, 'seeders': 1}, {'url': 'magnet:?xt=urn:btih:743a7b3ebedd3772abbb557d547673555234b469&amp;dn=Greys+Anatomy+S14E14+(1080p+AMZN+WEB-DL+X265+HEVC+10bit+AAC+5.1+Qman)+%5BUTR%5D&amp;tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&amp;tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&amp;tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337', 'title': 'Greys Anatomy S14E14 (1080p AMZN WEB-DL X265 HEVC 10bit AA..', 'size': 540855500, 'leechers': 3, 'seeders': 2}, {'url': 'magnet:?xt=urn:btih:1b50ede6c57ebb976eb5aae85af01e16d59ec0c6&amp;dn=Greys+Anatomy+S14E15+(1080p+AMZN+WEB-DL+X265+HEVC+10bit+AAC+5.1+Qman)+%5BUTR%5D&amp;tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&amp;tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&amp;tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337', 'title': 'Greys Anatomy S14E15 (1080p AMZN WEB-DL X265 HEVC 10bit AA..', 'size': 548929536, 'leechers': 3, 'seeders': 4}];

  torrentSearchItems: TorrentSearchItem[] = [];

  constructor(public searchService: TorrentSearchService, private snackbarService: SnackbarService) { }

  filesize = (arg: any) => filesize(arg);

  launchDownload(item: TorrentSearchItem) {
    this.searchQuery = '';
    this.torrentSearchItems = [];
    this.inputText = '';
    if (item.url) {
      this.startDownload.emit(item.url);
    } else if (item.scrapeUrl) {
      this.searchService
        .scrapeTorrentUrl(item.scrapeUrl)
        .subscribe(
          url => this.startDownload.emit(url),
          err => {
            this.snackbarService.warn(err.error);
          });
    }
  }

  clearInput() {
    this.noResults = false;
    this.inputText = '';
    this.searchQuery = '';
    this.torrentSearchItems = [];
    this.searchInput.nativeElement.focus();
  }

  ngOnInit() {
    this.subscription = this.searchFormControl
      .valueChanges
      .pipe(tap((t) => this.inputText = t), debounceTime(800), distinctUntilChanged())
      .subscribe(newValue => {
        this.noResults = false;
        this.searchQuery = newValue;
        this.torrentSearchItems = [];
        if (this.searchQuery.length < 3) return;
        this.awaitingSearch = true;
        this.searchService
          .search(this.searchQuery)
          .pipe(finalize(() => { this.awaitingSearch = false; }))
          .subscribe(items => {
            this.torrentSearchItems = items;
            this.noResults = this.torrentSearchItems.length === 0;
          });
      });
  }
}
