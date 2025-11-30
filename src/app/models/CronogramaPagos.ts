import { CreditoMiVivienda } from "./CreditoMiVivienda";

export class CronogramaPagos {
  id_cronograma: number = 0;
  numero_cuota: number = 0;
  fecha_cuota: Date = new Date();
  cuota_fija: number = 0;
  interes_cuota: number = 0;
  amortizacion_cuota: number = 0;
  seguro_desgravamen: number = 0;
  seguro_bien: number = 0;
  saldo_restante: number = 0;
  credito: CreditoMiVivienda = new CreditoMiVivienda();
}