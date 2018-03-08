import { Component } from '@angular/core';
import {ActionSheetController, NavController, NavParams} from 'ionic-angular';
import {CrudProvider} from "../../providers/crud/crud";
import {SpeakerPage} from "../speaker/speaker";
import {GlobalVars} from '../common/globalVars';

import { Platform} from 'ionic-angular';
import {BarcodeScanner, BarcodeScannerOptions} from "@ionic-native/barcode-scanner";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {SearchProvider} from "../../providers/search/search";
import {SearchPage} from "../search/search";
import {ContactDataPage} from "../contact-data/contact-data";
import {LeaderBoardPage} from "../leader-board/leader-board";
import {ExhibitorListPage} from "../exhibitor-list/exhibitor-list";
import {SponsorsPage} from "../sponsors/sponsors";
import {ContentListPage} from "../content-list/content-list";
import {SurvaysPage} from "../survays/survays";
import {MapListPage} from "../map-list/map-list";
import {GamesPage} from "../games/games";
import {AgendaPage} from "../agenda/agenda";

/**
 * Generated class for the SpeakersListPage page.
 */
// @IonicPage()
@Component({
  selector: 'page-speakers-list',
  templateUrl: 'speakers-list.html',
})
export class SpeakersListPage {

  protected speakers: any;
  protected event_id: number;
  protected index: any;
  protected alf: any;
  protected speaker: any;
  protected event_name: any;
  protected empty: boolean;
  protected rootTitle: string;
  protected rootIcon: string;

  options: BarcodeScannerOptions;
  cameraOptions: CameraOptions;

  showLoader: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public crudProvider: CrudProvider,

    private actionSheetCtrl: ActionSheetController,
    private barcodeScanner: BarcodeScanner,
    public camera: Camera,
    private platform: Platform,
    protected search: SearchProvider,
  ) {
    let alf = [];
    let ind = [];
    let speaker = [];
    this.rootTitle = GlobalVars.rootPageTitle;
    this.rootIcon = GlobalVars.rootPageIcon;
    this.event_id = GlobalVars.event_id;
    this.event_name = GlobalVars.event_name;
      this.crudProvider.getIndex('speakers?event_id=' + this.event_id + '&', GlobalVars.profile.token)
        .subscribe(data => {
          this.showLoader = false;
          this.speakers = data.speakers;
          if(this.speakers.length < 1) {
            this.empty = true;
          }
          Object.keys(this.speakers).map(function(objectKey, index) {
            ind.push(index);
            alf.push(objectKey);
            speaker.push(data.speakers[alf[index]]);
          });
          this.index = ind;
          this.alf = alf;
          this.speaker = speaker;
        })
  }

  /**
   * go to speaker
   * @param id
   */
  protected goToSpeaker(id) {
    this.navCtrl.push(SpeakerPage, {id})
  }

  /**
   * goToHome method
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
