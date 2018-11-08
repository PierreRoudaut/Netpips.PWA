import { NgModule } from '@angular/core';

import { DxTreeViewModule } from 'devextreme-angular/ui/tree-view';
import { DxTreeMapModule } from 'devextreme-angular/ui/tree-map';
import { DxTextBoxModule } from 'devextreme-angular/ui/text-box';
import { DxContextMenuModule } from 'devextreme-angular/ui/context-menu';
import { DxLoadPanelModule } from 'devextreme-angular/ui/load-panel';
import { DxCircularGaugeModule } from 'devextreme-angular/ui/circular-gauge';
import { DxPieChartModule } from 'devextreme-angular/ui/pie-chart';
import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import { DxLookupModule } from 'devextreme-angular/ui/lookup';

@NgModule({
    imports: [
        DxTreeViewModule,
        DxTreeMapModule,
        DxTextBoxModule,
        DxContextMenuModule,
        DxLoadPanelModule,
        DxPieChartModule,
        DxCircularGaugeModule,
        DxDataGridModule,
        DxLookupModule
    ],
    exports: [
        DxTreeViewModule,
        DxTreeMapModule,
        DxTextBoxModule,
        DxContextMenuModule,
        DxLoadPanelModule,
        DxPieChartModule,
        DxCircularGaugeModule,
        DxDataGridModule,
        DxLookupModule
    ]
})
export class DevextremeModule { }
