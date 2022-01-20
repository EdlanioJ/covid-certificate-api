import { Browser, Page } from 'puppeteer';
import { JSDOM } from 'jsdom';

export const mockBrowser = {
  newPage() {
    return Promise.resolve(mockPage);
  },
  close() {
    return Promise.resolve();
  },
} as unknown as Browser;

export const mockPage = {
  goto(_url: string) {
    return Promise.resolve();
  },
  waitForSelector(_selector: string) {
    return Promise.resolve();
  },
  click(_selector: string) {
    return Promise.resolve();
  },
  $eval(selector: string, pageFunction: any) {
    const {
      window: { document },
    } = new JSDOM(`<body></body>`);
    const imgElement = document.createElement('img');
    imgElement.setAttribute('src', 'image');
    const strongElement = document.createElement('strong');

    const imgSelector = '#prttic > table > tbody > tr:nth-child(4) > td > img';
    if (selector === imgSelector) {
      return Promise.resolve(pageFunction(imgElement));
    }

    const vaccinationDataSelector =
      '#prttic > table > tbody > tr:nth-child(3) > td > strong:nth-child(24)';
    if (selector === vaccinationDataSelector) {
      strongElement.textContent =
        '1ª Dose: 01/01/2021 - Nº do Lote: ABC1234, 2ª Dose: 02/02/2021 - Nº do Lote: DEF5678';
      return Promise.resolve(pageFunction(strongElement));
    }

    const vaccinationLocationSelector =
      '#prttic > table > tbody > tr:nth-child(3) > td > strong:nth-child(28)';
    if (selector === vaccinationLocationSelector) {
      strongElement.textContent =
        'EA Bombeiros-Luanda-Off, EA Bombeiros-Luanda-Off';
      return Promise.resolve(pageFunction(strongElement));
    }

    strongElement.textContent = 'text content';
    return Promise.resolve(pageFunction(strongElement));
  },
  type(_selector: string, text: string) {
    return Promise.resolve();
  },
} as unknown as Page;
