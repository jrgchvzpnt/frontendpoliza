import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmpleadoService } from '../../../services/empleado.service';
import { Empleado } from '../../../Model/empleado';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-empleado-edit',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, RouterLink],
  templateUrl: './empleado-edit.component.html',
  styleUrl: './empleado-edit.component.css'
})
export class EmpleadoEditComponent  implements OnInit {
  form!: FormGroup;
  id!: number;
  isEdit!: boolean;
  
  constructor(
    private route:ActivatedRoute, 
    private router: Router,
    private empleadoService: EmpleadoService
  ){}
 
  
  ngOnInit(): void {
    this.form = new FormGroup({
      idEmpleado: new FormControl(0),
      nombre: new FormControl('', [Validators.required, Validators.minLength(3)] ),
      apellido: new FormControl('', [Validators.required, Validators.minLength(3)] ),
      puesto: new FormControl('', [Validators.required, Validators.minLength(3)] ),
    });

    this.route.params.subscribe((data) => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    });
  }

  initForm(){
    if (this.isEdit) {
      this.empleadoService.findById(this.id).subscribe((data) => {
        this.form = new FormGroup({
          idEmpleado: new FormControl(data.idEmpleado,[Validators.required, Validators.minLength(3)]),
          nombre: new FormControl(data.nombre, [Validators.required, Validators.minLength(3)]),
          apellido: new FormControl(data.apellido, [Validators.required, Validators.minLength(3)]),
          puesto: new FormControl(data.puesto, [Validators.required, Validators.minLength(3)]),
        });
      });
    }
  }

  operate() {
    if (this.form.invalid) { return;}

    const empleado: Empleado = new Empleado();
    empleado.idEmpleado = this.form.value['idEmpleado'];
    empleado.nombre = this.form.value['nombre'];
    empleado.apellido = this.form.value['apellido'];
    empleado.puesto = this.form.value['puesto'];

    console.log("Empleado ID: " +  empleado.idEmpleado);


    if (this.isEdit) {
      //UPDATE
      this.empleadoService.update(this.id, empleado).subscribe(() => {
        this.empleadoService.findAllEmpleado().subscribe((data) => {
         this.empleadoService.setEmpleadoChange(data);
          this.empleadoService.setMessageChange('UPDATED!');
        });
      });
    } else {
      //INSERT
      this.empleadoService
        .save(empleado)
        .pipe(switchMap(() => this.empleadoService.findAllEmpleado()))
        .subscribe((data) => {
          this.empleadoService.setEmpleadoChange(data);
          this.empleadoService.setMessageChange('CREATED!');
        });
    }
    this.router.navigate(['/pages/empleado']);

  }

  get f(){
    return this.form.controls;
  }
}
