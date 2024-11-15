import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Poliza } from '../Model/poliza';
import { Injectable } from '@angular/core';
import { FilterConsultDTO } from '../Model/FilterConsultDTO';

@Injectable({
  providedIn: 'root',
})
export class PolizaService extends GenericService<Poliza> {

  private polizaChange: Subject<Poliza[]> = new Subject<Poliza[]>();
  private messageChange: Subject<string> = new Subject<string>();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/api/polizas`);
  }

  setPolizaChange(data: Poliza[]) {
    this.polizaChange.next(data);
  }

  getPolizaChange(): Observable<Poliza[]> {
    return this.polizaChange.asObservable();
  }

  setMessageChange(data: string) {
    this.messageChange.next(data);
  }

  getMessageChange(): Observable<string> {
    return this.messageChange.asObservable();
  }

  searchOthers(dto: FilterConsultDTO){
    return this.http.post<Poliza[]>(`${this.url}/search/others`, dto);
  }

  searchByDates(date1: string, date2: string){
    return this.http.get<Poliza[]>(`${this.url}/search/dates?date1=${date1}&date2=${date2}`);
  }




}
