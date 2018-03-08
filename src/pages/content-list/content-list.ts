import {Component} from '@angular/core';
import {ActionSheetController, MenuController, NavController, NavParams} from 'ionic-angular';
import {CrudProvider} from "../../providers/crud/crud";
import {ApplicationPage} from "../application/application";
import {GlobalVars} from '../common/globalVars';
import {ContactDataPage} from "../contact-data/contact-data";
import { Platform} from 'ionic-angular';
import {BarcodeScanner, BarcodeScannerOptions} from "@ionic-native/barcode-scanner";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {SearchProvider} from "../../providers/search/search";
import {SearchPage} from "../search/search";
import {LeaderBoardPage} from "../leader-board/leader-board";
import {SponsorsPage} from "../sponsors/sponsors";
import {MapListPage} from "../map-list/map-list";
import {GamesPage} from "../games/games";
import {SpeakersListPage} from "../speakers-list/speakers-list";
import {SurvaysPage} from "../survays/survays";
import {ExhibitorListPage} from "../exhibitor-list/exhibitor-list";
import {AgendaPage} from "../agenda/agenda";

/**
 * Generated class for the ContentListPage page.
 */
// @IonicPage()
@Component({
  selector: 'page-content-list',
  templateUrl: 'content-list.html',
})
export class ContentListPage {

  protected company_id: number;
  protected content: any;
  protected empty: boolean;
  protected event_type: boolean;
  options: BarcodeScannerOptions;
  cameraOptions: CameraOptions;
  protected rootTitle: string;
  protected rootIcon: string;

  showLoader: boolean = true;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private barcodeScanner: BarcodeScanner,
              public camera: Camera,
              private actionSheetCtrl: ActionSheetController,
              private platform: Platform,
              protected search: SearchProvider,
              private crudProvider: CrudProvider,
              protected menuCtrl: MenuController
              ) {
    this.menuCtrl.enable(true, "hamburger-menu");
    this.event_type = GlobalVars.event_type;
    this.options = {
      resultDisplayDuration: 0
    };
    this.cameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 1000,
      targetHeight: 1000
    };

    console.log(GlobalVars.company_id)

    this.company_id = GlobalVars.company_id;
    this.rootTitle = GlobalVars.rootPageTitle;
    this.rootIcon = GlobalVars.rootPageIcon;
    this.crudProvider.getIndex('events/' + GlobalVars.event_id + '?company_id=' + GlobalVars.company_id + '&', GlobalVars.profile.token)
      .subscribe(data => {
        this.showLoader = false;
        this.content = data.event.applications;
        if(this.content.length < 1) {
          this.empty = true;
        }
      });
  }

  /**
   * goToApplication method
   * @param application_id
   * @param {string} content_name
   * @return void
   */
  protected goToApplication(application_id, content_name='Content') {
    this.navCtrl.push(ApplicationPage, {
      application_id,
      content_name
    });
  }

  /**
   *
   */
  protected goToContent(){
    this.navCtrl.setRoot(ContentListPage, {
      id:  this.navParams.get('id')
    })
  }

  /**
   * @return void
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
    this.navCtrl.push(ContactDataPage);
  }

  /**
   * onCamera method
   * @returns {Promise<void>}
   */
  async onCamera(): Promise<any> {
    try {
      let image = await this.camera.getPicture(this.cameraOptions);
      this.navCtrl.push(ContactDataPage, {
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
    this.navCtrl.push(SearchPage)
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
