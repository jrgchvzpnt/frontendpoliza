import { Empleado } from "./empleado";
import { Inventario } from "./inventario";

export class Poliza{
  idPoliza: number = 0;
  cantidad: number = 0 ;
  empleadoGenero: {empleadoGenero : number} = {empleadoGenero: 0};
  inventario: {inventario: number} = {inventario: 0};
  fecha: string  = '';

}
