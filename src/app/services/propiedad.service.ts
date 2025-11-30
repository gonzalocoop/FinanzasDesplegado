import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Propiedad } from '../models/Propiedad';
import { Observable } from 'rxjs';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class PropiedadService {
  private url = `${base_url}/propiedad`; 

  constructor(private http: HttpClient) { }

 
  insert(p: Propiedad): Observable<Propiedad> {
    return this.http.post<Propiedad>(this.url, p);
  }

 
  list(): Observable<Propiedad[]> {
    return this.http.get<Propiedad[]>(this.url);
  }
  
  listId(id: number): Observable<Propiedad> {
    return this.http.get<Propiedad>(`${this.url}/${id}`);
  }

  update(p: Propiedad): Observable<Propiedad> {
   
    return this.http.put<Propiedad>(this.url, p); 
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}