export class Domain extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    Object.setPrototypeOf(this, Domain.prototype);
  }
}
