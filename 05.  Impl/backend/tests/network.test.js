const getNetworkIP = require('../utils/network');
const os = require('os');

jest.mock('os');

describe('getNetworkIP', () => {
  it('should return the first non-internal IPv4 address', () => {
    os.networkInterfaces.mockReturnValue({
      eth0: [
        { internal: false, family: 'IPv4', address: '192.168.1.100' },
        { internal: true, family: 'IPv4', address: '127.0.0.1' }
      ]
    });
    expect(getNetworkIP()).toBe('192.168.1.100');
  });

  it('should return "0.0.0.0" if no external IPv4 address is found', () => {
    os.networkInterfaces.mockReturnValue({
      eth0: [
        { internal: true, family: 'IPv4', address: '127.0.0.1' }
      ]
    });
    expect(getNetworkIP()).toBe('0.0.0.0');
  });
});