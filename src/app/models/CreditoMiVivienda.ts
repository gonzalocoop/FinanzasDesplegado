import { Propiedad } from "./Propiedad";
import { Usuarios } from "./Usuarios";
import { PrecioCorrespondiente } from "./PrecioCorrespondiente";

export class CreditoMiVivienda {
  id_credito: number = 0;
  fecha_inicio: Date = new Date();
  fecha_fin: Date = new Date();
  tipo_tasa: string = "";
  tasa_interes: number = 0;
  peridiocidad_tasa: string = "";
  tipo_capitalizacion: string | null = null;
  m_numero_capitalizaciones: number = 0;
  n_numero_periodos: number = 0;
  tem_requerido: number = 0;
  tea: number = 0;
  tcea: number = 0;
  tipo_gracia: string = "";
  duracion_gracia_meses: number = 0;
  numero_cuotas: number = 0;
  cuota_inicial: number = 0;
  saldo_inicial: number = 0;
  cok: number = 0;
  van: number = 0;
  tir: number = 0;
  
  // Relaciones
  propiedad: Propiedad = new Propiedad();
  usuario: Usuarios = new Usuarios();
  preciocorrespondiente: PrecioCorrespondiente = new PrecioCorrespondiente();
}