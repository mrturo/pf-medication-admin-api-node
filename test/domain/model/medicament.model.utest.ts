import { Domain as DomainError } from '../../../src/domain/error/domain.error';
import { Medicament as MedicamentModel } from '../../../src/domain/model/medicament.model';

describe('Suit to class Medicament', () => {
  it('Happy Path', async () => {
    let lastUpdate = new Date();
    lastUpdate = new Date(
      lastUpdate.getFullYear(),
      lastUpdate.getMonth(),
      lastUpdate.getDate(),
      0,
      0,
      0,
      0
    );
    const m: MedicamentModel = new MedicamentModel(1, 'TEST', 1, 30, 10);
    const expectedResult = {
      id: 1,
      name: 'TEST',
      unitsByDay: 1,
      unitsByBox: 30,
      availableUnits: 10,
      nextSupplies: [],
      lastUpdate: lastUpdate
    };
    expect(m.getJson()).toEqual(expectedResult);
    expect(await MedicamentModel.getJsonList([m])).toEqual([expectedResult]);
  });
  it('Happy Path - Getting next supplies', async () => {
    const lastUpdate = new Date(2022, 8, 22, 0, 0, 0, 0);
    const m: MedicamentModel = new MedicamentModel(
      1,
      'TEST',
      1,
      30,
      10,
      lastUpdate
    );
    const expectedResult = {
      id: 1,
      name: 'TEST',
      unitsByDay: 1,
      unitsByBox: 30,
      availableUnits: 10,
      nextSupplies: [
        new Date(2022, 9, 2, 0, 0, 0, 0),
        new Date(2022, 10, 1, 0, 0, 0, 0),
        new Date(2022, 11, 1, 0, 0, 0, 0),
        new Date(2022, 11, 31, 0, 0, 0, 0)
      ],
      lastUpdate: lastUpdate
    };
    expect(
      m.getJson(
        new Date(2022, 7, 1, 0, 0, 0, 0),
        new Date(2022, 11, 31, 0, 0, 0, 0)
      )
    ).toEqual(expectedResult);
  });
  it('Name is empty', async () => {
    const t = () => {
      new MedicamentModel(1, '', 1, 1, 1);
    };
    expect(t).toThrow(DomainError);
  });
  it('Number of units by day is empty', async () => {
    const t = () => {
      new MedicamentModel(1, 'TEST', 0, 1, 1);
    };
    expect(t).toThrow(DomainError);
  });
  it('Number of units by box is empty', async () => {
    const t = () => {
      new MedicamentModel(1, 'TEST', 1, 0, 1);
    };
    expect(t).toThrow(DomainError);
  });
  it('Number of available units is empty', async () => {
    const t = () => {
      new MedicamentModel(1, 'TEST', 1, 1, 0);
    };
    expect(t).toThrow(DomainError);
  });
  it('Range end date is before than range start date', async () => {
    const m: MedicamentModel = new MedicamentModel(1, 'TEST', 1, 1, 1);
    const t = () => {
      m.nextSupplies(new Date(2022, 3, 5), new Date(2022, 3, 4));
    };
    expect(t).toThrow(DomainError);
  });
});
