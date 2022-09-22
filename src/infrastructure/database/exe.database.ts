import { Pool, QueryResult } from 'pg';

import { Configuration as ConfigurationUtil } from '../../util/configuration.util';
import { Infrastructure as InfrastructureError } from '../error/infrastructure.error';

export class Exe {
  public static async exe(query: string) {
    const pool: Pool = new Pool({
      max: ConfigurationUtil.PG_MAXP(),
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
      user: ConfigurationUtil.PG_USER(),
      host: ConfigurationUtil.PG_HOST(),
      database: ConfigurationUtil.PG_DATABASE(),
      password: ConfigurationUtil.PG_PASSWORD(),
      port: ConfigurationUtil.PG_PORT()
    });
    console.log(query)
    const execution = await Exe.exeQuery(pool, query);
    if (execution.status === true) {
      await Exe.exeQuery(pool, 'COMMIT');
    } else {
      await Exe.exeQuery(pool, 'ROLLBACK');
      throw new InfrastructureError(execution.body.message);
    }
    return execution;
  }
  public static async select(
    from: string,
    where = '',
    orderBy = '',
    columns: string | string[] = ''
  ) {
    try {
      from = from.trim();
      if (from === '') {
        throw new InfrastructureError('FROM clause not found');
      } else {
        if (typeof columns === 'string') {
          columns = columns.split(',');
        }
        let sColumns = '';
        await Promise.all(
          columns.map((c: string) => {
            c = c.trim();
            if (['', '*'].includes(c) === false) {
              c = `"${c}"`;
              if (sColumns === '') {
                sColumns = c;
              } else {
                sColumns = `${sColumns}, ${c}`;
              }
            }
          })
        );
        if (sColumns.trim() === '') {
          sColumns = '*';
        }
        where = where.trim() === '' ? '' : `WHERE ${where.trim()}`;
        orderBy = orderBy.trim() === '' ? '' : `ORDER BY ${orderBy.trim()}`;
        const sqlResult = `SELECT ${sColumns} FROM public."${from}" ${where} ${orderBy}`;
        return await Exe.exe(sqlResult.trim());
      }
    } catch (error) {
      let msg = 'Error';
      if (error instanceof Error && error.message.trim() !== '') {
        msg = error.message.trim();
      }
      throw new InfrastructureError(msg);
    }
  }
  public static async insert(
    from: string,
    values: Map<string, string | number | boolean | Date | null>
  ) {
    try {
      from = from.trim();
      if (from === '') {
        throw new InfrastructureError('FROM clause not found');
      } else if (values.size === 0) {
        throw new InfrastructureError('VALUES not found');
      } else {
        let sColumns = '';
        let sValues = '';
        let i = 0;
        values.forEach(
          (value: string | number | boolean | Date | null, key: string) => {
            if (key.trim() !== '') {
              const localValue = Exe.formatValue(value);
              i++;
              if (sColumns === '' && sValues === '') {
                sColumns = `"${key.trim()}"`;
                sValues = `${localValue}`;
              } else {
                sColumns = `${sColumns}, "${key.trim()}"`;
                sValues = `${sValues}, ${localValue}`;
              }
            }
          }
        );
        if (i === 0) {
          throw new InfrastructureError('COLUMNS and/or VALUES not found');
        } else {
          const sqlResult = `INSERT INTO public."${from}"(${sColumns}) VALUES (${sValues})`;
          return await Exe.exe(sqlResult.trim());
        }
      }
    } catch (error) {
      let msg = 'Error';
      if (error instanceof Error && error.message.trim() !== '') {
        msg = error.message.trim();
      }
      throw new InfrastructureError(msg);
    }
  }
  public static async update(
    from: string,
    values: Map<string, string | number | boolean | Date | null>,
    where = ''
  ) {
    try {
      from = from.trim();
      if (from === '') {
        throw new InfrastructureError('FROM clause not found');
      } else if (values.size === 0) {
        throw new InfrastructureError('VALUES not found');
      } else {
        let sValues = '';
        values.forEach(
          (value: string | number | boolean | Date | null, key: string) => {
            if (key.trim() !== '') {
              const localValue = Exe.formatValue(value);
              const keyValue = `"${key.trim()}" = ${localValue}`;
              if (sValues === '') {
                sValues = keyValue;
              } else {
                sValues = `${sValues}, ${keyValue}`;
              }
            }
          }
        );
        if (sValues === '') {
          throw new InfrastructureError('COLUMNS and/or VALUES not found');
        } else {
          where = where.trim() === '' ? '' : ` WHERE ${where.trim()}`;
          const sqlResult = `UPDATE public."${from}" SET ${sValues}${where}`;
          return await Exe.exe(sqlResult.trim());
        }
      }
    } catch (error) {
      let msg = 'Error';
      if (error instanceof Error && error.message.trim() !== '') {
        msg = error.message.trim();
      }
      throw new InfrastructureError(msg);
    }
  }
  public static async remove(from: string, where = '') {
    try {
      from = from.trim();
      if (from === '') {
        throw new InfrastructureError('FROM clause not found');
      } else {
        where = where.trim() === '' ? '' : `WHERE ${where.trim()}`;
        const sqlResult = `DELETE FROM public."${from}" ${where}`;
        return await Exe.exe(sqlResult.trim());
      }
    } catch (error) {
      let msg = 'Error';
      if (error instanceof Error && error.message.trim() !== '') {
        msg = error.message.trim();
      }
      throw new InfrastructureError(msg);
    }
  }
  public static formatDate(date: Date): string {
    const d = new Date(date),
      year = d.getFullYear();
    let month = '' + (d.getMonth() + 1),
      day = '' + d.getDate();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }
  public static formatValue(
    value: string | number | boolean | Date | null
  ): string {
    return typeof value === 'string'
      ? `'${value}'`
      : typeof value === 'boolean'
      ? value === true
        ? 'TRUE'
        : 'FALSE'
      : value === null
      ? `NULL`
      : typeof value === 'object'
      ? `'${Exe.formatDate(value)}'`
      : `${value}`;
  }
  private static async exeQuery(pool: Pool, query: string) {
    let result: {
      status: boolean;
      body: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rows: any[];
        rowCount: number;
        message: string;
      };
    } = {
      status: false,
      body: {
        rows: [],
        rowCount: 0,
        message: 'Ok'
      }
    };
    try {
      query = query.trim();
      if (query === '') {
        throw new InfrastructureError('Not Query');
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res: QueryResult<any> = await pool.query(query);
        result = {
          status: true,
          body: {
            rows: res.rows,
            rowCount: res.rowCount,
            message: 'OK'
          }
        };
      }
    } catch (error) {
      let msg = 'Error';
      if (error instanceof Error && error.message.trim() !== '') {
        msg = error.message.trim();
      }
      result = {
        status: false,
        body: {
          rows: [],
          rowCount: 0,
          message: msg
        }
      };
    }
    return result;
  }
}
