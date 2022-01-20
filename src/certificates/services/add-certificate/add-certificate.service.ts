import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as puppeteer from 'puppeteer';

import {
  CertificateModelName,
  CertificateDocument,
} from '../../../schemas/certificate.schema';
import { UserModelName, UserDocument } from '../../../schemas/user.schema';
import { Certificate } from '../../entities/certificate.entity';

@Injectable()
export class AddCertificateService {
  constructor(
    @InjectModel(CertificateModelName)
    private readonly certificateModel: Model<CertificateDocument>,
    @InjectModel(UserModelName)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async execute(certificateCode: string, ownerId: string) {
    const {
      certificateId,
      certificateImageSource,
      certificateIssueDate,
      certificateOwnerName,
      vaccineDoses,
      vaccineName,
    } = await this.loadCertificateData(certificateCode);

    const user = await this.userModel.findById(ownerId);

    if (!user) throw new ForbiddenException('Access  Denied');

    const certificate = await this.certificateModel.create({
      certificateId,
      certificateImageSource,
      certificateIssueDate,
      certificateOwnerName,
      vaccineDoses,
      vaccineName,
      ownerId: user._id,
    });

    return new Certificate({
      id: certificate.id,
      certificateId: certificate.certificateId,
      certificateOwnerName: certificate.certificateOwnerName,
      certificateIssueDate: certificate.certificateIssueDate,
      vaccineName: certificate.vaccineName,
      vaccineDoses: certificate.vaccineDoses,
      certificateImageSource: certificate.certificateImageSource,
      createdAt: certificate.createdAt,
    });
  }

  private async loadCertificateData(code: string) {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      const url = 'https://www.vacina.gov.ao/certificado.aspx';
      await page.goto(url, {
        waitUntil: 'domcontentloaded',
      });

      const closeButtonSelector =
        '#alerta > div > div > div.modal-header > button';
      await page.waitForSelector(closeButtonSelector);
      await page.click(closeButtonSelector);

      const inputCodeSelector = '#cphmain_txb_Codigo';
      await page.type(inputCodeSelector, code);

      const inputBtnSelector =
        'input[name="ctl00$cphmain$bt_Verificar"]#cphmain_bt_Verificar';
      await page.waitForSelector(inputBtnSelector);
      await page.click(inputBtnSelector);

      const certificateSelector = '#prttic';
      await page.waitForSelector(certificateSelector);

      const vaccineNameSelector =
        '#prttic > table > tbody > tr:nth-child(3) > td > strong:nth-child(12)';
      const vaccineName = await page.$eval(
        vaccineNameSelector,
        (element) => element.textContent,
      );

      const certificateIdSelector =
        '#prttic > table > tbody > tr:nth-child(3) > td > strong:nth-child(40)';
      const certificateId = await page.$eval(
        certificateIdSelector,
        (element) => element.textContent,
      );

      const certificateIssueDateSelector =
        '#prttic > table > tbody > tr:nth-child(3) > td > strong:nth-child(44)';
      const certificateIssueDate = await page.$eval(
        certificateIssueDateSelector,
        (element) => element.textContent.replace(/(\d+[/])(\d+[/])/, '$2$1'),
      );

      const certificateOwnerNameSelector =
        '#prttic > table > tbody > tr:nth-child(3) > td > strong:nth-child(4)';
      const certificateOwnerName = await page.$eval(
        certificateOwnerNameSelector,
        (element) => element.textContent,
      );

      const vaccinationLocationSelector =
        '#prttic > table > tbody > tr:nth-child(3) > td > strong:nth-child(28)';
      const vaccinationLocations = await page.$eval(
        vaccinationLocationSelector,
        (element) => element.textContent.split(','),
      );

      const certificateImageSourceSelector =
        '#prttic > table > tbody > tr:nth-child(4) > td > img';
      const certificateImageSource = await page.$eval(
        certificateImageSourceSelector,
        (element) => element.getAttribute('src'),
      );

      const vaccinationDataSelector =
        '#prttic > table > tbody > tr:nth-child(3) > td > strong:nth-child(24)';
      const vaccinationData = await page.$eval(
        vaccinationDataSelector,
        (element) => element.textContent,
      );

      const findVaccineLotsRegex = /(?<=Lote: )[^.\s]*/g;
      const findVaccineDateRegex = /(?<=Dose: )[^.\s]*/g;

      const vaccineLotData = vaccinationData.match(findVaccineLotsRegex);
      const vaccineDatesData = vaccinationData.match(findVaccineDateRegex);

      const vaccineDoses = vaccineDatesData.map((value, index) => {
        const date = value
          .replace(',', '')
          .trim()
          .replace(/(\d+[/])(\d+[/])/, '$2$1');

        return {
          lotNumber: vaccineLotData[index].replace(',', '').trim(),
          date: new Date(date),
          location: vaccinationLocations[index].replace(',', '').trim(),
        };
      });

      await browser.close();

      return {
        certificateId,
        certificateOwnerName,
        vaccineName,
        certificateIssueDate: new Date(certificateIssueDate as string),
        vaccineDoses,
        certificateImageSource,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Fail Load Certificate Data',
      );
    }
  }
}
