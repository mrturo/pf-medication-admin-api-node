import { Exe as ExeDB } from '../../../src/infrastructure/database/exe.database';
import { LogicalExe as LogicalExeDB } from '../../../src/infrastructure/database/logicalExe.database';
import { Scheme as SchemeDB } from '../../../src/infrastructure/database/scheme.database';
import { Environment as EnvironmentUtil } from '../../../src/util/environment.util';
EnvironmentUtil.init();

describe('Suit to class LogicalExe (DB)', () => {
  it('Happy Path - getBasis', async () => {
    const basis = await LogicalExeDB.getBasis(SchemeDB.PF_TESTING_2.name);
    expect(Object.keys(basis)).toEqual([
      'id',
      'created',
      'updated',
      'activated'
    ]);
    expect(basis.id).not.toBeUndefined();
    expect(basis.created).not.toBeUndefined();
    expect(basis.updated).not.toBeUndefined();
    expect(basis.activated).not.toBeUndefined();
  });
  /* it('Happy Path - Select', async () => {
    const select1 = await LogicalExeDB.select(SchemeDB.PF_TESTING_2.name);
    expect(select1.status).toBe(true);
    expect(select1.body.message).toBe('OK');

    const select2 = await LogicalExeDB.select(
      SchemeDB.PF_TESTING_2.name,
      `"${SchemeDB.PF_TESTING_2.columns.TEST_ID}" > 0`
    );
    expect(select2.status).toBe(true);
    expect(select2.body.message).toBe('OK');
  });
  it('Happy Path - Remove', async () => {
    await ExeDB.remove(SchemeDB.PF_TESTING_2.name);

    const val1: Map<string, string | number | boolean | Date | null> = new Map<
      string,
      string | number | boolean | Date | null
    >();
    val1.set(SchemeDB.PF_TESTING_2.columns.TEST_TEXT, 'TEST-1');
    val1.set(SchemeDB.PF_TESTING_2.columns.TEST_NUMB, 1);
    await ExeDB.insert(SchemeDB.PF_TESTING_2.name, val1);

    const val2: Map<string, string | number | boolean | Date | null> = new Map<
      string,
      string | number | boolean | Date | null
    >();
    val2.set(SchemeDB.PF_TESTING_2.columns.TEST_TEXT, 'TEST-2');
    val2.set(SchemeDB.PF_TESTING_2.columns.TEST_NUMB, 2);
    await ExeDB.insert(SchemeDB.PF_TESTING_2.name, val2);

    const select1 = await LogicalExeDB.select(SchemeDB.PF_TESTING_2.name);
    expect(select1.status).toBe(true);
    expect(select1.body.rowCount).toBe(2);
    expect(select1.body.message).toBe('OK');

    const remove1 = await LogicalExeDB.remove(
      SchemeDB.PF_TESTING_2.name,
      `"${SchemeDB.PF_TESTING_2.columns.TEST_NUMB}" = 1`
    );
    expect(remove1.status).toBe(true);
    expect(remove1.body.message).toBe('OK');

    const select2 = await LogicalExeDB.select(SchemeDB.PF_TESTING_2.name);
    expect(select2.status).toBe(true);
    expect(select2.body.rowCount).toBe(1);
    expect(select2.body.message).toBe('OK');

    const remove2 = await LogicalExeDB.remove(SchemeDB.PF_TESTING_2.name);
    expect(remove2.status).toBe(true);
    expect(remove2.body.message).toBe('OK');

    const select3 = await LogicalExeDB.select(SchemeDB.PF_TESTING_2.name);
    expect(select3.status).toBe(true);
    expect(select3.body.rowCount).toBe(0);
    expect(select3.body.message).toBe('OK');

    await ExeDB.remove(SchemeDB.PF_TESTING_2.name);
  });
  it('Happy Path - Update', async () => {
    await ExeDB.remove(SchemeDB.PF_TESTING_2.name);

    const val1: Map<string, string | number | boolean | Date | null> = new Map<
      string,
      string | number | boolean | Date | null
    >();
    val1.set(SchemeDB.PF_TESTING_2.columns.TEST_TEXT, 'TEST-3');
    val1.set(SchemeDB.PF_TESTING_2.columns.TEST_NUMB, 1);
    await ExeDB.insert(SchemeDB.PF_TESTING_2.name, val1);

    const val2: Map<string, string | number | boolean | Date | null> = new Map<
      string,
      string | number | boolean | Date | null
    >();
    val2.set(SchemeDB.PF_TESTING_2.columns.TEST_NUMB, 0);

    const update1 = await LogicalExeDB.update(
      SchemeDB.PF_TESTING_2.name,
      val2,
      `"${SchemeDB.PF_TESTING_2.columns.TEST_NUMB}" = 1`
    );
    expect(update1.status).toBe(true);
    expect(update1.body.rowCount).toBeGreaterThanOrEqual(1);
    expect(update1.body.message).toBe('OK');

    const update2 = await LogicalExeDB.update(SchemeDB.PF_TESTING_2.name, val2);
    expect(update2.status).toBe(true);
    expect(update2.body.rowCount).toBeGreaterThanOrEqual(1);
    expect(update2.body.message).toBe('OK');
    
    await ExeDB.remove(SchemeDB.PF_TESTING_2.name);
  });
  it('Happy Path - Insert', async () => {
    await ExeDB.remove(SchemeDB.PF_TESTING_2.name);

    const val: Map<string, string | number | boolean | Date | null> = new Map<
      string,
      string | number | boolean | Date | null
    >();
    val.set(SchemeDB.PF_TESTING_2.columns.TEST_TEXT, 'TEST');
    val.set(SchemeDB.PF_TESTING_2.columns.TEST_NUMB, 1);

    const insert1 = await LogicalExeDB.insert(SchemeDB.PF_TESTING_2.name, val);
    expect(insert1.status).toBe(true);
    expect(insert1.body.rowCount).toBe(1);
    expect(insert1.body.message).toBe('OK');

    const insert2 = await LogicalExeDB.insert(SchemeDB.PF_TESTING_2.name, val);
    expect(insert2.status).toBe(true);
    expect(insert2.body.rowCount).toBe(1);
    expect(insert2.body.message).toBe('OK');
    
    await ExeDB.remove(SchemeDB.PF_TESTING_2.name);
  });
  it('getBasis - FROM clause not found', async () => {
    let msg;
    try {
      await LogicalExeDB.getBasis('');
    } catch (error) {
      if (error instanceof Error && error.message.trim() !== '') {
        msg = error.message.trim();
      }
    }
    expect(msg).toBe('FROM clause not found');
  });
  it('getBasis - Not exist in scheme definition', async () => {
    let msg;
    try {
      await LogicalExeDB.getBasis('XXX');
    } catch (error) {
      if (error instanceof Error && error.message.trim() !== '') {
        msg = error.message.trim();
      }
    }
    expect(msg).toBe('"XXX" does not exist in scheme definition');
  });
  it('getBasis - Not found basis columns', async () => {
    let msg;
    try {
      await LogicalExeDB.getBasis(SchemeDB.PF_ACTIVATED_FLINK.name);
    } catch (error) {
      if (error instanceof Error && error.message.trim() !== '') {
        msg = error.message.trim();
      }
    }
    expect(msg).toBe(
      `Not found basis columns in "${SchemeDB.PF_ACTIVATED_FLINK.name}"`
    );
  }); */
});
