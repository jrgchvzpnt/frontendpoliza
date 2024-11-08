import { HttpClient } from '@angular/common/http';
import { provideHttpClient, withFetch } from "@angular/common/http";
import { Inject, Injectable } from '@angular/core';
import { Empleado } from '../Model/empleado';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GenericService<T> {
  constructor(
    protected http: HttpClient,
    @Inject('url') protected url: string
  ) {}



  findAllEmpleado() {
    return this.http.get<{ Data: { Empleados: T[] } }>(this.url).pipe(
      map(response => response.Data.Empleados)
    );
  }

  findAllInventario() {
    return this.http.get<{ Data: { Inventario: T[] } }>(this.url).pipe(
      map(response => response.Data.Inventario)
    );

  }
  findAllPoliza() {
    return this.http.get<{ Data: { Poliza: T, DetalleArticulo: any, Empleado: any } }>(this.url).pipe(
      map(response => {
        const { Poliza, DetalleArticulo, Empleado } = response.Data;
        return { poliza: Poliza, detalleArticulo: DetalleArticulo, empleado: Empleado };
      })
    );
  }

  findAllPolizas(): Observable<any> {
    return this.http.get<any>(`${this.url}`).pipe(
      map(response => response.Data)
    );
  }

  findById(id: number) {
    return this.http.get<{ Data: { Empleado: T } }>(`${this.url}/${id}`).pipe(
      map(response => response.Data.Empleado)
    );
  }

  findByIdInventario(id: number) {
    return this.http.get<{ Data: { Inventario: T } }>(`${this.url}/${id}`).pipe(
      map(response => response.Data.Inventario)
    );
  }

  save(t: T) {
    return this.http.post(this.url, t);
  }

  update(id: number, t: T) {
    return this.http.put(`${this.url}/${id}`, t);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
