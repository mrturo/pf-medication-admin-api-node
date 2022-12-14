export class Configuration {
  public static prepareStr(env: string | undefined, def = ''): string {
    let result = def;
    if (env) {
      result = env.trim();
    }
    return result;
  }
  public static prepareNmb(env: string | undefined, def = 0): number {
    let result = def;
    const value: number = +Configuration.prepareStr(env);
    if (env && Number.isNaN(value) === false) {
      result = value;
    }
    return result;
  }
  public static NODE_ENV(): string {
    return Configuration.prepareStr(process.env.NODE_ENV)
  }
  public static PG_HOST(): string {
    return Configuration.prepareStr(process.env.PG_HOST, 'localhost')
  }
  public static PG_USER(): string {
    return Configuration.prepareStr(process.env.PG_USER, 'postgres')
  }
  public static PG_PORT(): number {
    return Configuration.prepareNmb(process.env.PG_PORT, 5432);
  }
  public static PG_PASSWORD(): string {
    return Configuration.prepareStr(process.env.PG_PASSWORD)
  }
  public static PG_DATABASE(): string {
    return Configuration.prepareStr(process.env.PG_DATABASE)
  }
  public static PG_MAXP(): number {
    return Configuration.prepareNmb(process.env.PG_MAXP, 4)
  }
}
