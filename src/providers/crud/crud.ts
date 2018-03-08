import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { SERVER_URL } from "../../config";
import 'rxjs/Rx';


@Injectable()
export class CrudProvider {

  http: any;
  headers: any;

  /**
   * @param http
   */
  constructor(
    http: Http
  ) {
    this.http = http;
    this.headers = new Headers();
    this.headers.append('enctype', 'multipart/form-data');
    this.headers.append('Accept', 'application/json');
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    this.headers.append("Access-Control-Allow-Origin","*");
    this.headers.append("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
  }

  /**
   * get method
   * @param link
   */
  getIndex(link, token) {
    //console.log(`${SERVER_URL}` + link + 'token=' + token);

    return this.http.get(`${SERVER_URL}` + link  + 'token=' + token)
      .map(res => res.json());
  }

  /**
   * post method
   * @param link
   * @param body
   * @returns {Observable<R>}
   */
  create(link, body, token) {
    let options = new RequestOptions({
      headers: this.headers
    });

    return this.http.post(`${SERVER_URL}` + link + '?token=' + token, body, options)
      .map(res => res.json());
  }

  /**
   * post method
   * @param link
   * @param body
   * @returns {Observable<R>}
   */
  public signUp(link, body) {
    let options = new RequestOptions({
      headers: this.headers
    });

    return this.http.post(`${SERVER_URL}` + link, body, options)
      .map(res => res.json());
  }

  /**
   * method put
   * @param link
   * @param body
   */
  update(link, body, token) {
    let options = new RequestOptions({
      headers: this.headers
    });

    console.log(`${SERVER_URL}` + link + '?token=' + token);

    return this.http.put(`${SERVER_URL}` + link + '?token=' + token, body, options)
      .map(res => res.json());
  }

  /**
   * @param link
   * @param token
   */
  delete(link, token) {
    let options = new RequestOptions({
      headers: this.headers
    });

    return this.http.delete(`${SERVER_URL}` + link +'?token=' + token, options)
      .map(res => res.json());
  }

  /**
   * @param link
   * @param token
   * @param body
   */
  deleteImg(link, token, body) {
    let options = new RequestOptions({
      headers: this.headers
    });

    return this.http.post(`${SERVER_URL}` + link +'?token=' + token, body, options)
      .map(res => res.json());
  }
}
