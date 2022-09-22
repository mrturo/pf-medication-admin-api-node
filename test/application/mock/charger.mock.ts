import { Medicament as MedicamentModel } from '../../../src/domain/model/medicament.model';
import { Charger as ChargerInterface } from '../../../src/infrastructure/interface/charger.interface';

export class ChargerMock implements ChargerInterface {
  async getMedicaments(): Promise<MedicamentModel[]> {
    const lastUpdate = new Date(2022, 8, 20);
    const result: MedicamentModel[] = [];
    result.push(new MedicamentModel(1, 'A', 1, 30, 40, lastUpdate));
    result.push(new MedicamentModel(2, 'B', 1.5, 90, 74, lastUpdate));
    return result;
  }
}
