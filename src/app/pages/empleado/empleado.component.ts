import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmpleadoService } from '../../services/empleado.service';
import { MatTableDataSource } from '@angular/material/table';
import { Empleado } from '../../Model/empleado';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-empleado',
  standalone: true,
  imports: [MaterialModule, RouterOutlet, RouterLink],
  templateUrl: './empleado.component.html',
  styleUrl: './empleado.component.css'
})
export class EmpleadoComponent implements OnInit  {

  dataSource = new MatTableDataSource<Empleado>([]);

  columnDefinitions = [
    { def: 'idEmpleado', label: 'idEmpleado', hide: true },
    { def: 'nombre', label: 'nombre', hide: false },
    { def: 'apellido', label: 'apellido', hide: false },
    { def: 'puesto', label: 'puesto', hide: false },
    { def: 'actions', label: 'actions', hide: false },
  
  ];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;


  constructor(
    private empleadoService: EmpleadoService,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}



  ngOnInit(): void {
    this.empleadoService.findAllEmpleado().subscribe((data) => {
      this.createTable(data);
    });
  
    this.empleadoService.getEmpleadoChange().subscribe((data) => {
      this.createTable(data);
    });
  
    this.empleadoService.getMessageChange().subscribe((data) => {
      this._snackBar.open(data, 'INFO', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
      });
    });
  }

 


delete(idEmpleado: number) {
  this.empleadoService.delete(idEmpleado).subscribe({
    next: () => {
      this.empleadoService.findAllEmpleado().subscribe((data) => {
        this.empleadoService.setEmpleadoChange(data);
        this.empleadoService.setMessageChange('Empleado eliminado correctamente.');
      });
    },
    error: (error) => {
      // Maneja el error aquí y muestra el mensaje desde el backend
      const mensajeError = error?.error?.Data?.Mensaje || 'Ocurrió un error al eliminar el empleado.';
      this._snackBar.open(mensajeError, 'ERROR', {
        duration: 5000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
      });
    },
  });
}


  createTable(data: Empleado[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  getDisplayedColumns(): string[] {
    return this.columnDefinitions.filter((cd) => !cd.hide).map((cd) => cd.def);
  }

  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim();
  }

  checkchildren(){
    return this.route.children.length > 0;
  }


  

}
