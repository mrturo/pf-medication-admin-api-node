import { Environment as EnvironmentUtil } from '../../src/util/environment.util';
import { Logger as LoggerUtil } from '../../src/util/logger.util';

describe('Suit to class Logger', () => {
  it('Happy Path - Any environment', async () => {
    EnvironmentUtil.init();
    expect(LoggerUtil.warn('Test')).toBe('Test');
    expect(LoggerUtil.debug('Test')).toBe('Test');
    expect(LoggerUtil.error('Test1 | Test2')).toBe('Test1 | Test2');
    expect(LoggerUtil.info(['Test1', 'Test2'])).toBe('Test1 | Test2');
    expect(LoggerUtil.separator()).toBe('*****');
  });
});
