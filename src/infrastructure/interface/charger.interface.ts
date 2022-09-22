import { Medicament as MedicamentModel } from '../../domain/model/medicament.model';

export interface Charger {
  getMedicaments(): Promise<MedicamentModel[]>;
}
