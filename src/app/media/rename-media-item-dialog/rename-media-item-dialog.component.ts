import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PlainMediaItem } from '../plain-media-item';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';

interface RenameDialogParam {
  item: PlainMediaItem;
  sameDirectoryItems: PlainMediaItem[];
}

@Component({
  selector: 'app-rename-media-item-dialog',
  template: `
  <form [formGroup]="form">
  <h3 mat-dialog-title>Rename</h3>
  <mat-dialog-content>
  <mat-form-field color="accent" style="width:100%">
      <input formControlName="mediaItemName" autocomplete="off" matInput
      [(ngModel)]="mediaItemName" name="mediaItemName" placeholder="Name"
      required>
      <mat-error *ngIf="form.get('mediaItemName').hasError('invalidName')">{{form.get('mediaItemName').getError('invalidName').message}}
      </mat-error>
  </mat-form-field>
</mat-dialog-content>
<mat-dialog-actions align="end">
  <button mat-button mat-dialog-close (click)="dialogRef.close(null)">Cancel</button>
  <button color="accent" [disabled]="form.invalid" (click)="dialogRef.close(mediaItemName)"
  mat-button mat-dialog-close><strong>OK</strong></button>
  </mat-dialog-actions>
  </form>
`,
  styles: [`
    span.size {
      color: grey;
      font-weight: 300;
    }
  `]
})
export class RenameMediaItemDialogComponent implements OnInit {

  public mediaItemName = '';
  public form: FormGroup;


  ngOnInit(): void {
    this.form = new FormGroup({
      'mediaItemName': new FormControl('', [Validators.required, this.mediaItemNameValidator()]),
    });
  }

  mediaItemNameValidator(): ValidatorFn {
    return (control: FormControl): { [key: string]: any } => {

      if (control.value.indexOf('/') !== -1) {
        return {
          'invalidName':
            { message: 'Name cannot contain /' }
        };
      }

      if (this.params.sameDirectoryItems.map(i => i.name).indexOf(control.value.trim()) !== -1) {
        return {
          'invalidName':
            { message: 'A file with the same name already exists in the current folder' }
        };
      }

      return null;
    };
  }

  constructor(public dialogRef: MatDialogRef<RenameMediaItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public params: RenameDialogParam) {
    this.mediaItemName = params.item.name;
  }
}
