import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Empleado } from '../Model/empleado';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmpleadoService extends GenericService<Empleado> {

  private empleadoChange: Subject<Empleado[]> = new Subject<Empleado[]>();
  private messageChange: Subject<string> = new Subject<string>();



  constructor(protected override http: HttpClient) {
    super(http, `http://localhost:8080/api/empleados`);
   // super(http, `${environment.HOST}/api/empleados`);
    //http://localhost:8080

  }
  
 
  setEmpleadoChange(data: Empleado[]) {
    this.empleadoChange.next(data);
  }

  getEmpleadoChange() {
    return this.empleadoChange.asObservable();
  }

  setMessageChange(data: string) {
    this.messageChange.next(data);
  }

  getMessageChange() {
    return this.messageChange.asObservable();
  }
}
