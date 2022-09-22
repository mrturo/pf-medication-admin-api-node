import { Exe as ExeDB } from '../../../src/infrastructure/database/exe.database';
import { Scheme as SchemeDB } from '../../../src/infrastructure/database/scheme.database';
import { Environment as EnvironmentUtil } from '../../../src/util/environment.util';
EnvironmentUtil.init();

describe('Suit to class Exe (DB)', () => {
  it('Happy Path', async () => {
    await ExeDB.remove(SchemeDB.PF_TESTING_1.name);

    // Format Date
    expect(ExeDB.formatDate(new Date(2020, 1, 1))).toBe('2020-02-01');
    expect(ExeDB.formatDate(new Date(2020, 10, 10))).toBe('2020-11-10');

    // Format Value
    expect(ExeDB.formatValue(new Date(2020, 1, 1))).toBe("'2020-02-01'");
    expect(ExeDB.formatValue('Hola')).toBe("'Hola'");
    expect(ExeDB.formatValue(1)).toBe('1');
    expect(ExeDB.formatValue(true)).toBe('TRUE');
    expect(ExeDB.formatValue(false)).toBe('FALSE');
    expect(ExeDB.formatValue(null)).toBe('NULL');

    const val1: Map<string, string | number | boolean | Date | null> = new Map<
      string,
      string | number | boolean | Date | null
    >();
    val1.set(SchemeDB.PF_TESTING_1.columns.TEST_TEXT, 'TEST1');
    val1.set(SchemeDB.PF_TESTING_1.columns.TEST_NUMB, 1);

    const val2: Map<string, string | number | boolean | Date | null> = new Map<
      string,
      string | number | boolean | Date | null
    >();
    val2.set(SchemeDB.PF_TESTING_1.columns.TEST_TEXT, 'TEST2');
    val2.set(SchemeDB.PF_TESTING_1.columns.TEST_NUMB, 2);

    // Insert
    const respondInsert1 = await ExeDB.insert(SchemeDB.PF_TESTING_1.name, val1);
    expect(respondInsert1.status).toBe(true);
    expect(respondInsert1.body.message).toBe('OK');
    
    const respondSelect1 = await ExeDB.select(SchemeDB.PF_TESTING_1.name);
    expect(respondSelect1.status).toBe(true);
    expect(respondSelect1.body.rows.length).toBe(1);
    expect(respondSelect1.body.message).toBe('OK');

    const respondInsert2 = await ExeDB.insert(SchemeDB.PF_TESTING_1.name, val2);
    expect(respondInsert2.status).toBe(true);
    expect(respondInsert2.body.message).toBe('OK');
    
    const respondSelect2 = await ExeDB.select(SchemeDB.PF_TESTING_1.name);
    expect(respondSelect2.status).toBe(true);
    expect(respondSelect2.body.rows.length).toBe(2);
    expect(respondSelect2.body.message).toBe('OK');

    // Select
    const respondSelect3 = await ExeDB.select(
      SchemeDB.PF_TESTING_1.name,
      `"${SchemeDB.PF_TESTING_1.columns.TEST_TEXT}" = '${val1.get(
        SchemeDB.PF_TESTING_1.columns.TEST_TEXT
      )}'`,
      `"${SchemeDB.PF_TESTING_1.columns.TEST_ID}"`,
      [
        SchemeDB.PF_TESTING_1.columns.TEST_ID,
        SchemeDB.PF_TESTING_1.columns.TEST_TEXT
      ]
    );
    expect(respondSelect3.status).toBe(true);
    expect(respondSelect3.body.rows.length).toBe(1);
    expect(respondSelect3.body.message).toBe('OK');

    // Update
    const respondUpdate1 = await ExeDB.update(
      SchemeDB.PF_TESTING_1.name,
      val1,
      `"${SchemeDB.PF_TESTING_1.columns.TEST_TEXT}" = '${val1.get(
        SchemeDB.PF_TESTING_1.columns.TEST_TEXT
      )}'`
    );
    expect(respondUpdate1.status).toBe(true);
    expect(respondUpdate1.body.rowCount).toBe(1);
    expect(respondUpdate1.body.message).toBe('OK');

    const respondUpdate2 = await ExeDB.update(SchemeDB.PF_TESTING_1.name, val1);
    expect(respondUpdate2.status).toBe(true);
    expect(respondUpdate2.body.rowCount).toBe(2);
    expect(respondUpdate2.body.message).toBe('OK');

    // Delete
    const respondDelete1 = await ExeDB.remove(
      SchemeDB.PF_TESTING_1.name,
      `"${SchemeDB.PF_TESTING_1.columns.TEST_TEXT}" = '${val1.get(
        SchemeDB.PF_TESTING_1.columns.TEST_TEXT
      )}'`
    );
    expect(respondDelete1.status).toBe(true);
    expect(respondDelete1.body.message).toBe('OK');
    
    const respondSelect4 = await ExeDB.select(SchemeDB.PF_TESTING_1.name);
    expect(respondSelect4.status).toBe(true);
    expect(respondSelect4.body.rows.length).toBe(1);
    expect(respondSelect4.body.message).toBe('OK');

    const respondDelete2 = await ExeDB.remove(SchemeDB.PF_TESTING_1.name);
    expect(respondDelete2.status).toBe(true);
    expect(respondDelete2.body.message).toBe('OK');
    
    const respondSelect5 = await ExeDB.select(SchemeDB.PF_TESTING_1.name);
    expect(respondSelect5.status).toBe(true);
    expect(respondSelect5.body.rows.length).toBe(0);
    expect(respondSelect5.body.message).toBe('OK');
  });
  it('VALUES not found', async () => {
    let msg;
    try {
      await ExeDB.exe('');
    } catch (error) {
      if (error instanceof Error) {
        msg = error.message;
      }
    }

    expect(msg).toBe('Not Query');
  });
  it('FROM clause not found', async () => {
    const val: Map<string, string | number | boolean | Date | null> = new Map<
      string,
      string | number | boolean | Date | null
    >();
    val.set(SchemeDB.PF_TESTING_1.columns.TEST_TEXT, 'TEST');
    val.set(SchemeDB.PF_TESTING_1.columns.TEST_NUMB, 1);

    let msgInsert;
    try {
      await ExeDB.insert('', val);
    } catch (error) {
      if (error instanceof Error) {
        msgInsert = error.message;
      }
    }

    let msgSelect;
    try {
      await ExeDB.select('');
    } catch (error) {
      if (error instanceof Error) {
        msgSelect = error.message;
      }
    }

    let msgUpdate;
    try {
      await ExeDB.update('', val);
    } catch (error) {
      if (error instanceof Error) {
        msgUpdate = error.message;
      }
    }

    let msgDelete;
    try {
      await ExeDB.remove('');
    } catch (error) {
      if (error instanceof Error) {
        msgDelete = error.message;
      }
    }

    expect(msgInsert).toBe('FROM clause not found');
    expect(msgSelect).toBe('FROM clause not found');
    expect(msgUpdate).toBe('FROM clause not found');
    expect(msgDelete).toBe('FROM clause not found');
  });
  it('VALUES not found', async () => {
    const val: Map<string, string | number | boolean | Date | null> = new Map<
      string,
      string | number | boolean | Date | null
    >();

    let msgInsert;
    try {
      await ExeDB.insert(SchemeDB.PF_TESTING_1.name, val);
    } catch (error) {
      if (error instanceof Error) {
        msgInsert = error.message;
      }
    }

    let msgUpdate;
    try {
      await ExeDB.update(SchemeDB.PF_TESTING_1.name, val);
    } catch (error) {
      if (error instanceof Error) {
        msgUpdate = error.message;
      }
    }

    expect(msgInsert).toBe('VALUES not found');
    expect(msgUpdate).toBe('VALUES not found');
  });
  it('COLUMNS and/or VALUES not found', async () => {
    const val: Map<string, string | number | boolean | Date | null> = new Map<
      string,
      string | number | boolean | Date | null
    >();
    val.set('', 'TEST');

    let msgInsert;
    try {
      await ExeDB.insert(SchemeDB.PF_TESTING_1.name, val);
    } catch (error) {
      if (error instanceof Error) {
        msgInsert = error.message;
      }
    }

    let msgUpdate;
    try {
      await ExeDB.update(SchemeDB.PF_TESTING_1.name, val);
    } catch (error) {
      if (error instanceof Error) {
        msgUpdate = error.message;
      }
    }

    expect(msgInsert).toBe('COLUMNS and/or VALUES not found');
    expect(msgUpdate).toBe('COLUMNS and/or VALUES not found');
  });
});
