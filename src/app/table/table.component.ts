import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Characters, Results } from '../model/characters.request';
import { RequestService } from '../api/request.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['id', 'name', 'species', 'status'];
  dataSource = new MatTableDataSource<Results>();
  error: string;
  value: string;
  response: Results[] = [];
  empty = false;
  filtersState = {
    species: ''
  };
  private unsubscribe$ = new Subject<void>();
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.dataSource.sort  = ms;
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
      this.dataSource.paginator = mp;
  }

  constructor(
    private requestService: RequestService
    ) { }

  ngOnInit(): void {
    this.getAllCharacters();
  }

  getAllCharacters(): void{
    this.dataSource.data = [];
    for (let index = 1; index <= 34; index++) {
      this.requestService.getCharacter(index)
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(
        (characters: Characters) => {
          this.dataSource.data = [...this.dataSource.data, ...characters.results];
          this.response = [...this.response, ...characters.results];
        },
        err => {
          this.error = err.error && err.error.message ? err.error.message : 'Ha ocurrido un error';
          console.error(err);
        }
      );
    }
  }

  applyFilter(event: string): void {
    const filterValue = event.toLowerCase();
    if (!filterValue) {
      this.dataSource.filteredData = this.dataSource.data;
      this.dataSource.data = JSON.parse(JSON.stringify(this.response));
    }else{
      const filtered = this.response.filter(value => {
        const posicion = value.species.toLowerCase().indexOf(filterValue);
        if (posicion !== -1){
          return value;
        }
      });
      this.dataSource.filteredData = filtered;
      this.dataSource.data = JSON.parse(JSON.stringify(filtered));
      if (filtered.length > 0) {
        this.empty = false;
      }else {
        this.empty = true;
      }
    }
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearFilter(): void{
    this.empty = false;
    this.value = '';
    this.applyFilter('');
  }

  ngOnDestroy(): void{
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
  }
}
