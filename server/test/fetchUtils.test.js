import { GET, POST, PUT, DELETE } from '../utils/fetchUtils.js';

//MOCK TESTING does not use real API calls
describe('fetchUtils tests', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  //GET
  test("GET: mocks GET request and checks response", async () => {
    const mockJson = { message: "Success", user_id: 123 };
    
    const mockResponse = {
      json: jest.fn().mockResolvedValue(mockJson),
      status: 200,
      ok: true,
    };

    //@ts-ignore
    global.fetch.mockResolvedValue(mockResponse);

    const json = await GET('http://lfg.gccis.rit.edu/api-test/users');

    expect(fetch).toHaveBeenCalledWith('http://lfg.gccis.rit.edu/api-test/users');
    expect(json).toEqual(mockJson);
  });

  //POST
  test('POST: sends data and checks response', async () => {
    const mockUser = { first_name: 'Tracy', last_name: 'Test' };
    const mockResponse = { user_id: 123, ...mockUser };

    //@ts-ignore
    global.fetch.mockResolvedValue({
      ok: true,
      status: 201,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const data = await POST('http://lfg.gccis.rit.edu/api-test/users', mockUser);

    expect(fetch).toHaveBeenCalledWith('http://lfg.gccis.rit.edu/api-test/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockUser),
    });

    expect(data).toEqual(mockResponse);
  });

  //PUT
  test('PUT: updates user and returns response', async () => {
    const mockUpdate = { first_name: 'Ursala', last_name: 'Update' };
    const mockResponse = { user_id: 123, ...mockUpdate };

    //@ts-ignore
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const data = await PUT('http://lfg.gccis.rit.edu/api-test/users/123', mockUpdate);

    expect(fetch).toHaveBeenCalledWith('http://lfg.gccis.rit.edu/api-test/users/123', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockUpdate),
    });

    expect(data).toEqual(mockResponse);
  });

  //DELETE
  test('DELETE: removes user and returns response', async () => {
    const mockResponse = { success: true, user_id: 123 };

    //@ts-ignore
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const data = await DELETE('http://lfg.gccis.rit.edu/api-test/users/123');

    expect(fetch).toHaveBeenCalledWith('http://lfg.gccis.rit.edu/api-test/users/123', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    expect(data).toEqual(mockResponse);
  });
});
