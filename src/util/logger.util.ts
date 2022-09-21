import { format, loggers, transports } from 'winston';

import { Configuration as ConfigurationUtil } from './configuration.util';

export class Logger {
  private static updateBase() {
    if (loggers.has('app-logger') === true) {
      loggers.close('app-logger');
    }
    loggers.add('app-logger', {
      format: format.combine(
        format.simple(),
        format.colorize({ all: true }),
        format.timestamp({
          format: new Date().toLocaleString('es-CL', {
            timeZone: 'America/Santiago'
          })
        }),
        format.printf(
          (log) => `${log.timestamp} | ${log.level} | ${log.message}`
        )
      ),
      transports: [
        new transports.Console({
          level: 'debug'
        })
      ]
    });
  }
  public static available(): boolean {
    return ![''].includes(ConfigurationUtil.NODE_ENV());
  }
  public static warn(message: string | string[]): string {
    let result = '';
    if (Logger.available() === true) {
      result = Logger.getMessage(message);
      Logger.updateBase();
      loggers.get('app-logger').warn(result);
    }
    return result;
  }
  public static debug(message: string | string[]): string {
    let result = '';
    if (Logger.available() === true) {
      result = Logger.getMessage(message);
      Logger.updateBase();
      loggers.get('app-logger').debug(result);
    }
    return result;
  }
  public static error(message: string | string[]): string {
    let result = '';
    if (Logger.available() === true) {
      result = Logger.getMessage(message);
      Logger.updateBase();
      loggers.get('app-logger').error(result);
    }
    return result;
  }
  public static info(message: string | string[]): string {
    let result = '';
    if (Logger.available() === true) {
      result = Logger.getMessage(message);
      Logger.updateBase();
      loggers.get('app-logger').info(result);
    }
    return result;
  }
  public static separator(): string {
    let result = '';
    if (Logger.available() === true) {
      result = '*****';
      console.log(result);
    }
    return result;
  }
  private static getMessage(message: undefined | string | string[]): string {
    let result = '';
    if (message) {
      if (typeof message === 'string') {
        message = message.trim();
        if (message.includes('|') === false) {
          result = message;
        } else {
          result = Logger.getMessage(message.split('|'));
        }
      } else {
        for (const msg of message) {
          const m = Logger.getMessage(msg);
          if (m !== '') {
            if (result === '') {
              result = m;
            } else {
              result = `${result} | ${m}`;
            }
          }
        }
      }
    }
    return result;
  }
}
