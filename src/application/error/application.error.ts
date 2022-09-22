export class Application extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    Object.setPrototypeOf(this, Application.prototype);
  }
}
