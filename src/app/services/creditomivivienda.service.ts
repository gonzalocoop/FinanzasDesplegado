import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CreditoMiVivienda } from '../models/CreditoMiVivienda';
import { Observable } from 'rxjs';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class CreditomiviviendaService {
  private url = `${base_url}/creditomivivienda`;

  constructor(private http: HttpClient) { }

  
  registrarCreditoMiVivienda(
    creditoData: any, 
    idPrecioCorrespondiente: number,
    idUsuario: number
  ): Observable<any> { 
    
    let params = new HttpParams()
      .set('cok', creditoData.cok)
      .set('fechaInicio', creditoData.fecha_inicio)
      .set('tipoTasa', creditoData.tipo_tasa)
      .set('tasaInteres', creditoData.tasa_interes)
      .set('periodicidadTasa', creditoData.peridiocidad_tasa)
      .set('numeroCuotas', creditoData.numero_cuotas)
      .set('tipoGracia', creditoData.tipo_gracia)
      .set('duracionGraciaMeses', creditoData.duracion_gracia_meses)
      .set('tipoCapitalizacion', creditoData.tipo_capitalizacion)
      .set('idPrecioCorrespondiente', idPrecioCorrespondiente.toString())
      .set('idUsuario', idUsuario.toString());

    // IMPORTANTE: responseType: 'text'
    return this.http.post(`${this.url}/generarcreditovacio`, null, { params: params, responseType: 'text' });
  }
  
  // --- LISTAR Y CRUD (Estándar, esperan JSON) ---
  list(): Observable<CreditoMiVivienda[]> {
    return this.http.get<CreditoMiVivienda[]>(this.url);
  }
  
  listId(id: number): Observable<CreditoMiVivienda> {
    return this.http.get<CreditoMiVivienda>(`${this.url}/${id}`);
  }

  update(c: CreditoMiVivienda): Observable<CreditoMiVivienda> {
    return this.http.put<CreditoMiVivienda>(this.url, c);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }

 
  generarTEM(id_credito: number): Observable<any> {
    let params = new HttpParams().set('id_credito', id_credito.toString());
    return this.http.post(`${this.url}/generartem`, null, { params: params, responseType: 'text' });
  }
  
  // 2. Generar Cronograma
  generarCronograma(id_credito: number): Observable<any> {
    let params = new HttpParams().set('id_credito', id_credito.toString());
    return this.http.post(`${this.url}/generarcronograma`, null, { params: params, responseType: 'text' });
  }
  
  // 3. Calcular VAN y TIR
  calcularVanTir(id_credito: number): Observable<any> {
    let params = new HttpParams().set('id_credito', id_credito.toString());
    return this.http.post(`${this.url}/calcularvanytir`, null, { params: params, responseType: 'text' });
  }
  
  // 4. Calcular TEA y TCEA
  convertirTasasAnuales(id_credito: number): Observable<any> {
    let params = new HttpParams().set('id_credito', id_credito.toString());
    return this.http.put(`${this.url}/calcularteatcea`, null, { params: params, responseType: 'text' });
  }
}