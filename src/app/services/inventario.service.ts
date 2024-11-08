import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Subject } from 'rxjs';
import { Inventario } from '../Model/inventario';

@Injectable({
  providedIn: 'root',
})
export class InventarioService extends GenericService<Inventario> {

  private inventarioChange: Subject<Inventario[]> = new Subject<Inventario[]>();
  private messageChange: Subject<string> = new Subject<string>();



  constructor(protected override http: HttpClient) {
     super(http, `${environment.HOST}/api/inventario`);
    

  }
  
 
  setInventarioChange(data: Inventario[]) {
    this.inventarioChange.next(data);
  }

  getInventarioChange() {
    return this.inventarioChange.asObservable();
  }

  setMessageChange(data: string) {
    this.messageChange.next(data);
  }

  getMessageChange() {
    return this.messageChange.asObservable();
  }
}
