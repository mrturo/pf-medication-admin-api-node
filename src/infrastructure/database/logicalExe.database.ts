import { Infrastructure as InfrastructureError } from '../error/infrastructure.error';
import { Exe as ExeDB } from './exe.database';
import { Scheme as SchemeDb } from './scheme.database';

export class LogicalExe {
  public static async getBasis(tableName: string) {
    if (tableName.trim() === '') {
      throw new InfrastructureError('FROM clause not found');
    } else {
      const prexis: string[] = [];
      const table = SchemeDb.ALL.filter(
        (t) => t.name.trim().toUpperCase() === tableName.trim().toUpperCase()
      );
      if (table.length === 0) {
        throw new InfrastructureError(
          `"${tableName
            .trim()
            .toUpperCase()}" does not exist in scheme definition`
        );
      } else {
        try {
          const preBasis = Object.values(table[0].columns).filter(
            (c) =>
              c.split('_').length === 2 &&
              (c.endsWith('_ID') ||
                c.endsWith('_CREATED') ||
                c.endsWith('_UPDATED') ||
                c.endsWith('_ACTIVATED'))
          );
          const basis = (
            await Promise.all(
              preBasis.map((pB: string) => {
                const prexi: string = pB.split('_')[0];
                if (prexis.includes(prexi) === false) {
                  prexis.push(prexi);
                  const filtered: string[] = preBasis.filter((b) =>
                    b.startsWith(prexi)
                  );
                  if (filtered.length >= 4) {
                    return filtered;
                  }
                }
                return [];
              })
            )
          ).filter((f) => f.length > 0)[0];
          return {
            id: basis.filter((b) => b.endsWith('_ID'))[0],
            created: basis.filter((b) => b.endsWith('_CREATED'))[0],
            updated: basis.filter((b) => b.endsWith('_UPDATED'))[0],
            activated: basis.filter((b) => b.endsWith('_ACTIVATED'))[0]
          };
        } catch (error) {
          throw new InfrastructureError(
            `Not found basis columns in "${tableName.trim().toUpperCase()}"`
          );
        }
      }
    }
  }
  public static async select(
    from: string,
    where = '',
    orderBy = '',
    columns: string | string[] = ''
  ) {
    const basis = await LogicalExe.getBasis(from);
    return await ExeDB.select(
      from,
      `(${where.trim() === '' ? '' : `(${where.trim()}) AND `}"${
        basis.activated
      }" = TRUE)`,
      orderBy,
      columns
    );
  }
  public static async insert(
    from: string,
    values: Map<string, string | number | boolean | Date | null>
  ) {
    const now = new Date();
    const basis = await LogicalExe.getBasis(from);
    values.set(basis.activated, true);
    values.set(basis.updated, now);
    let result = await ExeDB.update(
      from,
      values,
      `"${basis.activated}" = TRUE`
    );
    if (result.body.rowCount === 0) {
      values.set(basis.created, now);
      result = await ExeDB.insert(from, values);
    }
    return result;
  }
  public static async update(
    from: string,
    values: Map<string, string | number | boolean | Date | null>,
    where = ''
  ) {
    const basis = await LogicalExe.getBasis(from);
    values.set(basis.activated, true);
    values.set(basis.updated, new Date());
    return await ExeDB.update(
      from,
      values,
      `(${where.trim() === '' ? '' : `(${where.trim()}) AND `}"${
        basis.activated
      }" = TRUE)`
    );
  }
  public static async remove(from: string, where = '') {
    const basis = await LogicalExe.getBasis(from);
    const values = new Map<string, string | number | boolean | Date | null>();
    values.set(basis.activated, false);
    values.set(basis.updated, new Date());
    return await ExeDB.update(
      from,
      values,
      `(${where.trim() === '' ? '' : `(${where.trim()}) AND `}"${
        basis.activated
      }" = TRUE)`
    );
  }
}
