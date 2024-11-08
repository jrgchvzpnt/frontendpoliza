import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Poliza } from '../../Model/poliza';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PolizaService } from '../../services/poliza.services';

@Component({
  selector: 'app-poliza',
  standalone: true,
  imports: [MaterialModule, RouterOutlet, RouterLink],
  templateUrl: './poliza.component.html',
  styleUrl: './poliza.component.css'
})
export class PolizaComponent  implements OnInit {

  dataSource = new MatTableDataSource<Poliza>([]);

  columnDefinitions = [
    { def: 'idPoliza', label: 'ID Poliza', hide: false },
    { def: 'sku', label: 'SKU', hide: false },
    { def: 'nombreArticulo', label: 'Detalle Articulo', hide: false },
    { def: 'cantidad', label: 'Cantidad', hide: false },
    { def: 'empleado', label: 'Empleado', hide: false },
    { def: 'actions', label: 'Actions', hide: false }
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private polizaService: PolizaService,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.polizaService.findAllPolizas().subscribe({
      next: (data) => {
        const polizaArray = Array.isArray(data) ? data : [data];
        console.log("polizaArray: " + polizaArray);
        this.createTable(polizaArray);
      },
      error: (error) => {
        this._snackBar.open(
          'Error al cargar las pólizas. Inténtalo de nuevo más tarde.',
          'ERROR',
          {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
          }
        );
      }
    });
  }


  checkchildren(): boolean {
    return !this.dataSource || this.dataSource.data.length ===0;
  }


  delete(idPoliza: number) {
    this.polizaService.delete(idPoliza).subscribe({
      next: () => {
        this.polizaService.findAllPolizas().subscribe((data) => {
          this.createTable(data);
          this.polizaService.setMessageChange('Poliza eliminada correctamente.');
        });
      },
      error: (error) => {
        const mensajeError = error?.error?.Data?.Mensaje || 'Error al eliminar la poliza.';
        this._snackBar.open(mensajeError, 'ERROR', {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
        });
      },
    });
  }


  createTable(response: any) {
    if (response?.Data){

      const transformedData = response.map((item: any) => ({
        idPoliza: item.Data.Poliza.IDPoliza,
        nombreEmpleado: item.Data.Empleado.Nombre,
        apellidoEmpleado: item.Data.Empleado.Apellido,
        sku: item.Data.DetalleArticulo.SKU,
        nombreArticulo: item.Data.DetalleArticulo.Nombre,
        cantidad: item.Data.Poliza.Cantidad,
      }));
      this.dataSource = new MatTableDataSource(transformedData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    else
    {
      console.error('No se Encontraron datos en la respuesta .');
    }

  }

  getDisplayedColumns(): string[] {
    return this.columnDefinitions.filter((cd) => !cd.hide).map((cd) => cd.def);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
