import { certificateStub } from '../stubs/certificate.stub';

export const AddCertificateService = jest.fn().mockReturnValue({
  execute: jest.fn().mockResolvedValue(certificateStub()),
});
