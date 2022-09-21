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
  });
});
