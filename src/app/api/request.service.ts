import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Characters } from '../model/characters.request';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(
    private http: HttpClient
  ) { }

  getCharacter(page): Observable<Characters> {
    return this.http.get<Characters>('https://rickandmortyapi.com/api/character/?page=' + page);
  }

}
