import { browser, element, by } from 'protractor';

export class MyAppPage {
    navigateTo() {
        console.log(browser);
    }

    getParagraphText() {
        console.log(by);
        console.log(element);
    }
}
