import { Certificate } from '../../src/certificates/entities/certificate.entity';

export const certificateStub = (): Certificate => ({
  id: 'id',
  certificateId: 'certificateId',
  certificateImageSource: 'certificateImageSource',
  certificateIssueDate: new Date(2022, 1, 10),
  certificateOwnerName: 'certificateOwnerName',
  createdAt: new Date(2022, 1, 10),
  vaccineName: 'vaccineName',
  vaccineDoses: [
    {
      date: new Date(2022, 1, 10),
      location: 'vaccinationLocation',
      lotNumber: 'lotNumber',
    },
  ],
});
