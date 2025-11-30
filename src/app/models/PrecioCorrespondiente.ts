import { Propiedad } from "./Propiedad";
import { Moneda } from "./Moneda";
import { BonoBBP } from "./BonoBBP";

export class PrecioCorrespondiente {
  id_precio_correspondiente: number = 0;
  cuota_inicial: number = 0;
  precio_calculado: number = 0;
  costos_notariales: number = 0;
  registros_publicos: number = 0;
  costos_transaccion: number = 0;
  bono: BonoBBP = new BonoBBP();
  propiedad: Propiedad = new Propiedad();
  moneda: Moneda = new Moneda();
}