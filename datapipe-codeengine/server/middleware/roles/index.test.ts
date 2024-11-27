const mockIsAuthFn = jest.fn();
const mockRequest = {
  isAuthenticated: mockIsAuthFn
};
const mockResponse = {
  status: jest.fn(),
  json: jest.fn()
};
const mockAction = jest.fn();
const mockUse = jest.fn();

jest.mock('connect-roles', () => {
  return (argumentObj) => {
    argumentObj.failureHandler(mockRequest, mockResponse, mockAction);
    return {
      use: mockUse
    };
  }
});

describe('Roles', () => {
  test('roles initiated', async ()=> {
    mockUse.mockImplementation((role, callBackFn) => {
      callBackFn(mockRequest);
    });
    let roles = require('./index');
    expect(mockResponse.status.mock.calls.length).toBe(1);
    expect(mockResponse.status.mock.calls[0][0]).toBe(403);
    expect(mockResponse.json.mock.calls.length).toBe(1);
    expect(mockResponse.json.mock.calls[0][0]).toEqual({message: 'Unauthorized', action: mockAction});
    expect(mockUse.mock.calls.length).toBe(1);
    expect(mockUse.mock.calls[0][0]).toEqual('authenticated');
    expect(mockIsAuthFn.mock.calls.length).toBe(1);
  });
});
