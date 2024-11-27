export const dbMock = {
  collection: jest.fn().mockReturnThis(),
  doc: jest.fn().mockReturnThis(),
  get: jest.fn().mockResolvedValue({
    data: jest.fn().mockReturnValue({ id: "mockAlertId" })
  }),
  set: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};
