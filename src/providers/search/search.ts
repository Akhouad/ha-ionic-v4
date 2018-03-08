import { Injectable } from '@angular/core';
import { Http , Headers} from '@angular/http';
import {SERVER_URL} from "../../config";
import 'rxjs/add/operator/map';

import {GlobalVars} from '../../pages/common/globalVars';
@Injectable()
export class SearchProvider {

  http: any;
  headers: any;
  private token: any;

  constructor(
    http: Http
  ) {
    this.http = http;
    this.headers = new Headers({ 'Content-Type': 'application/json' });
    this.token = GlobalVars.profile.token;
  }

  /**
   * get contacts method
   * @param link
   */
  getContacts(link) {
    //console.log(`${SERVER_URL}` + link  + 'token=' + this.token);

    return this.http.get(`${SERVER_URL}` + link  + '&token=' + this.token)
      .map(res => res.json());
  }

  /**
   * global search method
   * @param link
   */
  globalSearch(link) {
    console.log(`${SERVER_URL}` + link  + 'token=' + this.token);

    return this.http.get(`${SERVER_URL}` + link  + '&token=' + this.token)
      .map(res => res.json());
  }

}
