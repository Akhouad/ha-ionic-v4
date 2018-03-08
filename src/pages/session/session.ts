import {Component} from '@angular/core';
import {NavController, NavParams, ToastController, Refresher} from 'ionic-angular';
import {BarcodeScanner, BarcodeScannerOptions} from "@ionic-native/barcode-scanner";
import {CrudProvider} from "../../providers/crud/crud";
import {ParticipantsPage} from "../participants/participants";
import {GlobalVars} from '../common/globalVars';

// @IonicPage()
@Component({
  selector: 'page-session',
  templateUrl: 'session.html',
})
export class SessionPage {

  protected id: number;
  protected event_id: number;
  protected event_name: string;
  protected userType: string;
  protected session: any;
  protected speakerRate: any;
  protected options: BarcodeScannerOptions;
  protected rate: number;
  protected tag: boolean;
  protected unCheck: boolean;

  showLoader: boolean = true;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public toastCtrl: ToastController,
              protected crudProvider: CrudProvider,
              private barcodeScanner: BarcodeScanner) {
    this.id = this.navParams.get('session_id');
    this.event_id = GlobalVars.event_id;
    this.event_name = GlobalVars.event_name;
    this.userType = GlobalVars.profile.userType;
    this.options = {
      resultDisplayDuration: 12
    };
    this.crudProvider.getIndex('sessions/' + this.id + "?", GlobalVars.profile.token)
      .subscribe(data => {
        this.showLoader = false;
        
        if(data.session.speakers[0]) {
          this.speakerRate = data.session.speakers[0].user_rate;
        }
        this.unCheck = data.session.unCheck;
        this.session = data.session;
        this.tag = data.session.tag;
        this.rate = data.session.rate;
      });
  }

  /**
   * return void
   */
  protected unCheckRate(){
    if(this.unCheck){
      const toast = this.toastCtrl.create({
        message: 'You are not checked in to this session.',
        duration: 2500
      });
      toast.present();
    }
  }

  /**
   * return void
   */
  getSessionCheck() {
    this.barcodeScanner.scan()
      .then((result) => {
        if (!result.cancelled) {
          this.sendData(result.text);
          setTimeout(this.getSessionCheck(), 100);
        } else {
          this.sendData(result.text);
        }
      })
      .catch((error) => {
        alert(error);
      })
  }

  /**
   * sendData method
   * @param data
   */
  protected sendData(data) {
    let body = {
      qr_code: data,
      event_id: this.event_id,
      session_id: this.id
    };

    this.crudProvider.create('check-in', body, GlobalVars.profile.token)
      .subscribe(data => {
        //alert("Messages: " + data.error.message);
      });
  }

  /**
   * goToParticipant method
   */
  protected goToParticipant() {
    let event_id = this.event_id;
    let session_id = this.id;
    this.navCtrl.push(ParticipantsPage, {
      event_id,
      session_id
    });
  }

  /**
   * rate method
   * @param rate
   */
  onModelChange(rate) {
    let body = {
      session_id: this.id,
      rate: rate,
    };

    this.crudProvider.create('session-rate', body, GlobalVars.profile.token)
      .subscribe(data => {
        console.log(data);
        //alert("Messages: " + data.error.message);
      });

  }

  /**
   *
   */
  onChangeSpeaker(rate, id) {
    let body = {
      session_id: this.id,
      rate: rate,
      speaker_id: id
    };

    this.crudProvider.create('speakers-rate', body, GlobalVars.profile.token)
      .subscribe(data => {
        console.log(data);
        //alert("Messages: " + data.error.message);
      });
  }

  /**
   * return object
   * @param {Refresher} refresher
   */
  doRefresh(refresher: Refresher) {
    this.crudProvider.getIndex('sessions/' + this.id + "?", GlobalVars.profile.token)
      .subscribe(data => {
        this.session = data.session;
      });

    setTimeout(() => {
      refresher.complete();

      const toast = this.toastCtrl.create({
        message: 'Sessions has been updated.',
        duration: 3000
      });
      toast.present();
    }, 1000);
  }
}
