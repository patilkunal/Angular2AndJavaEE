/**
 *    Copyright 2016 Sven Loesekann

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */
import { Injectable } from '@angular/core';
import {Http, Response, RequestOptionsArgs, Headers} from '@angular/http';
import {CrTableRow, CrDetail} from './crTypes';
import {Observable}     from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/throw';
import { environment } from '../environments/environment';

@Injectable()
export class CrRestService {

  private _crTableUrlProd = 'rest/model/crTable/mietNr/{mietNr}';  // URL to web api
  private _crDetailUrlProd = 'rest/model/crDetail/mietNr/{mietNr}/jahr/{jahr}';
  private _crTableUrlDev = 'http://localhost:8080/carrental-web/rest/model/crTable/mietNr/{mietNr}';  // URL to web api
  private _crDetailUrlDev = 'http://localhost:8080/carrental-web/rest/model/crDetail/mietNr/{mietNr}/jahr/{jahr}';    
  private _reqOptionsArgs: RequestOptionsArgs = {headers: new Headers()};
    
  constructor(private http: Http) {
    this._reqOptionsArgs.headers.set('Content-Type', 'application/json');       
  }
    
  getCrTableRows(policeNr: string) {
    let url = environment.production ? this._crTableUrlProd : this._crTableUrlDev;
    url = url.replace("{mietNr}",policeNr);      
    return this.http.get(url, this._reqOptionsArgs).map(res => this.unpackTableResponse(res)).catch(this.handleError);    
  }
   
  getCrDetail(policeNr: string, jahr: string) {
    let url = environment.production ? this._crDetailUrlProd : this._crDetailUrlDev;
    url = url.replace("{mietNr}", policeNr).replace("{jahr}", jahr);
    return this.http.get(url, this._reqOptionsArgs).map(res => this.unpackDetailResponse(res)).catch(this.handleError);
  }
    
  private unpackTableResponse(res: Response): CrTableRow[] {
    //console.log(res);     
    return <CrTableRow[]>res.json();
  }
  
  private unpackDetailResponse(res: Response): CrDetail {
      //console.log(res);     
    return <CrDetail>res.json();
  }
    
  private handleError(error: Response) {
    // in a real world app, we may send the error to some remote logging infrastructure
    // instead of just logging it to the console
    console.error(JSON.stringify(error));  
    return Observable.throw(error);
  }
}
