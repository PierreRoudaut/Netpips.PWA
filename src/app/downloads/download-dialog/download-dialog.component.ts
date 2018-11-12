import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, ValidatorFn, FormControl, Validators, AbstractControl } from '@angular/forms';
import { DownloadService } from '../download.service';
import { of } from 'rxjs';
import * as is from 'is_js';

@Component({
    selector: 'app-download-dialog',
    templateUrl: './download-dialog.component.html',
    styleUrls: ['./download-dialog.component.scss']
})
export class DownloadDialogComponent implements OnInit {
    public fileUrl = '';
    public form: FormGroup;

    constructor(public dialogRef: MatDialogRef<DownloadDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
        public downloadService: DownloadService) {
    }

    ngOnInit(): void {
        this.form = new FormGroup({
            'fileUrl': new FormControl('', [Validators.required, this.fileUrlValidate.bind(this)])
        });
    }

    onOk(): void {
        this.dialogRef.close(this.fileUrl);
    }

    onCancel(): void {
        this.dialogRef.close(null);
    }

    fileUrlValidate(control: AbstractControl) {
        if (!is.url(control.value) && !control.value.startsWith('magnet:?')) {
            return of({
                'invalidUrl': {
                    'message': 'Invalid URL'
                }
            });
        }
        return this.downloadService
            .isUrlSupported(control.value)
            .subscribe(result => {
                if (result.isSupported) return null;
                return {
                    'notSupported': {
                        'message': result.message
                    }
                };
            }, err => {
                return {
                    'notSupported': {
                        'message': 'An error occured'
                    }
                };
            });
    }
}

export function fileUrlDownloadValidator(): ValidatorFn {
    // todo: refactor supported url in environment/API route
    return (control: FormControl): { [key: string]: any } => {
        if (control.value.indexOf('1fichier.com/') !== -1) return null;
        if (control.value.startsWith('magnet:?')) return null;
        if (control.value.indexOf('torrent') !== -1) return null;
        return {
            'invalidUrl':
                { message: '1fichier.com, magnet or torrent url' }
        };
    };
}
