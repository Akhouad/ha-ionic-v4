import {Component, ViewChild} from '@angular/core';
import {Platform, Nav, App, AlertController, Events, ToastController, Config, MenuController} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Storage} from '@ionic/storage';
import {CrudProvider} from "../providers/crud/crud";
import {GlobalVars} from '../pages/common/globalVars';
import {InAppBrowser, InAppBrowserOptions} from '@ionic-native/in-app-browser';
import {AppVersion} from '@ionic-native/app-version';
// import {Intercom} from '@ionic-native/intercom';
import {Keyboard} from '@ionic-native/keyboard';
import {GlobalProvider} from "../providers/global/global";
import {BarcodeScanner, BarcodeScannerOptions} from "@ionic-native/barcode-scanner";
import {Camera, CameraOptions} from "@ionic-native/camera";



import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import {CompaniesPage} from "../pages/companies/companies";
import {AgendaPage} from "../pages/agenda/agenda";
import {GamesPage} from '../pages/games/games';
import {LeaderBoardPage} from "../pages/leader-board/leader-board";
import {ExhibitorListPage} from "../pages/exhibitor-list/exhibitor-list";
import {SponsorsPage} from '../pages/sponsors/sponsors';
import {SpeakersListPage} from "../pages/speakers-list/speakers-list";
import {ContentListPage} from "../pages/content-list/content-list";
import {ParticipantsListPage} from "../pages/participants-list/participants-list";
import {MapListPage} from "../pages/map-list/map-list";
import {PerformancePage} from "../pages/performance/performance";
import {SurvaysPage} from "../pages/survays/survays";
import {ProfilePage} from "../pages/profile/profile";
import {ContactDataPage} from "../pages/contact-data/contact-data";
import {EventOverviewPage} from "../pages/event-overview/event-overview";
import {ContactPage} from "../pages/contact/contact";
import {MyEventListPage} from "../pages/my-event-list/my-event-list";
import {LinksPage} from '../pages/links/links';
import { AuthProvider } from "../providers/auth/auth";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  public rootPage: any;
  protected userType: string;
  protected company_id: number;
  protected event_id: number;
  protected event_type: boolean;
  protected contentsCheck: boolean;
  protected sessionsCheck: boolean;
  protected speakersCheck: boolean;
  protected sponsorsCheck: boolean;
  protected surveysCheck: boolean;
  protected externalCheck: boolean;
  protected leaderCheck: boolean;
  protected gamesCheck: boolean;
  protected exhibitorsCheck: boolean;
  protected mapsCheck: boolean;
  protected user: any;
  protected qr: any;
  protected app_version: number;
  options: BarcodeScannerOptions;
  cameraOptions: CameraOptions;
  public image: string;
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
  hasSessions: boolean = true;
  applications: Object = {
    type_1: false,
    type_4: false,
    type_8: false,
    type_6: false
  };
  initEmail = 'dent@hat.am'
  initPass = 'dent12'
  initCompany_id = 76
  guest: Boolean
  public profileStorage
  pageLoader: Boolean = true

  constructor(
    private platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private storage: Storage,
    public toastCtrl: ToastController,
    public crudProvider: CrudProvider,
    public appCtrl: App,
    private barcodeScanner: BarcodeScanner,
    public events: Events,
    public alertCtrl: AlertController,
    private appVersion: AppVersion,
    // private intercom: Intercom,
    private camera: Camera,
    private iab: InAppBrowser,
    private keyboard: Keyboard,
    public config: Config,
    public authService: AuthProvider,
    private globalService: GlobalProvider,
    private menu: MenuController
  ) {
    platform.ready().then(() => {
      statusBar.backgroundColorByHexString('#1c2443');
      splashScreen.hide();

      this.config.set( 'scrollPadding', false )
      this.config.set( 'scrollAssist', false )
      this.config.set( 'autoFocusAssist', false )

      // this.menu.enable(false)
      // this.pageLoader = true
      
      if (platform.is('android')) {
        platform.registerBackButtonAction(() => {
          if (!GlobalVars.LoginPage) {
            if (this.nav.canGoBack()) {
              this.globalService.getLoad(false);
              switch (GlobalVars.rootPage){
                case 'agenda':
                  this.nav.setRoot(AgendaPage);
                  break;
                case 'leader_board':
                  this.nav.setRoot(LeaderBoardPage);
                  break;
                case 'speakers':
                  this.nav.setRoot(SpeakersListPage);
                  break;
                case 'exhibitors':
                  this.nav.setRoot(ExhibitorListPage);
                  break;
                case 'sponsors':
                  this.nav.setRoot(SponsorsPage);
                  break;
                case 'content':
                  this.nav.setRoot(ContentListPage);
                  break;
                case 'surveys':
                  this.nav.setRoot(SurvaysPage);
                  break;
                case 'maps':
                  this.nav.setRoot(MapListPage);
                  break;
                case 'games':
                  this.nav.setRoot(GamesPage);
                  break;
                default :
                  this.nav.setRoot(CompaniesPage);
                  break;
              }
            } else {
              this.nav.pop();
            }
          }
        });
      }

      if (this.platform.is('ios')) {
        this.keyboard.disableScroll(true);
      }
      
      this.appVersion.getVersionNumber().then(function (versionNumber) {
        this.app_version = versionNumber;
      }.bind(this), function (error) {
        //console.log(error);
      });
    });

    // this.profileStorage = {
    //   guest: true
    // }

    this.events.subscribe('sidemenu:updateItems', args => {
      this.hasSessions = typeof args.hasSessions === 'undefined' ? true : args.hasSessions;
      if (args.applications) {
        this.applications = {
          type_1: false,
          type_4: false,
          type_8: false,
          type_6: false
        };
        for (let i = 0; i < args.applications.length; i++) {
          this.applications['type_' + args.applications[i]] = true;
        }
      }
    });

    GlobalVars.profile = {
      email: '',
      token: '',
      userType: ''
    };
    GlobalVars.event_type = false;
    this.storage.get('profile').then((val) => {
      console.log(val)
      if (val != '' && val != null) {
        let profile = JSON.parse(val);
        GlobalVars.profile.token = profile.token;
        if (profile.token != null && profile.token !== '') {

          this.rootPage = CompaniesPage;
          GlobalVars.profile.email = profile.email;
          GlobalVars.profile.userType = profile.userType;
        } else {
          this.rootPage = LoginPage;
        }
      } else {
        this.rootPage = LoginPage;
      }
    }).catch(() => {
      this.rootPage = LoginPage;
    });
    
    
    this.cameraOptions = {
      quality: 20,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 1000,
      targetHeight: 1000
    };

    this.qr = [];

    appCtrl.viewWillEnter.subscribe((view) => {
      this.event_id = GlobalVars.event_id;
      this.company_id = GlobalVars.company_id;
      this.userType = GlobalVars.profile.userType;
      this.event_type = GlobalVars.event_type;
      GlobalVars.page = view.component.name;
      if (GlobalVars.checkItem) {
        this.checkItem(this.event_id);
      }
    });
  }
  
  /**
   * logoutApp method
   * @return void
   */
  protected logoutApp() {
    GlobalVars.profile = {
      email: '',
      token: '',
      userType: ''
    };
    
    // reset intercom
    // this.intercom.reset();
    this.storage.set("profile", JSON.stringify(GlobalVars.profile));
    this.menu.enable(false)
    // GlobalVars.event_id = null;
    // GlobalVars.company_id = null;
    this.nav.push(LoginPage);
  }

  /**
   * @param id
   */
  protected checkItem(id) {
    this.crudProvider.getIndex('menu-content?event_id=' + id + '&', GlobalVars.profile.token)
      .subscribe(data => {
        this.sessionsCheck = data.sessions;
        this.speakersCheck = data.speakers;
        this.sponsorsCheck = data.sponsors;
        this.surveysCheck = data.surveys;
        this.gamesCheck = data.games;
        this.exhibitorsCheck = data.exhibitors;
        this.mapsCheck = data.maps;
        this.contentsCheck = data.contents;
        this.externalCheck = data.external_link;
        this.leaderCheck = data.leader_board;
      });
    this.crudProvider.getIndex('event-root/' + id + '?', GlobalVars.profile.token)
      .subscribe(data => {
        GlobalVars.rootPage = data.root;
      });
    GlobalVars.checkItem = false;
  }

  /**
   * go to type page
   */
  protected goToType() {
    this.nav.setRoot(ContactDataPage);
  }

  /**
   * go to Home page
   */
  protected goToIcon() {
    if(this.event_id && !this.event_type){
      let id = this.event_id;
      this.nav.setRoot(AgendaPage,
        {id}
      )
    } else if(this.company_id) {
      this.nav.setRoot(HomePage);
    } else {
      this.nav.setRoot(CompaniesPage);
    }
  }

  /**
   * goTo CompanyList method
   */
  protected goToCompanyList() {
    this.nav.setRoot(CompaniesPage);
  }

  /**
   * Go to my event method
   */
  public goToMyEvent() {
    this.nav.setRoot(MyEventListPage)
  }

  /**
   * go to event overview
   * @constructor
   */
  protected eventOverview() {
    this.nav.setRoot(EventOverviewPage);
  }

  /**
   * go to contact page
   */
  protected goToContact() {
    this.nav.setRoot(ContactPage);
  }

  /**
   * go to my profile page
   */
  protected goToMyProfile() {
    this.nav.setRoot(ProfilePage);
  }

  /**
   * go to home page
   */
  protected goToHome() {
    if (this.company_id) {
      this.nav.setRoot(HomePage);
    } else {
      this.nav.setRoot(CompaniesPage);
    }
  }

  /**
   * go to agenda
   */
  protected goToAgenda() {
    if (this.event_id) {
      let id = this.event_id;
      this.nav.setRoot(AgendaPage,
        {id}
      )
    }
  }

  /**
   * go to Content page
   */
  protected goToContent() {
    let id = this.event_id;
    this.nav.setRoot(ContentListPage,
      {id}
    )
  }

  /**
   * go to attendees page
   */
  protected goToSpeaker() {
    this.nav.setRoot(SpeakersListPage);
  }

  /**
   * go to attendees page
   */
  protected goToAttendees() {
    this.nav.setRoot(ParticipantsListPage);
  }

  /**
   * go to map page
   */
  protected goToMap() {
    this.nav.setRoot(MapListPage);
  }

  /**
   * go to exhibitor page
   */
  protected goToProve() {
    this.nav.setRoot(PerformancePage);
  }

  /**
   * go to exhibitor page
   */
  protected goToExhibitors() {
    this.nav.setRoot(ExhibitorListPage);
  }

  /**
   * Go to surveys page
   */
  public goToSurveys() {
    this.nav.setRoot(SurvaysPage);
  }

  /**
   * Go to leader board page
   */
  public onLead() {
    this.nav.setRoot(LeaderBoardPage);
  }

  /**
   * go to browser
   * @param pageName
   */
  public goToBrowser(pageName: string) {
    if (pageName == "about") {
      this.iab.create("https://highattendance.com/", "_blank", this.browserOptions);
    }
    if (pageName == "legal") {
      this.iab.create("https://highattendance.com/legal/", "_blank", this.browserOptions);
    }
    if (pageName == "privacy") {
      this.iab.create("https://highattendance.com/privacy/", "_blank", this.browserOptions);
    }
  }

  /**
   * Further Menu Functions
   */
  protected goToExpense() {
    let alert = this.alertCtrl.create({
      title: 'Comming soon!',
      buttons: ['Exit']
    });
    alert.present();
  }

  /**
   * Further Menu Functions
   */
  protected goToInvite() {
    let alert = this.alertCtrl.create({
      title: 'Comming soon!',
      buttons: ['Exit']
    });
    alert.present();
  }

  /**
   * Further Menu Functions
   */
  public goToWatchList() {
    let alert = this.alertCtrl.create({
      title: 'Comming soon!',
      buttons: ['Exit']
    });
    alert.present();
  }

  /**
   * go to sponsors
   */
  protected goToSponsors() {
    if (this.event_id) {
      let id = this.event_id;
      this.nav.setRoot(SponsorsPage, {id});
    }
  }

  /**
   * go to games
   */
  goToGames() {
    if (this.event_id) {
      let id = this.event_id;
      this.nav.setRoot(GamesPage, {id});
    }
  }

  /**
   * go to links
   */
  goToLinks() {
    if (this.event_id) {
      let id = this.event_id;
      this.nav.setRoot(LinksPage, {id});
    }
  }

  /**
   * @return void
   */
  openIntercomChat() {
    // this.intercom.displayMessenger();
  }
  
  /**
   * Scan badge
   * @return object
   */
  onScan() {
    this.barcodeScanner.scan()
      .then((result) => {
        this.returnData(result);
      })
      .catch((error) => {
        //alert(error);
      })
  }

  /**
   * @param result
   */
  protected returnData(result) {
    let body = {
      qrcode: result.text,
      company_id: this.company_id
    };

    this.crudProvider.create('scan-qr-code', body, GlobalVars.profile.token)
      .subscribe(resultData => {
          this.nav.push(ContactDataPage, {
            resultData
          })
        },
        function (error) {
          //alert('error' + error);
        }
      );
  }

  /**
   * @returns {Promise<void>}
   */
  async onCamera() {
    let image = await this.camera.getPicture(this.cameraOptions);
    this.nav.push(ContactDataPage, {
      image
    })
  }

  /**
   * @return json
   */
  checkOut() {
    this.barcodeScanner.scan()
      .then((result) => {
        if (!result.cancelled) {
          this.checkOut();
          this.setCheckOut(result.text);
        } else {
          this.setCheckOut(result.text);
        }
      })
      .catch((error) => {
        //alert(error);
      });
  }

  /**
   * @param data
   * @return void
   */
  setCheckOut(data) {
    let body = {
      event_id: GlobalVars.event_id,
      qr_code: data
    };

    this.crudProvider.create('check-out', body, GlobalVars.profile.token)
      .subscribe(data => {
        //alert("Messages: " + data.error.message);
      })
  }

  /**
   * multiple scan method
   */
  onScanMul() {
    this.barcodeScanner.scan()
      .then((result) => {
        if (!result.cancelled) {
          this.onScanMul();
          this.myPush(result);
        } else {
          this.saveQrCode(this.qr);
        }
      })
      .catch((error) => {
        //alert(error);
      })
  }

  /**
   * my push method
   * @param data
   */
  protected myPush(data) {
    this.qr.push(data.text);
  }

  /**
   * save qr code
   * @param data
   */
  protected saveQrCode(data) {
    let body = {
      qrcode: data
    };
    this.crudProvider.create('qr-code', body, GlobalVars.profile.token)
      .subscribe(data => {
        delete this.qr;
        this.qr = [];
      })
  }
  
  /**
   * getCheck method
   */
  protected getCheck() {
    this.barcodeScanner.scan()
      .then((result) => {
        this.sendData(result.text);
      })
      .catch((error) => {
      });
  }

  /**
   * sendData method
   * @param data
   */
  protected sendData(data) {

    let body = {
      qr_code: data,
      event_id: this.event_id,
    };
    this.crudProvider.create('check-in', body, GlobalVars.profile.token)
      .subscribe(data => {
          const toast = this.toastCtrl.create({
            message:  data.error.message,
            duration: 3000
          });
          toast.present();
        //alert("Messages: " + data.error.message);
      })
  }
}

