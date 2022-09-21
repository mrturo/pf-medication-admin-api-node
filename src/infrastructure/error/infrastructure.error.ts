export class Infrastructure extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    Object.setPrototypeOf(this, Infrastructure.prototype);
  }
}
