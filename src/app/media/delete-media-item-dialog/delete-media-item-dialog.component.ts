import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PlainMediaItem } from '../plain-media-item';

interface DeleteDialogParam {
  totalSize: string;
  item: PlainMediaItem;
  childItemsCount: number;
}

@Component({
  selector: 'app-delete-media-item-dialog',
  template: `
  <h3 mat-dialog-title>Delete</h3>
  <mat-dialog-content>
   <div>
   <span>{{params.item.name}}</span> ?
    <span class="size">({{params.childItemsCount > 0 ? params.childItemsCount + ' files, ': ''}}{{params.totalSize}})</span>
  </div>
  </mat-dialog-content>
  <mat-dialog-actions align="end">
    <button color="warn" mat-button (click)="dialogRef.close(true)">Delete</button>
    <button mat-button (click)="dialogRef.close(false)">Cancel</button>
  </mat-dialog-actions>`,
  styles: [`
    span.size {
      color: grey;
      font-weight: 300;
    }
  `]
})
export class DeleteMediaItemDialogComponent {

  sizeCaption() {
    if (this.params.childItemsCount === 0) {
      return this.params.totalSize;
    }
    return this.params.childItemsCount + ', ' + this.params.totalSize;
  }

  constructor(public dialogRef: MatDialogRef<DeleteMediaItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public params: DeleteDialogParam) {
  }
}
