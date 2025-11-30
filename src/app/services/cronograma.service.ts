import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CronogramaPagos } from '../models/CronogramaPagos'; 
import { Observable } from 'rxjs';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class CronogramaService {
  private url = `${base_url}/cronogramapagos`; 

  constructor(private http: HttpClient) { }

  // Llama al endpoint /todoscronogramascredito
  getCronogramaPorCredito(id_credito: number): Observable<CronogramaPagos[]> {
    let params = new HttpParams().set('id_credito', id_credito.toString());
    // Llama al endpoint del backend que lista el cronograma
    return this.http.get<CronogramaPagos[]>(`${this.url}/todoscronogramascredito`, { params: params });
  }
}