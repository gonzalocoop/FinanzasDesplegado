import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { PrecioCorrespondiente } from '../models/PrecioCorrespondiente'; 

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class PreciocorrespondienteService {
  private url = `${base_url}/preciocorrespondiente`;

  constructor(private http: HttpClient) { }


  generarPrecioCorrespondiente(
    costos_notariales: number,
    registros_publicos: number,
    costos_transaccion: number,
    id_propiedad: number,
    id_moneda: number
  ): Observable<PrecioCorrespondiente> { 
    
  
    let params = new HttpParams()
      .set('costos_notariales', costos_notariales.toString())
      .set('registros_publicos', registros_publicos.toString())
      .set('costos_transaccion', costos_transaccion.toString())
    
      .set('idPropiedad', id_propiedad.toString()) 
      .set('idMoneda', id_moneda.toString()); 

    return this.http.post<PrecioCorrespondiente>(`${this.url}/generarpreciocorrespondiente`, null, { params: params });
  }
}