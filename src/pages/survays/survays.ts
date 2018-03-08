import {Component} from '@angular/core';
import {ActionSheetController, NavController, NavParams} from 'ionic-angular';
import {CrudProvider} from "../../providers/crud/crud";
import {GlobalVars} from '../common/globalVars';
import {InAppBrowser, InAppBrowserOptions} from '@ionic-native/in-app-browser';

import {Platform} from 'ionic-angular';
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {SearchProvider} from "../../providers/search/search";
import {SearchPage} from "../search/search";
import {ContactDataPage} from "../contact-data/contact-data";

import {LeaderBoardPage} from "../leader-board/leader-board";
import {ExhibitorListPage} from "../exhibitor-list/exhibitor-list";
import {SponsorsPage} from "../sponsors/sponsors";
import {ContentListPage} from "../content-list/content-list";
import {MapListPage} from "../map-list/map-list";
import {GamesPage} from "../games/games";
import {SpeakersListPage} from "../speakers-list/speakers-list";
import {AgendaPage} from "../agenda/agenda";

/**
 * Generated class for the SurvaysPage page.
 */
// @IonicPage()
@Component({
  selector: 'page-survays',
  templateUrl: 'survays.html',
})
export class SurvaysPage {

  protected surveys: any;
  protected event_id: number;
  protected event_name: string;
  protected rootTitle: string;
  protected rootIcon: string;

  cameraOptions: CameraOptions;

  options : InAppBrowserOptions = {
    location : 'no',//Or 'no'
    hidden : 'no', //Or  'yes'
    clearcache : 'yes',
    clearsessioncache : 'yes',
    zoom : 'no',//Android only ,shows browser zoom controls
    hardwareback : 'yes',
    mediaPlaybackRequiresUserAction : 'no',
    shouldPauseOnSuspend : 'no', //Android only
    closebuttoncaption : 'Close', //iOS only
    disallowoverscroll : 'no', //iOS only
    toolbar : 'yes', //iOS only
    enableViewportScale : 'no', //iOS only
    allowInlineMediaPlayback : 'no',//iOS only
    presentationstyle : 'pagesheet',//iOS only
    fullscreen : 'yes',//Windows only
};

  showLoader: boolean = true;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public crudProvider: CrudProvider,
              private iab: InAppBrowser,

              private actionSheetCtrl: ActionSheetController,
              private barcodeScanner: BarcodeScanner,
              public camera: Camera,
              private platform: Platform,
              protected search: SearchProvider
  ) {
    this.event_id = GlobalVars.event_id;
    this.event_name = GlobalVars.event_name;
    this.rootTitle = GlobalVars.rootPageTitle;
    this.rootIcon = GlobalVars.rootPageIcon;
    this.crudProvider.getIndex('applications?event_id=' + this.event_id + '&type=survey' + '&', GlobalVars.profile.token)
      .subscribe(data => {
        this.showLoader = false;
        this.surveys = data.applications;
      });
  }

  /**
   * open browser method
   * @param url
   */
  protected goToBrowse(url) {
    this.iab.create('https://app.highattendance.com/' + url, "_blank", this.options);
  }

  /**
   * go to home
   */
  protected goToHome() {
    this.navCtrl.setRoot(AgendaPage);
  }

  /**
   *
   */
  protected openMenu() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Add new contact',
      buttons: [
        {
          text: 'Scan Business Card',
          icon: !this.platform.is('ios') ? 'camera' : null,

          /**
           * onCamera method
           * @returns {Promise<void>}
           */
          handler: () => {
            this.onCamera();
          }
        },
        //
        {
          text: 'Scan Badge',
          icon: !this.platform.is('ios') ? 'qr-scanner' : null,
          handler: () => {
            this.onScan();
          }
        },
        {
          text: 'Type Contact',
          icon: !this.platform.is('ios') ? 'keypad' : null,
          handler: () => {
            this.onInput();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  /**
   * onScan method
   */
  onScan() {
    this.barcodeScanner.scan()
      .then((result) => {
        //alert(result.text);
        this.navCtrl.setRoot(ContactDataPage, {
          result
        })
      })
      .catch((error) => {
        //alert(error);
      })
  }

  /**
   * onInput method
   */
  onInput() {
    this.navCtrl.setRoot(ContactDataPage);
  }

  /**
   * onCamera method
   * @returns {Promise<void>}
   */
  async onCamera(): Promise<any> {
    try {
      let image = await this.camera.getPicture(this.cameraOptions);
      this.navCtrl.setRoot(ContactDataPage, {
        image
      })

    } catch (e) {
      //alert(e);
    }
  }

  /**
   *
   */
  public goToSearch() {
    this.navCtrl.setRoot(SearchPage)
  }

  /**
   * go root page
   */
  protected goToMain() {
    this.checkRootPage();
  }

  /**
   *
   */
  public checkRootPage(){
    switch (GlobalVars.rootPage){
      case 'agenda':
        this.navCtrl.setRoot(AgendaPage);
        break;
      case 'leader_board':
        this.navCtrl.setRoot(LeaderBoardPage);
        break;
      case 'speakers':
        this.navCtrl.setRoot(SpeakersListPage);
        break;
      case 'exhibitors':
        this.navCtrl.setRoot(ExhibitorListPage);
        break;
      case 'sponsors':
        this.navCtrl.setRoot(SponsorsPage);
        break;
      case 'content':
        this.navCtrl.setRoot(ContentListPage);
        break;
      case 'surveys':
        this.navCtrl.setRoot(SurvaysPage);
        break;
      case 'maps':
        this.navCtrl.setRoot(MapListPage);
        break;
      case 'games':
        this.navCtrl.setRoot(GamesPage);
        break;
    }
  }
}
