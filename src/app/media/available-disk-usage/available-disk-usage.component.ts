import { Component, OnInit, ViewChild } from '@angular/core';
import { DiskUsageReport, MediaService } from '../media.service';
import { DxCircularGaugeComponent } from 'devextreme-angular/ui/circular-gauge';

@Component({
  selector: 'app-available-disk-usage',
  templateUrl: './available-disk-usage.component.html',
  styleUrls: ['./available-disk-usage.component.scss']
})
export class AvailableDiskUsageComponent implements OnInit {

  report = new DiskUsageReport({ totalSize: 0, availableFreeSpace: 0 });

  @ViewChild(DxCircularGaugeComponent) diskUsageGauge: DxCircularGaugeComponent;


  constructor(private mediaService: MediaService) {
  }

  getPercentage(nb: number, total: number) {
    return Math.round((nb / total) * 100);
  }

  onOptionChanged() {
    this.diskUsageGauge.instance.render();
  }

  get okLimit() {
    return Math.round(this.report.totalSize - ((this.report.totalSize / 100) * 38));
  }

  get warningLimit() {
    return Math.round(this.report.totalSize - Math.round(this.report.totalSize / 7));
  }

  get tick() {
    return Math.round(this.report.totalSize / 10);
  }

  ngOnInit() {
    this.mediaService.getDiskUsage().subscribe(report => this.report = report);
  }

}
