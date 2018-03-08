import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {ContactPage} from "../contact/contact";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {CrudProvider} from "../../providers/crud/crud";
import {GlobalVars} from '../common/globalVars';

/**
 * Generated class for the ContactDataPage page.
 */
// @IonicPage()
@Component({
  selector: 'page-contact-data',
  templateUrl: 'contact-data.html',
})
export class ContactDataPage {

  public photos: any;
  protected triggerButton: boolean;
  public image: string;
  public result: any;
  protected notes: string;
  protected first_name: string;
  protected last_name: string;
  protected email: string;
  protected company: string;
  protected mobile_phone: string;
  protected job_title: string;
  protected office_phone: string;
  protected website: string;
  protected city: string;
  protected state: string;
  protected zip: string;
  protected id: number;
  private token: any;
  protected qr: any;
  protected check: boolean;
  protected event_data: number;
  cameraOptions: CameraOptions;

  constructor(protected crudProvider: CrudProvider,
              public navCtrl: NavController,
              public navParams: NavParams,
              public camera: Camera) {

    if (this.navParams.get('contact')) {
      this.check = true;
    } else {
      this.check = false;
    }

    if (this.navParams.get('result')) {
      this.result = this.navParams.get('result');
    }

    if (this.navParams.get('resultData')) {
      this.triggerButton = true;
      let data = this.navParams.get('resultData');
      this.notes = data.contact.notes;
      this.first_name = data.contact.first_name;
      this.last_name = data.contact.last_name;
      this.email = data.contact.email;
      this.company = data.contact.company;
      this.mobile_phone = data.contact.mobile_phone;
      this.job_title = data.contact.job_title;
      this.office_phone = data.contact.office_phone;
      this.website = data.contact.website;
      this.city = data.contact.city;
      this.state = data.contact.state;
      this.website = data.contact.website;
      this.event_data = data.contact.event_data;
      this.zip = data.contact.zip;
    }

    this.triggerButton = true;
    this.photos = [];
    this.id = GlobalVars.company_id;
    this.token = GlobalVars.profile.token;
    this.qr = [];
    if (this.navParams.get('image')) {
      this.image = this.navParams.get('image');
      this.photos.push(this.image);
      this.photos.reverse();
    }

    this.cameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 1000,
      targetHeight: 1000
    };
  }

  /**
   * saveData method
   * @param data
   */
  saveData(data) {
    if (this.image) {
      let body = {
        user: data,
        images: this.photos,
        company_id: this.id,
        event_data: this.event_data
      };
      this.sendData(body);
      this.navCtrl.setRoot(ContactPage);
    } else {
      let body = {
        user: data,
        company_id: this.id,
        event_data: this.event_data
      };
      this.sendData(body);
      this.navCtrl.push(ContactPage);
    }
  }

  /**
   * sendData method
   * @param body
   */
  sendData(body) {
    this.crudProvider.create('contacts', body, this.token)
      .subscribe(data => {
        //alert("Messages: " + data.error.message);
      })
  }

  /**
   * onCamera method
   * @returns {Promise<void>}
   */
  public async onCamera(): Promise<any> {
    try {
      this.image = await this.camera.getPicture(this.cameraOptions);
      this.photos.push(this.image);
      this.photos.reverse();
    } catch (e) {
      // alert(e);
    }
  }

  /**
   * validation method
   * @param $event
   */
  protected valid($event) {
    this.triggerButton = !(typeof this.email !== 'undefined' && !this.validateEmail())
      && (typeof this.first_name !== 'undefined' || this.photos.length)
    return this.triggerButton;
  }

  /**
   * mail validation method
   * @returns {boolean}
   */
  protected validateEmail() {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,4}))$/;
    return re.test(this.email);
  }

  /**
   * goBack() method
   */
  protected goBack() {
    this.navCtrl.setRoot(ContactPage)
  }
}
