import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {CrudProvider} from "../../providers/crud/crud";
import {GlobalVars} from '../common/globalVars';
import { InAppBrowserOptions, InAppBrowser } from '@ionic-native/in-app-browser';

/**
 * Generated class for the SponsorPage page.
 */
// @IonicPage()
@Component({
  selector: 'page-sponsor',
  templateUrl: 'sponsor.html',
})
export class SponsorPage {
  private id:number;
  private sponsor:any;
  private browserOptions: InAppBrowserOptions = {
    location: 'no',//Or 'no'
    hidden: 'no', //Or  'yes'
    clearcache: 'yes',
    clearsessioncache: 'yes',
    zoom: 'no',//Android only ,shows browser zoom controls
    hardwareback: 'yes',
    mediaPlaybackRequiresUserAction: 'no',
    shouldPauseOnSuspend: 'no', //Android only
    closebuttoncaption: 'Close', //iOS only
    disallowoverscroll: 'no', //iOS only
    toolbar: 'yes', //iOS only
    enableViewportScale: 'no', //iOS only
    allowInlineMediaPlayback: 'no',//iOS only
    presentationstyle: 'pagesheet',//iOS only
    fullscreen: 'yes',//Windows only
  };

  showLoader: boolean = true;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private iab: InAppBrowser,
              private crudProvider:CrudProvider) {
    this.id = this.navParams.get("id");
    this.crudProvider.getIndex("sponsors/" + this.id + "?", GlobalVars.profile.token).subscribe(data=>{
      this.sponsor = data.sponsor;
      this.showLoader = false;
    }, error=>{
      //alert(JSON.stringify(error));
    })
  }

  /**
   *
   * @param url
   */
  openUrl(url){
    this.iab.create(url, "_blank", this.browserOptions);
  }
}
