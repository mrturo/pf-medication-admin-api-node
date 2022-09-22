import { Admin as AdminService } from '../../../src/application/service/admin.service';
import { ChargerMock as ChargerMockEmpty } from '../mock/charger.empty.mock';
import { ChargerMock as ChargerMockError } from '../mock/charger.error.mock';
import { ChargerMock } from '../mock/charger.mock';

describe('Suit to class Admin Service', () => {
  it('Happy Path', async () => {
    const admin: AdminService = new AdminService(new ChargerMock());
    const nextSupplies = await admin.getNextSupplies(
      new Date(2022, 8, 1),
      new Date(2022, 10, 0)
    );
    expect(nextSupplies).toEqual([
      {
        id: 1,
        name: 'A',
        unitsByDay: 1,
        unitsByBox: 30,
        availableUnits: 40,
        nextSupplies: [new Date(2022, 9, 30)],
        lastUpdate: new Date(2022, 8, 20)
      }
    ]);
  });
  it('Gettin medicaments', async () => {
    let msg = '';
    const admin: AdminService = new AdminService(new ChargerMockError());
    try {
      await admin.getNextSupplies();
    } catch (error) {
      if (error instanceof Error && error.message.trim() !== '') {
        msg = error.message.trim();
      }
    }
    expect(msg).toBe('Getting medicaments: Mock Error');
  });
  it('Gettin medicaments', async () => {
    const admin: AdminService = new AdminService(new ChargerMockEmpty());
    const nextSupplies = await admin.getNextSupplies();
    expect(nextSupplies).toEqual([]);
  });
  it('Not source', async () => {
    let msg = '';
    const admin: AdminService = new AdminService();
    try {
      await admin.getNextSupplies();
    } catch (error) {
      if (error instanceof Error && error.message.trim() !== '') {
        msg = error.message.trim();
      }
    }
    expect(msg).toBe('Getting medicaments: Invalid source');
  });
});
