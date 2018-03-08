import {LoadingController, Platform} from 'ionic-angular';
import { Injectable, EventEmitter } from "@angular/core";
import { Observable } from 'rxjs';
import { AlertController, ToastController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { Geolocation } from '@ionic-native/geolocation';

@Injectable()
export class GlobalProvider {
  public companies: boolean = false;
  private contactGroup: number = 0;
  private lastChecked: number = 0;
  private selectedContents = [];
  private selectedCategory = [];
  public updateContact: EventEmitter<number>;
  private position: any = {};
  private usertype: string = "";
  public company: any;
  public updateView: EventEmitter<any>;
  public logoutEvent: EventEmitter<any>;
  public preloader: EventEmitter<boolean>;
  public blindPreloader: EventEmitter<boolean>;
  public loginEvent: EventEmitter<any>;
  public user: { first_name, last_name, email, company, title } = {
    first_name: "",
    last_name: "",
    email: "",
    company: "",
    title: ""
  };
  
  public loading: any = null;
  // public loading = this.loadingCtrl.create({
  //   content: 'Loading Please Wait...',
  //   enableBackdropDismiss: true
  // });

  authenticated: boolean

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private platform: Platform,
    private geolocation: Geolocation,
    private network: Network,
    public loadingCtrl: LoadingController
  ) {
    this.authenticated = false
    this.logoutEvent = new EventEmitter();
    this.loginEvent = new EventEmitter();
    this.updateView = new EventEmitter();
    this.preloader = new EventEmitter<boolean>();
    this.blindPreloader = new EventEmitter<boolean>();
    this.updateContact = new EventEmitter<number>();
  }
  /**
   * @type {{first_name: string; last_name: string; company: string; address: string; notes: string; tags: string; website: string; company_public: string; photo: string; office_phone: string; mobile_phone: string; email_consent: string; job_title: string; middle_name: string; address1: string; country: string; city: string}}
   */
  public fieldNames: any = {
    "first_name": "First Name",
    "last_name": "Last Name",
    "company": "Company",
    "address": "Address",
    "notes": "Notes",
    "tags": "Tags",
    "website": "Website",
    "company_public": "Company",
    "photo": "Photo",
    "office_phone": "Office Phone №",
    "mobile_phone": "Mobile Phone №",
    "email_consent": "E-mail",
    "job_title": "Job Title",
    "middle_name": "Middle Name",
    "address1": "Address",
    "country": "Country",
    "city": "City"
  };

  /**
   * @param content
   */
  public addContent(content) {
    let found = false;
    this.selectedContents.forEach(_content => {
      if (content.id == _content.id) found = true;
    });
    if (!found) {
      let toPush = {};
      toPush['id'] = content['id'];
      toPush['applications'] = content['applications'];
      this.selectedContents.push(toPush);
    }
  }
  
  /**
   * normalizeFilename method
   *  1. Removes special characters
   *  2. Trims whitespaces
   *  3. Replaces whitespaces with hyphens
   *  4. Keeps only the first 20 characters
   *
   * @param filename the filename to be normalized
   * @param ext the extension
   *
   */
  public normalizeFilename(filename, ext){
    filename = filename || '';
    return filename.replace( /[<>:"\/\\|?*]+/g, '' ).trim().replace(/\s+/g, '-').substring(0,20) + '.' + ext;
  }

  /**
   * @param content
   */
  public addCategory(content) {
    let found = false;
    this.selectedCategory.forEach(_content => {
      if (content.id == _content.id) found = true;
    });
    if (!found) {
      let toPush = {};
      toPush['id'] = content['id'];
      this.selectedCategory.push(toPush);
    }
  }

  /**
   * @param id
   */
  public removeContent(id) {
    let toRemove = -1;
    this.selectedContents.forEach((content, index) => {
      if (content['id'] == id) {
        toRemove = index;
      }
    });
    if (toRemove != -1) {
      this.selectedContents.splice(toRemove, 1);
    }
  }

  /**
   * @param id
   */
  public removeCategory(id) {
    let toRemove = -1;
    this.selectedCategory.forEach((content, index) => {
      if (content['id'] == id) {
        toRemove = index;
      }
    });
    if (toRemove != -1) {
      this.selectedCategory.splice(toRemove, 1);
    }
  }

  /**
   * clear content array
   */
  public clearContents() {
    this.selectedContents = [];
  }

  /**
   * all content array
   * @return {Array}
   */
  public getContents() {
    return this.selectedContents;
  }

  /**
   * all content array
   * @return {Array}
   */
  public getCategory() {
    return this.selectedCategory;
  }

  /**
   * @param title
   * @param subtitle
   */
  simpleAlert(title, subtitle) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  /**
   * simple toast message functionality
   * @param message
   * @param {number} time
   * @return void
   */
  simpleToast(message, time=3000) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: time,
      position: 'top'
    });
    toast.present();
  }

  /**
   * //we are updating geolocation on background when some event is fired to avoid traffic drains and increasing load time glitches
   * @return {Observable<any>}
   */
  public updateGeolocation() {
    let now = Date.now();
    return new Observable(observer => {
      if (!this.platform.is('android') && !this.platform.is('ios')) {
        this.geolocation.getCurrentPosition().then(position => {
          this.position = { longitude: position.coords.longitude, latitude: position.coords.latitude };
          this.lastChecked = now;
          this.position['date'] = now;
          observer.next(this.position);
        }).catch(err => {
          observer.error(err);
        });
      } else {
        this.position['date'] = now;
        observer.next(this.position);
      }
    });
  }

  /**
   * @return {any}
   */
  public getMeta() {
    this.updateGeolocation().subscribe();
    this.position['date'] = Date.now();
    return this.position;
  }
  
  /**
   * Creates a spinner instance
   */
  private createLoading(){
    return this.loadingCtrl.create({
        content: 'Loading Please Wait...',
        enableBackdropDismiss: true
      });
  }

  /**
   * return void
   */
  public getLoad(check) {
    // Show only if not already active
    if (check && !this.loading) {
      this.loading = this.loading || this.createLoading();
      this.loading.present();
    }

    // Hide only if is already active
    if(!check && !!this.loading) {
      this.loading.dismiss();
      this.loading = null;
    }

    return true;
  }

}
