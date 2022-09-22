import { Admin as AdminService } from './application/service/admin.service';
import { Medicament as MedicamentModel } from './domain/model/medicament.model';

async function run() {
  const fromDate: Date = new Date(2022, 8, 1);
  const toDate: Date = new Date(
    fromDate.getFullYear(),
    fromDate.getMonth() + 2,
    0
  );

  const medicaments: MedicamentModel[] = [];
  medicaments.push(
    new MedicamentModel(1, 'LEVIA', 1, 30, 37, new Date(2022, 8, 23))
  );
  medicaments.push(
    new MedicamentModel(3, 'OMEGA-3', 2, 90, 153, new Date(2022, 8, 23))
  );
  medicaments.push(
    new MedicamentModel(7, 'MULTIVITAMIN', 1, 100, 107, new Date(2022, 8, 23))
  );
  medicaments.push(
    new MedicamentModel(4, 'RED YEAST RICE', 1, 120, 97, new Date(2022, 8, 23))
  );
  medicaments.push(
    new MedicamentModel(5, 'ATORVASTATINA', 1, 30, 53, new Date(2022, 8, 23))
  );
  medicaments.push(
    new MedicamentModel(6, 'EZETIMIBA', 1, 28, 61, new Date(2022, 8, 23))
  );
  medicaments.push(
    new MedicamentModel(7, 'ESCITALOPRAM', 1.5, 90, 67.5, new Date(2022, 8, 23))
  );

  const admin: AdminService = new AdminService();
  console.log(await admin.getNextSupplies(fromDate, toDate, medicaments));
}

run();
