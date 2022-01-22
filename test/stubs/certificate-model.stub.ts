import { Types } from 'mongoose';

export const certificateModelStub = () => ({
  _id: new Types.ObjectId('123456789012'),
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
