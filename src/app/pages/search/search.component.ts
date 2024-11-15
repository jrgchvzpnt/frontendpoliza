import { Component, OnInit, ViewChild } from '@angular/core';
import { Poliza } from '../../Model/poliza';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MaterialModule } from '../../material/material.module';
import { DatePipe, LowerCasePipe, UpperCasePipe } from '@angular/common';
import { PolizaService } from '../../services/poliza.services';
import { MatDialog } from '@angular/material/dialog';
import { format } from 'date-fns';
import { FilterConsultDTO } from '../../Model/FilterConsultDTO';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, UpperCasePipe, LowerCasePipe, DatePipe],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent  implements OnInit {
  form!: FormGroup;
  dataSource!: MatTableDataSource<Poliza>;

  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns = ['idPoliza','cantidad','empleado', 'inventario', 'date'];


  constructor(
    private polizaService: PolizaService,
    private _dialog: MatDialog
  ){}

  ngOnInit(): void {
    this.form = new FormGroup({
     startDate: new FormControl(),
      endDate: new FormControl(),
    });
  }


  search(){

    //Option1
    const date1 = format(this.form.value['startDate'], "yyyy-MM-dd'T'HH:mm:ss");
    const date2 = format(this.form.value['endDate'], "yyyy-MM-dd'T'HH:mm:ss");

    this.polizaService.searchByDates(date1, date2).subscribe(data => this.createTable(data));



  }

  createTable(data: Poliza[]){
    console.log("Data del proceso:");
    console.log(data);
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }


}
