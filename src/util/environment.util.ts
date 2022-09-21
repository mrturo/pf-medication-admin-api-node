import * as dotenv from 'dotenv';

import { Configuration as ConfigurationUtil } from './configuration.util';

export class Environment {
  public static init(): Environment {
    const amb: Environment = new Environment(ConfigurationUtil.NODE_ENV());
    dotenv.config({ path: amb.file });
    return amb;
  }
  public static PRODUCTION(): string {
    return 'production';
  }
  public static DEVELOPMENT(): string {
    return 'development';
  }
  public static TESTING(): string {
    return 'testing';
  }
  public static FILE_ENV(): string {
    return '.env';
  }
  public static FILE_ENV_DEV(): string {
    return '.env.dev';
  }
  private _value!: string;
  private _file!: string;
  constructor(value: string | undefined = undefined) {
    this.value = value;
  }
  public get value(): string {
    return this._value;
  }
  private set value(value: string | undefined) {
    value = value ? value.trim().toLowerCase() : '';
    value = value === '' ? Environment.PRODUCTION() : value;
    let localArchivo = Environment.FILE_ENV();
    if ([Environment.DEVELOPMENT(), Environment.TESTING()].includes(value)) {
      localArchivo = Environment.FILE_ENV_DEV();
    }
    this._value = value;
    this.file = localArchivo;
  }
  public get file(): string {
    return this._file;
  }
  private set file(value: string) {
    this._file = value;
  }
}

Environment.init();
