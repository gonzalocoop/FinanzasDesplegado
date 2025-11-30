
import { Roles } from "./Roles" 

export class Usuarios {
  id_usuario: number = 0;
  username: string = "";
  password: string = "";
  correo: string = ""; 
  nombre_cliente: string = ""; 
  dni: string = ""; 
  ingreso_mensual: number = 0; 
  estado_civil: string = ""; 
  edad: number = 0; 
  activo: boolean = true;
  rol: Roles = new Roles();
}