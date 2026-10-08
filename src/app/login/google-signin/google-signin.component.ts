import { Component, ElementRef, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';

/**
 * Google Sign-In button based on Google Identity Services.
 * Emits the Google ID token (JWT) once the user is signed in.
 */
@Component({
    standalone: false,
    selector: 'app-google-signin',
    template: ''
})
export class GoogleSignInComponent implements OnInit, OnDestroy {

    @Input() clientId: string;
    @Input() width = 240;
    @Input() theme: 'outline' | 'filled_blue' | 'filled_black' = 'outline';
    @Output() googleSignInSuccess = new EventEmitter<string>();

    private timer: any;

    constructor(private host: ElementRef<HTMLElement>, private zone: NgZone) { }

    ngOnInit() {
        // the GSI client script is loaded asynchronously from index.html
        const init = () => {
            if (typeof google === 'undefined' || !google.accounts || !google.accounts.id) {
                this.timer = setTimeout(init, 100);
                return;
            }
            google.accounts.id.initialize({
                client_id: this.clientId,
                callback: (response) => this.zone.run(() => this.googleSignInSuccess.emit(response.credential))
            });
            google.accounts.id.renderButton(this.host.nativeElement, {
                theme: this.theme,
                type: 'standard',
                size: 'large',
                text: 'signin_with',
                width: this.width
            });
        };
        this.zone.runOutsideAngular(init);
    }

    ngOnDestroy() {
        clearTimeout(this.timer);
    }
}
