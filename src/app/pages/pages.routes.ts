import { Routes } from '@angular/router';
import { EmpleadoComponent } from './empleado/empleado.component';
import { EmpleadoEditComponent } from './empleado/empleado-edit/empleado-edit.component';
import { InventarioComponent } from './inventario/inventario.component';
import { InventarioEditComponent } from './inventario/inventario-edit/inventario-edit.component';
import { PolizaComponent } from './poliza/poliza.component';
import { SearchComponent } from './search/search.component';


export const pageRoutes: Routes = [
  {
    path: 'search', component: SearchComponent,
  },
  {
    path: 'empleado',
    component: EmpleadoComponent,
    children: [
      { path: 'new', component: EmpleadoEditComponent },
      { path: 'edit/:id', component: EmpleadoEditComponent },
    ],
  },
  {
    path: 'inventario', component: InventarioComponent,
    children: [
      { path: 'new', component: InventarioEditComponent },
      { path: 'edit/:id', component: InventarioEditComponent },
    ]
  },
  {
    path: 'poliza', component: PolizaComponent,
  }
];
