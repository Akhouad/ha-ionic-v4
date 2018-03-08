import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {
  ActionSheetController, App, MenuController, NavController, NavParams, Refresher,
  ToastController
} from 'ionic-angular';
import {SessionPage} from "../session/session";
import {GlobalVars} from "../common/globalVars";
import {CrudProvider} from "../../providers/crud/crud";
import {BarcodeScanner, BarcodeScannerOptions} from "@ionic-native/barcode-scanner";
import {Camera, CameraOptions} from "@ionic-native/camera";

import {ExhibitorListPage} from "../exhibitor-list/exhibitor-list";
import {SponsorsPage} from "../sponsors/sponsors";
import {ContentListPage} from "../content-list/content-list";
import {GamesPage} from "../games/games";
import {SpeakersListPage} from "../speakers-list/speakers-list";
import {SurvaysPage} from "../survays/survays";
import {MapListPage} from "../map-list/map-list";
import {SearchPage} from "../search/search";
import {LeaderBoardPage} from "../leader-board/leader-board";
import {ContactDataPage} from "../contact-data/contact-data";

/**
 * Generated class for the AgendaPage page.
 */

// @IonicPage()
@Component({
  selector: 'page-agenda',
  templateUrl: 'agenda.html',
})
export class AgendaPage {

  protected company_id: number;
  protected event: any;
  protected event_session: any;
  protected options: BarcodeScannerOptions;
  protected cameraOptions: CameraOptions;
  protected partData: any;
  protected event_application: any;
  protected time: any;
  protected index: any;
  protected session: any;
  protected icons: string;
  private userType: any;
  private empty: boolean;
  protected rootTitle: string;
  protected rootIcon: string;

  showLoader: boolean = true;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              protected crudProvider: CrudProvider,
              private barcodeScanner: BarcodeScanner,
              public toastCtrl: ToastController,
              public menu: MenuController,
              public appCtrl: App,
              private actionSheetCtrl: ActionSheetController,
              public camera: Camera,
              private platform: Platform,) {
                console.log('erer')
    this.icons = 'session';
    this.userType = GlobalVars.profile.userType;
    this.rootTitle = GlobalVars.rootPageTitle;
    this.rootIcon = GlobalVars.rootPageIcon;

    if (this.navParams.get('type') == 'content') {
      this.icons = 'application';
    }

    if (this.navParams.get('type') == 'feed') {
      this.icons = 'feed';
    }

    this.company_id = GlobalVars.company_id;

    this.options = {
      resultDisplayDuration: 12
    };
    this.partData = [];
    this.loadSession();
    appCtrl.viewWillEnter.subscribe(() => {
      this.loadSession();
    });
  }

  /**
   * Loading all sessions
   * @return void
   */
  loadSession() {
    let time = [];
    let ind = [];
    let session = [];
    this.crudProvider.getIndex('events/' + GlobalVars.event_id + '?company_id=' + GlobalVars.company_id + '&', GlobalVars.profile.token)
      .subscribe(data => {
        this.showLoader = false;

        this.event = data.event;
        GlobalVars.event_name = data.event.name;
        this.event_session = data.schedules['sessions'];
        this.event_application = data.event.applications;
        Object.keys(this.event_session).map(function (objectKey, index) {
          ind.push(index);
          time.push(objectKey);
          session.push(data.schedules['sessions'][time[index]]);
        });
        this.index = ind;
        this.time = time;
        this.session = session;
        if (this.event.length < 1) {
          this.empty = true;
        }
      });
  }

  /**
   * getCheck method
   * @return object
   */
  protected getCheck() {
    this.barcodeScanner.scan()
      .then((result) => {
        this.sendData(result.text);
      })
      .catch((error) => {
        //alert(error);
      });
  }

  /**
   * sendData method
   * @param data
   * @return void
   */
  protected sendData(data) {
    let body = {
      qr_code: data,
      event_id: this.navParams.get('id'),
    };

    this.crudProvider.create('check-in', body, GlobalVars.profile.token)
      .subscribe(() => {

      })
  }

  /**
   * goToSession method
   * @param session_id
   * @return void
   */
  goToSession(session_id, checked_in) {
    let event_id = this.navParams.get('id');
    this.navCtrl.push(SessionPage, {
      session_id,
      event_id,
      checked_in
    });
  }

  /**
   * Go to agenda  page
   * @return void
   */
  protected goToHome() {
    this.navCtrl.setRoot(AgendaPage);
  }


  /**
   * Do refresh method
   * @param refresher
   */
  doRefresh(refresher: Refresher) {
    let time = [];
    let ind = [];
    let session = [];
    setTimeout(() => {
      this.crudProvider.getIndex('events/' + GlobalVars.event_id + '?company_id=' + GlobalVars.company_id + '&', GlobalVars.profile.token)
        .subscribe(data => {
          this.event = data.event;
          this.event_session = data.schedules['sessions'];
          this.event_application = data.event.applications;
          Object.keys(this.event_session).map(function (objectKey, index) {
            ind.push(index);
            time.push(objectKey);
            session.push(data.schedules['sessions'][time[index]]);
          });
          this.index = ind;
          this.time = time;
          this.session = session;
          let toast = this.toastCtrl.create({
            message: 'Agenda has been updated.',
            position: 'top',
            duration: 1000
          });
          toast.present();
          refresher.complete();
        });
    }, 2000);
  }

  /**
   * Work footer menu
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
   * @return object
   */
  onScan() {
    this.barcodeScanner.scan()
      .then((result) => {
        this.navCtrl.setRoot(ContactDataPage, {
          result
        })
      })
      .catch(() => {
      })
  }

  /**
   * onInput method
   * @return void
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
      alert(JSON.stringify(e));
    }
  }

  /**
   * Go global search page
   * @return void
   */
  public goToSearch() {
    this.navCtrl.setRoot(SearchPage)
  }

  /**
   * Go root page
   * @return void
   */
  protected goToMain() {
    this.checkRootPage();
  }

  /**
   * Check root page
   * @return void
   */
  public checkRootPage() {
    switch (GlobalVars.rootPage) {
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
