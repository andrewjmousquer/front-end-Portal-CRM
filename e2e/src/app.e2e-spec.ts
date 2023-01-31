import {OlympiaPage} from './app.po';

describe('Olympia App', () => {
    let page: OlympiaPage;

    beforeEach(() => {
        page = new OlympiaPage();
    });

    it('should display welcome message', () => {
        page.navigateTo();
        expect(page.getTitleText()).toEqual('Welcome to Olympia!');
    });
});
