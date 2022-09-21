import { Environment as EnvironmentUtil } from '../../src/util/environment.util';

describe('Suit to class Environment', () => {
  it('Happy Path', async () => {
    const envProduction: EnvironmentUtil = new EnvironmentUtil(
      EnvironmentUtil.PRODUCTION()
    );
    expect(envProduction.value).toBe(EnvironmentUtil.PRODUCTION());
    expect(envProduction.file).toBe(EnvironmentUtil.FILE_ENV());

    const envUndefined: EnvironmentUtil = new EnvironmentUtil();
    expect(envUndefined.value).toBe(EnvironmentUtil.PRODUCTION());
    expect(envUndefined.file).toBe(EnvironmentUtil.FILE_ENV());

    const envTesting: EnvironmentUtil = new EnvironmentUtil(
      EnvironmentUtil.TESTING()
    );
    expect(envTesting.value).toBe(EnvironmentUtil.TESTING());
    expect(envTesting.file).toBe(EnvironmentUtil.FILE_ENV_DEV());

    const envDevelopment: EnvironmentUtil = new EnvironmentUtil(
      EnvironmentUtil.DEVELOPMENT()
    );
    expect(envDevelopment.value).toBe(EnvironmentUtil.DEVELOPMENT());
    expect(envDevelopment.file).toBe(EnvironmentUtil.FILE_ENV_DEV());
  });
});
