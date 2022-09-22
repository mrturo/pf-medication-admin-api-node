import { Application as ApplicationError } from '../../../src/application/error/application.error';
import { Medicament as MedicamentModel } from '../../../src/domain/model/medicament.model';
import { Charger as ChargerInterface } from '../../../src/infrastructure/interface/charger.interface';

export class ChargerMock implements ChargerInterface {
  async getMedicaments(): Promise<MedicamentModel[]> {
    throw new ApplicationError('Mock Error');
  }
}
