import { Domain as DomainError } from '../error/domain.error';

export class Medicament {
  static async getJsonList(
    ls: Medicament[],
    startDate: Date | undefined = undefined,
    endDate: Date | undefined = undefined
  ) {
    return await Promise.all(
      ls.map((l: Medicament) => {
        return l.getJson(startDate, endDate);
      })
    );
  }
  private _id!: number;
  private _name!: string;
  private _unitsByDay!: number;
  private _unitsByBox!: number;
  private _availableUnits!: number;
  private _lastUpdate!: Date;
  constructor(
    id: number,
    name: string,
    unitsByDay: number,
    unitsByBox: number,
    availableUnits: number,
    lastUpdate: Date | undefined = undefined
  ) {
    this.id = id;
    this.name = name;
    this.unitsByDay = unitsByDay;
    this.unitsByBox = unitsByBox;
    this.availableUnits = availableUnits;
    this.lastUpdate = lastUpdate;
  }
  public get id(): number {
    return this._id;
  }
  public set id(value: number) {
    this._id = value;
  }
  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    if (value.trim() === '') {
      throw new DomainError('Name is empty');
    }
    this._name = value.trim();
  }
  public get unitsByDay(): number {
    return this._unitsByDay;
  }
  public set unitsByDay(value: number) {
    if (value <= 0) {
      throw new DomainError('Number of units by day is invalid');
    }
    this._unitsByDay = value;
  }
  public get unitsByBox(): number {
    return this._unitsByBox;
  }
  public set unitsByBox(value: number) {
    if (value <= 0) {
      throw new DomainError('Number of units by box is invalid');
    }
    this._unitsByBox = value;
  }
  public get availableUnits(): number {
    return this._availableUnits;
  }
  public set availableUnits(value: number) {
    if (value <= 0) {
      throw new DomainError('Number of available units is invalid');
    }
    this._availableUnits = value;
  }
  public get lastUpdate(): Date {
    return this._lastUpdate;
  }
  public set lastUpdate(value: Date | undefined) {
    if (!value) {
      value = new Date();
    }
    this._lastUpdate = new Date(
      value.getFullYear(),
      value.getMonth(),
      value.getDate(),
      0,
      0,
      0,
      0
    );
  }
  public nextSupplies(
    startDate: Date | undefined = undefined,
    endDate: Date | undefined = undefined
  ): Date[] {
    if (!startDate) {
      startDate = new Date();
      startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    }
    if (!endDate) {
      endDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        startDate.getDate() - 1
      );
    }
    startDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
      0,
      0,
      0,
      0
    );
    endDate = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate(),
      0,
      0,
      0,
      0
    );
    if (endDate < startDate) {
      throw new DomainError('Range end date is before than range start date');
    }

    let current = this.lastUpdate;
    const result: Date[] = [];
    while (current <= endDate) {
      if (current === this.lastUpdate) {
        current = new Date(
          current.getFullYear(),
          current.getMonth(),
          current.getDate() + this.availableUnits
        );
      } else {
        current = new Date(
          current.getFullYear(),
          current.getMonth(),
          current.getDate() + this.unitsByBox
        );
      }
      if (current >= startDate && current <= endDate) {
        result.push(current);
      }
    }
    return result;
  }
  public getJson(
    startDate: Date | undefined = undefined,
    endDate: Date | undefined = undefined
  ) {
    return {
      id: this.id,
      name: this.name,
      unitsByDay: this.unitsByDay,
      unitsByBox: this.unitsByBox,
      availableUnits: this.availableUnits,
      nextSupplies: this.nextSupplies(startDate, endDate),
      lastUpdate: this.lastUpdate
    };
  }
}
