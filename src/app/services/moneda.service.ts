import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Moneda } from '../models/Moneda'; 
import { Observable } from 'rxjs';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class MonedaService {
  private url = `${base_url}/moneda`; 

  constructor(private http: HttpClient) { }

  list(): Observable<Moneda[]> {
    return this.http.get<Moneda[]>(this.url);
  }
}