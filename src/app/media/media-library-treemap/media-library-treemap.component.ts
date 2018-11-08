import { Component, OnInit, Input, AfterViewInit, ViewChild, AfterViewChecked, OnChanges } from '@angular/core';
import { PlainMediaItem } from '../plain-media-item';
import { DxTreeMapComponent } from 'devextreme-angular/ui/tree-map';
import * as filesize from 'filesize';
import { MediaLibrary } from '../media-library';

interface DrillInfo {
  text: string;
  node?: any;
}

@Component({
  selector: 'app-media-library-treemap',
  templateUrl: './media-library-treemap.component.html',
  styleUrls: ['./media-library-treemap.component.scss']
})
export class MediaLibraryTreemapComponent implements OnInit {

  @Input() library: MediaLibrary;

  drillInfos: DrillInfo[] = [];

  hoveredItem: PlainMediaItem = null;

  @ViewChild(DxTreeMapComponent) treeMap: DxTreeMapComponent;

  constructor() { }

  onOptionChanged() {
    this.treeMap.instance.render();
  }

  ngOnInit() {
  }

  nodeClick(e) {
    e.node.drillDown();
  }

  customizeTooltip(arg) {

    const element: PlainMediaItem = arg.node.data;

    function recComputeSize(item, size: number): number {
      if (item.size) {
        size += item.size;
      }
      if (item.items) {
        item.items.forEach(i => {
          size = recComputeSize(i, size);
        });
      }
      return size;
    }

    return {
      html: '<div>' +
        '<span>' + element.name + '</span>' +
        '<span> (' + filesize(recComputeSize(element, 0)) + ')</span>' +
        '</div>'
    };
  }

  drill(e) {
    this.drillInfos = [];
    for (let node = e.node.getParent(); node; node = node.getParent()) {
      this.drillInfos.unshift({
        text: node.label() || 'Library',
        node: node
      });
    }
    if (this.drillInfos.length) {
      this.drillInfos.push({
        text: e.node.label()
      });
    }
  }

  drillInfoClick(node) {
    if (node) {
      node.drillDown();
    }
  }

}
