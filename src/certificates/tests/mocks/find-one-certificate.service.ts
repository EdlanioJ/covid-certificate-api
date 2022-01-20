import { certificateStub } from '../stubs/certificate.stub';

export const FindOneCertificateService = jest.fn().mockReturnValue({
  execute: jest.fn().mockResolvedValue(certificateStub()),
});
