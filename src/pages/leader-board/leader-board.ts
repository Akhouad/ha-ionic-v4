import {Component} from '@angular/core';
import {ActionSheetController, NavController, NavParams} from 'ionic-angular';
import {CrudProvider} from "../../providers/crud/crud";
import {GlobalVars} from "../common/globalVars";
import {TopLeaderBoardPage} from "../top-leader-board/top-leader-board";

import { Platform} from 'ionic-angular';
import {BarcodeScanner, BarcodeScannerOptions} from "@ionic-native/barcode-scanner";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {SearchProvider} from "../../providers/search/search";
import {SearchPage} from "../search/search";
import {ContactDataPage} from "../contact-data/contact-data";

import {ExhibitorListPage} from "../exhibitor-list/exhibitor-list";
import {SponsorsPage} from "../sponsors/sponsors";
import {ContentListPage} from "../content-list/content-list";
import {GamesPage} from "../games/games";
import {SpeakersListPage} from "../speakers-list/speakers-list";
import {SurvaysPage} from "../survays/survays";
import {MapListPage} from "../map-list/map-list";
import {AgendaPage} from "../agenda/agenda";


/**
 * Generated class for the LeaderBoardPage page.
 */
// @IonicPage()
@Component({
  selector: 'page-leader-board',
  templateUrl: 'leader-board.html',
})
export class LeaderBoardPage {
  protected event_id: number;
  protected top: any;
  protected myScore: any;
  protected list: any;
  protected empty: boolean;
  protected icons: any;
  protected rootTitle: string;
  protected rootIcon: string;

  options: BarcodeScannerOptions;
  cameraOptions: CameraOptions;

  showLoader: boolean = true;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public crudProvider: CrudProvider,
              private actionSheetCtrl: ActionSheetController,
              private barcodeScanner: BarcodeScanner,
              public camera: Camera,
              private platform: Platform,
              protected search: SearchProvider,
              ) {
    this.icons = "lead";
    this.event_id = GlobalVars.event_id;
    this.rootTitle = GlobalVars.rootPageTitle;
    this.rootIcon = GlobalVars.rootPageIcon;
    this.crudProvider.getIndex('top-leader-boards?count=50&event_id=' + this.event_id + '&', GlobalVars.profile.token)
      .subscribe(data => {
        this.showLoader = false;
        this.top = data.leaders;
        if (this.top.length < 1) {
          this.empty = true;
        }
      });
    this.myList();
  }

  /**
   * check my list point
   */
  protected myList() {
    this.crudProvider.getIndex('leader-boards?event_id=' + GlobalVars.event_id + '&', GlobalVars.profile.token)
      .subscribe(data => {
        this.myScore = data.scores;
        this.list = data.leaders;
      })
  }

  /**
   * go to exact map page
   * @param id
   */
  protected goToExactLead(email) {
    this.navCtrl.push(TopLeaderBoardPage, {email})
  }

  /**
   * go to home page
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
