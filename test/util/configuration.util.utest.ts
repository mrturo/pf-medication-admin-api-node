import { Configuration as ConfigurationUtil } from '../../src/util/configuration.util';
import { Environment as EnvironmentUtil } from '../../src/util/environment.util';

describe('Suit to class Configuration', () => {
  it('Happy Path', async () => {
    EnvironmentUtil.init();
    expect(ConfigurationUtil.NODE_ENV()).not.toBe('');
    expect(ConfigurationUtil.PG_DATABASE()).not.toBe('');
    expect(ConfigurationUtil.PG_HOST()).not.toBe('');
    expect(ConfigurationUtil.PG_MAXP()).not.toBe('');
    expect(ConfigurationUtil.PG_PASSWORD()).not.toBe('');
    expect(ConfigurationUtil.PG_PORT()).not.toBe('');
    expect(ConfigurationUtil.PG_USER()).not.toBe('');

    expect(ConfigurationUtil.prepareStr('A','B')).toBe('A');
    expect(ConfigurationUtil.prepareStr(undefined,'B')).toBe('B');
    expect(ConfigurationUtil.prepareStr('A',undefined)).toBe('A');
    expect(ConfigurationUtil.prepareStr(undefined,undefined)).toBe('');

    expect(ConfigurationUtil.prepareNmb('1',2)).toBe(1);
    expect(ConfigurationUtil.prepareNmb(undefined,2)).toBe(2);
    expect(ConfigurationUtil.prepareNmb('1',undefined)).toBe(1);
    expect(ConfigurationUtil.prepareNmb(undefined,undefined)).toBe(0);
  });
});
