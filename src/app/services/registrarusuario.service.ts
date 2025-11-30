import { Injectable } from '@angular/core';
import { Usuarios } from '../models/Usuarios';
import { Roles } from '../models/Roles';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const base_url=environment.base
@Injectable({
  providedIn: 'root'
})
export class RegistrarusuarioService {

  private url=`${base_url}/registrarusuario`
  constructor(private http:HttpClient) { }
  
  listUsuarios(){
    const urll=`${this.url}/listarusuarios`
    return this.http.get<Usuarios[]>(urll)
  }


  insert(u:Usuarios){
    return this.http.post(this.url,u);
  }

  listRoles(){
    const urll=`${this.url}/listarroles`
    return this.http.get<Roles[]>(urll);
  }
}
