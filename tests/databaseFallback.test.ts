import { withDatabaseFallback } from '../src/lib/databaseFallback';

let mockNow = Date.now();

describe('database content fallback', () => {
  beforeEach(() => {
    mockNow += 20_000;
    jest.spyOn(Date, 'now').mockImplementation(() => mockNow);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('serves seed content and logs transient connection failures', async () => {
    const log = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const fallback = jest.fn(() => ['seed']);
    const read = jest.fn(async () => {
      throw new Error('Error: cannot connect to Postgres: getaddrinfo EAI_AGAIN database.example');
    });

    await expect(withDatabaseFallback('Published destinations', read, fallback))
      .resolves.toEqual(['seed']);
    expect(fallback).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenCalledWith(
      '[CMS] Published destinations could not reach PostgreSQL (EAI_AGAIN); serving seed content for this request.',
    );
  });

  it('recognizes connection codes in nested causes', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const read = jest.fn(async () => {
      throw new Error('Database connection failed', { cause: { code: 'ECONNRESET' } });
    });

    await expect(withDatabaseFallback('Published tours', read, () => ['seed']))
      .resolves.toEqual(['seed']);
  });

  it('does not hide non-connection failures', async () => {
    const error = new Error('Article validation failed');
    const fallback = jest.fn(() => ['seed']);

    await expect(withDatabaseFallback('Published articles', async () => {
      throw error;
    }, fallback)).rejects.toBe(error);
    expect(fallback).not.toHaveBeenCalled();
  });

  it('avoids repeated connection attempts during a short outage', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const read = jest.fn()
      .mockRejectedValueOnce(new Error('getaddrinfo EAI_AGAIN database.example'))
      .mockResolvedValue(['cms']);
    const fallback = () => ['seed'];

    await expect(withDatabaseFallback('Published destinations', read, fallback)).resolves.toEqual(['seed']);
    await expect(withDatabaseFallback('Published tours', read, fallback)).resolves.toEqual(['seed']);
    expect(read).toHaveBeenCalledTimes(1);

    mockNow += 11_000;
    await expect(withDatabaseFallback('Published destinations', read, fallback)).resolves.toEqual(['cms']);
    expect(read).toHaveBeenCalledTimes(2);
  });
});
