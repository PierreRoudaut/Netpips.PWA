import { Injectable } from '@angular/core';


@Injectable()
export class NotificationService {

    constructor() {
        Notification.requestPermission();
    }

    show(title: string, options: any): void {
        console.log(title);
        console.log(options);
    }
}
