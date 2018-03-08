import {Component} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {CrudProvider} from "../../providers/crud/crud";
import {BarcodeScanner, BarcodeScannerOptions} from "@ionic-native/barcode-scanner";
import {SearchProvider} from "../../providers/search/search";
import {GlobalVars} from '../common/globalVars';
import {GlobalProvider} from "../../providers/global/global";
import {AgendaPage} from "../agenda/agenda";

/**
 * Generated class for the SendContentPage page.
 */
// @IonicPage()
@Component({
  selector: 'page-send-content',
  templateUrl: 'send-content.html',
})
export class SendContentPage {

  protected loading: boolean;
  protected subButton: boolean;
  protected token: any;
  protected content: any;
  protected result: any;
  protected textData: any;
  protected contacts: any;
  protected first_name: string;
  protected last_name: string;
  protected email_consent: string;
  protected company: string;
  protected title: string;
  protected application_id: number;
  protected event_id: number;
  protected options: BarcodeScannerOptions;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController,
              protected crudProvider: CrudProvider,
              protected barcodeScanner: BarcodeScanner,
              protected search: SearchProvider,
              private globalService: GlobalProvider) {
    this.options = {
      resultDisplayDuration: 12
    };

    this.globalService.clearContents();
    this.loading = false;
    this.token = GlobalVars.profile.token;
    this.event_id = GlobalVars.event_id;
    this.content = this.navParams.get('check');
    this.application_id = this.navParams.get('application_id');
  }

  /**
   * onScan method
   */
  onScan() {
    this.barcodeScanner.scan()
      .then((result) => {
        this.result = result.text;
        this.qrData();
      })
      .catch((error) => {
        //alert(error);
      })
  }

  /**
   * QR data change input
   */
  qrData() {
    if (this.result) {
      this.textData = JSON.parse(this.result);
      this.first_name = this.textData.first_name;
      this.last_name = this.textData.last_name;
      this.email_consent = this.textData.email;
      this.company = this.textData.company;
      this.title = this.textData.title;
    }
    this.ifValid(this.email_consent);
  }

  /**
   * search E-mail method
   * @param data
   */
  searchEmail(data) {
    let val = data.target.value;
    this.search.getContacts('participants?event_id=' + GlobalVars.event_id + '&search=' + val + '&')
      .subscribe(data => {
        this.contacts = data.participants;
      })
  }

  /**
   * sand data method
   * @param data
   */
  protected sendData(data) {
    this.loading = true;

    let body = {
      event_id: this.event_id,
      application_id: this.application_id,
      contents: this.content,
      participant: data,
    };
    this.saveData(body);
  }

  /**
   * saveData method
   * @param body
   */
  protected saveData(body) {
    this.crudProvider.create('send-contents', body, this.token)
      .subscribe(data => {
        //alert("Messages: " + data.error.message);
        console.log(data)
        this.loading = false;
        this.navCtrl.pop();       
      }, error => {
        console.error(JSON.stringify(error))
        //alert(JSON.stringify(error));
      });
  }

  /**
   * getMail method
   * @param email
   */
  getMail(email) {
    this.email_consent = email;
    this.contacts = [];
    this.ifValid(this.email_consent);
  }

  /**
   * ifValid method
   * @param $event
   */
  ifValid($event) {
    if (this.validateEmail($event)) this.subButton = true;
    else this.subButton = false;
  }

  /**
   * email validation method
   * @param $event
   * @returns {boolean}
   */
  private validateEmail($event) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test($event);
  }

  /**
   * go to home page
   */
  protected goToHome() {
    this.navCtrl.setRoot(AgendaPage);
  }

  /**
   * close model
   */
  closeSendModal() {
    this.viewCtrl.dismiss();
  }
}
