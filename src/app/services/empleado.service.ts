import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Empleado } from '../Model/empleado';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MedicService extends GenericService<Empleado> {

  private empleadoChange: Subject<Empleado[]> = new Subject<Empleado[]>();
  private messageChange: Subject<string> = new Subject<string>();



  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/api/empleados`);
  }

  setMedicChange(data: Empleado[]) {
    this.empleadoChange.next(data);
  }

  getMedicChange() {
    return this.empleadoChange.asObservable();
  }

  setMessageChange(data: string) {
    this.messageChange.next(data);
  }

  getMessageChange() {
    return this.messageChange.asObservable();
  }
}
