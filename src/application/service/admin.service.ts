import { Medicament as MedicamentModel } from '../../domain/model/medicament.model';
import { Charger as ChargerInterface } from '../../infrastructure/interface/charger.interface';
import { Application as ApplicationError } from '../error/application.error';

export class Admin {
  private chargerService: ChargerInterface | undefined;
  constructor(chargerService: ChargerInterface | undefined = undefined) {
    this.chargerService = chargerService;
  }
  public async getNextSupplies(
    startDate: Date | undefined = undefined,
    endDate: Date | undefined = undefined,
    medicaments: MedicamentModel[] | undefined = undefined
  ) {
    if (!medicaments) {
      if (!this.chargerService) {
        throw new ApplicationError('Getting medicaments: Invalid source');
      } else {
        try {
          medicaments = await this.chargerService.getMedicaments();
        } catch (error) {
          let msg = '';
          if (error instanceof Error && error.message.trim() !== '') {
            msg = `: ${error.message.trim()}`;
          }
          throw new ApplicationError(`Getting medicaments${msg}`);
        }
      }
    }
    const jsonList = await MedicamentModel.getJsonList(
      medicaments,
      startDate,
      endDate
    );
    return jsonList.length === 0
      ? []
      : jsonList.filter((m) => m.nextSupplies.length > 0);
  }
}
