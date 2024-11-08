import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InventarioService } from '../../../services/inventario.service';
import { switchMap } from 'rxjs';
import { Inventario } from '../../../Model/inventario';

@Component({
  selector: 'app-inventario-edit',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, RouterLink],
  templateUrl: './inventario-edit.component.html',
  styleUrl: './inventario-edit.component.css'
})
export class InventarioEditComponent implements OnInit {

  form!: FormGroup;
  id!: number;
  isEdit!: boolean;

  constructor(
    private route:ActivatedRoute,
    private router: Router,
    private inventarioService: InventarioService
  ){}

  ngOnInit(): void {
    this.form = new FormGroup({
      sku: new FormControl(0),
      nombre: new FormControl('', [Validators.required, Validators.minLength(3)] ),
      cantidad: new FormControl('', [Validators.required, Validators.minLength(1)] ),
    });

    this.route.params.subscribe((data) => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    });
  }

  initForm(){
    if (this.isEdit) {
      this.inventarioService.findByIdInventario(this.id).subscribe((data) => {
        this.form = new FormGroup({
          sku: new FormControl(data.sku,[Validators.required, Validators.minLength(3)]),
          nombre: new FormControl(data.nombre, [Validators.required, Validators.minLength(3)]),
          cantidad: new FormControl(data.cantidad, [Validators.required, Validators.minLength(1)]),
        });
      });
    }
  }

  operate() {
    if (this.form.invalid) { return;}

    const inventario: Inventario = new Inventario();
    inventario.sku = this.form.value['sku'];
    inventario.nombre = this.form.value['nombre'];
    inventario.cantidad = this.form.value['cantidad'];


    console.log("Empleado ID: " +  inventario.sku);


    if (this.isEdit) {
      //UPDATE
      this.inventarioService.update(this.id, inventario).subscribe(() => {
        this.inventarioService.findAllInventario().subscribe((data) => {
         this.inventarioService.setInventarioChange(data);
          this.inventarioService.setMessageChange('UPDATED!');
        });
      });
    } else {
      //INSERT
      this.inventarioService
        .save(inventario)
        .pipe(switchMap(() => this.inventarioService.findAllInventario()))
        .subscribe((data) => {
          this.inventarioService.setInventarioChange(data);
          this.inventarioService.setMessageChange('CREATED!');
        });
    }
    this.router.navigate(['/pages/inventario']);

  }



  get f(){
    return this.form.controls;
  }

}
