import { Component, OnInit, ViewChild } from '@angular/core';
import { MediaService, MediaFolderSummary } from '../media.service';
import { DxPieChartComponent } from 'devextreme-angular/ui/pie-chart';

@Component({
  selector: 'app-media-library-distribution',
  templateUrl: './media-library-distribution.component.html',
  styleUrls: ['./media-library-distribution.component.scss']
})
export class MediaLibraryDistributionComponent implements OnInit {

  groups: MediaFolderSummary[] = [];

  constructor(private mediaService: MediaService) { }

  @ViewChild(DxPieChartComponent) distributionChart: DxPieChartComponent;


  onOptionChanged() {
    this.distributionChart.instance.render();
  }

  ngOnInit() {
    this.mediaService.medialibraryDistribution().subscribe(items => this.groups = items);
  }

  customizeLabel(arg) {
    return arg.point.data.humanizedSize + ' - ' + arg.percentText;
  }

}
