import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import * as _ from 'lodash-es';

@Injectable()
export class SnackbarService {

    constructor(public matSnackBar: MatSnackBar) { }

    info(text: string) {
        this.matSnackBar.open(text, 'OK', {
            duration: 3000,
            panelClass: 'toast-info'
        });
    }

    warn(text: string) {
        if (!text) {
            text = 'An error occured';
        }
        this.matSnackBar.open(text, 'OK', {
            duration: 3000,
            panelClass: 'toast-warn'
        });
    }

    show(options: SnackbarOptions): void {
        this.matSnackBar.open(options.text, 'OK', {
            duration: options.duration
        });
    }

}

export class SnackbarOptions {

    private readonly defaultDuration = 5 * 1000;

    duration?: number;
    text: string;
    constructor(options: any) {
        this.duration = _.defaultTo(options.duration, this.defaultDuration);
        this.text = _.defaultTo(options.text, 'Default text');
    }
}
