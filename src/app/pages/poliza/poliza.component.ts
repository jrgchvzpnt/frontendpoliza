import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { Inventario } from '../../Model/inventario';
import { EmpleadoService } from '../../services/empleado.service';
import { Empleado } from '../../Model/empleado';
import { InventarioService } from '../../services/inventario.service';
import { Poliza } from '../../Model/poliza';
import { format, formatISO } from 'date-fns';
import { PolizaService } from '../../services/poliza.services';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-poliza',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, NgClass, CommonModule],
  templateUrl: './poliza.component.html',
  styleUrl: './poliza.component.css'
})
export class PolizaComponent  implements OnInit {

  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  empleado: Empleado[] = [];
  inventario: Inventario[] = [];
  minDate: Date = new Date();

  constructor(
    private formBuilder: FormBuilder,
    private empleadoService: EmpleadoService,
    private inventarioService: InventarioService,
    private polizaService: PolizaService,
    private _snackBar: MatSnackBar

    ){}


  ngOnInit(): void {
    this.firstFormGroup = this.formBuilder.group({
      idPoliza: ['', Validators.required],
      cantidad: ['', Validators.required],
      empleadoGenero: ['', Validators.required],
      inventario: ['',Validators.required],
      fecha: [new FormControl(new Date()), Validators.required]
    });
    this.loadInitialData();

  }

  save(){
      const poliza = new Poliza();
      poliza.idPoliza = this.firstFormGroup.value['idPoliza'];
      poliza.cantidad = this.firstFormGroup.value['cantidad'];
      poliza.empleadoGenero = this.firstFormGroup.value['empleadoGenero'];
      poliza.inventario = this.firstFormGroup.value['inventario'] ;
      poliza.fecha =  format(this.firstFormGroup.value['fecha'], "yyyy-MM-dd");

      this.polizaService.save(poliza).subscribe({
        next: (data) => {
          this._snackBar.open('Poliza guardada exitosamente!', 'Cerrar', {
            duration: 3000,
            verticalPosition: 'top',
          });
        },
        error: (error) => {
            // Maneja el error aquí y muestra el mensaje desde el backend
            const mensajeError = error?.error?.Data?.Mensaje || 'Ocurrió un error al guardar la poliza.';
            this._snackBar.open(mensajeError, 'ERROR', {
              duration: 7000,
              verticalPosition: 'top',
              horizontalPosition: 'right',
            });
          }
      });

  }

  loadInitialData(){
    this.empleadoService.findAllEmpleado().subscribe(data => this.empleado = data);
    this.inventarioService.findAllInventario().subscribe(data => this.inventario = data);

  }
  getDate(e: any){
    console.log(e.value);
  }

}
