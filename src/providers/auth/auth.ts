import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import {GlobalProvider} from "../global/global";
import {SERVER_URL} from "../../config";
import {CrudProvider} from "../crud/crud";

@Injectable()
export class AuthProvider {

  private baseUrl: string;
  private headers: any;

  constructor(
    public http: Http,
    public globalService: GlobalProvider,
    public crudProvider: CrudProvider,
  ) {
    this.baseUrl = `${SERVER_URL}`;
    this.headers = new Headers({ 'Content-Type': 'application/json' });
  }

  /**
   * @param email
   * @param password
   * @return {Observable<any>}
   */
  login(email, password){
      let data = {
        email: email,
        password: password,
        meta: this.globalService.getMeta()
      };
      return this.http.post(this.baseUrl + 'authenticate', data, { headers: this.headers })
        .map(res => {
          // console.log(res);
          return res.json()
        });
  }

  /**
   *
   * @param email
   * @returns {Observable<R>}
   */
  public forgotPassword(email) {
    let data = {
      email: email
    };

    return this.http.post(this.baseUrl + 'forgot-password', data, { headers: this.headers })
      .map(res => {
        return res.json()
      })
  }

}
