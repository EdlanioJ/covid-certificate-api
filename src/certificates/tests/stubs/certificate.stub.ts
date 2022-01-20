import { Types } from 'mongoose';
import { Certificate } from '../../entities/certificate.entity';

export const certificateModelStub = () => ({
  id: 'id',
  ownerId: new Types.ObjectId('123456789012'),
  vaccineName: 'vaccineName',
  certificateId: 'certificateId',
  certificateOwnerName: 'certificateOwnerName',
  certificateIssueDate: new Date(2022, 1, 10),
  certificateImageSource: 'certificateImageSource',
  createdAt: new Date(2022, 1, 10),
  vaccineDoses: [
    {
      date: new Date(2022, 1, 10),
      location: 'vaccinationLocation',
      lotNumber: 'lotNumber',
    },
  ],
});

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
