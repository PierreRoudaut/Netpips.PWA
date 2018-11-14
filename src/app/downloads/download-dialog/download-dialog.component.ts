import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, ValidatorFn, FormControl, Validators, AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { DownloadService } from '../download.service';
import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as is from 'is_js';

@Component({
    selector: 'app-download-dialog',
    templateUrl: './download-dialog.component.html',
    styleUrls: ['./download-dialog.component.scss']
})
export class DownloadDialogComponent implements OnInit {
    public form: FormGroup;

    constructor(public dialogRef: MatDialogRef<DownloadDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
        public downloadService: DownloadService) {
    }

    ngOnInit(): void {
        this.form = new FormGroup({
            'url': new FormControl('',
                [Validators.required],
                [this.urlValidatorAsync()]
            )
        });
    }

    urlValidatorAsync(): AsyncValidatorFn {
        return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
            if (!is.url(control.value) && !control.value.startsWith('magnet:?')) {
                return of({
                    'invalidUrl': {
                        'message': 'Invalid URL'
                    }
                });
            }
            return this.downloadService
                .isUrlSupported(control.value)
                .pipe(map(result => {
                    if (result.isSupported) {
                        return null;
                    }
                    return {
                        'notSupported': {
                            'message': result.message
                        }
                    };
                }));
        };
    }

    onOk(): void {
        this.dialogRef.close(this.form.get('url').value);
    }

    onCancel(): void {
        this.dialogRef.close(null);
    }

}

