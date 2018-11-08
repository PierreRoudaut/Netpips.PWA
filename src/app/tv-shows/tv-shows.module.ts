import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TvShowsPageComponent } from './tv-shows-page/tv-shows-page.component';
import { TvShowService } from './tv-show.service';
import { DevextremeModule } from 'app/devextreme.module';
import { MaterialModule } from 'app/material.module';
import { AddShowComponent } from './add-show/add-show.component';
import { MyShowsComponent } from './my-shows/my-shows.component';
import { TvShowDetailComponent } from './tv-show-detail/tv-show-detail.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TvShowsPageComponent,
    AddShowComponent,
    MyShowsComponent,
    TvShowDetailComponent
  ],
  imports: [
    CommonModule,
    DevextremeModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    TvShowService
  ]
})
export class TvShowsModule { }
