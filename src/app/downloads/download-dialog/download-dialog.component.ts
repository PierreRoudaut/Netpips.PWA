import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, ValidatorFn, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-download-dialog',
    templateUrl: './download-dialog.component.html'
})
export class DownloadDialogComponent implements OnInit {
    public fileUrl = '';
    public form: FormGroup;

    constructor(public dialogRef: MatDialogRef<DownloadDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    ngOnInit(): void {
        this.form = new FormGroup({
            'fileUrl': new FormControl('', [Validators.required, fileUrlDownloadValidator()])
        });
    }

    onOk(): void {
        this.dialogRef.close(this.fileUrl);
    }

    onCancel(): void {
        this.dialogRef.close(null);
    }
}

export function fileUrlDownloadValidator(): ValidatorFn {
    // todo: refactore supported url in environment/API route
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
