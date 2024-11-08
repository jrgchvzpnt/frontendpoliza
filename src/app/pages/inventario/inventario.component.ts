import { Component, OnInit, ViewChild } from '@angular/core';
import { Inventario } from '../../Model/inventario';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from '../../material/material.module';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InventarioService } from '../../services/inventario.service';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [MaterialModule, RouterOutlet, RouterLink],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export class InventarioComponent  implements OnInit {
  
  dataSource = new MatTableDataSource<Inventario>([]);

  columnDefinitions = [
    { def: 'sku', label: 'sku', hide: true },
    { def: 'nombre', label: 'nombre', hide: false },
    { def: 'cantidad', label: 'cantidad', hide: false },
    { def: 'actions', label: 'actions', hide: false },
  
  ];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;

  constructor(
    private inventarioService: InventarioService,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}


  ngOnInit(): void {

    this.inventarioService.findAllInventario().subscribe((data) => {
      this.createTable(data);
    });
  
    this.inventarioService.getInventarioChange().subscribe((data) => {
      this.createTable(data);
    });
  
    this.inventarioService.getMessageChange().subscribe((data) => {
      this._snackBar.open(data, 'INFO', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
      });
    });
  }

  delete(sku: number) {
    this.inventarioService.delete(sku).subscribe({
      next: () => {
        this.inventarioService.findAllInventario().subscribe((data) => {
          this.inventarioService.setInventarioChange(data);
          this.inventarioService.setMessageChange('Empleado eliminado correctamente.');
        });
      },
      error: (error) => {
        // Maneja el error aquí y muestra el mensaje desde el backend
        const mensajeError = error?.error?.Data?.Mensaje || 'Ocurrió un error al eliminar el inventario.';
        this._snackBar.open(mensajeError, 'ERROR', {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
        });
      },
    });
  }

  createTable(data: Inventario[]) {
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
