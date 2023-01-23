export class STK500 {
  get resistor(): number {
    return this._resistor;
  }

  set resistor(value: number) {
    this._resistor = value;
  }

  private _resistor = 32;

  setResistorMin(): void {
    this._resistor = 32;
  }

  static factoryMethod(): STK500 {
    return new STK500();
  }
}
