import {Component} from '@angular/core';
import {NavController, ToastController, ActionSheetController, Platform, Refresher} from 'ionic-angular';
import {BarcodeScanner, BarcodeScannerOptions} from "@ionic-native/barcode-scanner";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {ContactDataPage} from "../contact-data/contact-data";
import {SearchProvider} from "../../providers/search/search";
import {ContactDetailPage} from "../contact-detail/contact-detail";
import {CrudProvider} from "../../providers/crud/crud";

import {GlobalVars} from '../common/globalVars';
import {HomePage} from "../home/home";
import {AgendaPage} from "../agenda/agenda";

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})

export class ContactPage {

  options: BarcodeScannerOptions;
  cameraOptions: CameraOptions;
  protected contacts: any;
  protected allContact: any;
  private start: number;
  private number: number;
  private empty: boolean;
  private noButton: boolean;
  private check: boolean;

  showLoader: boolean = true;

  constructor(public navCtrl: NavController,
              private barcodeScanner: BarcodeScanner,
              public camera: Camera,
              private actionSheetCtrl: ActionSheetController,
              private platform: Platform,
              protected search: SearchProvider,
              private crudProvider: CrudProvider,
              private toastCtrl: ToastController,) {
    this.allContact = [];
    this.start = 0;
    this.noButton = false;
    this.options = {
      resultDisplayDuration:0
    };

    this.check = true;

    this.cameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 1000,
      targetHeight: 1000
    };

    this.crudProvider.getIndex('my-contacts?', GlobalVars.profile.token)
      .subscribe(data => {
        this.showLoader = false;
        
        this.allContact = data.contacts;
        this.number = data.contacts.length;
        this.start = this.number;
        if(this.number < 1) {
          this.empty = true;
        }
      })
  }

  /**
   * infinite scroll method
   * @param infiniteScroll
   */
  protected doInfinite(infiniteScroll) {
    this.start += 5;
    this.loadContact().then(() => {
      infiniteScroll.complete();
    });

  }

  /**
   * do refresh method
   * @param refresher
   */
  doRefresh(refresher: Refresher) {
    setTimeout(() => {
      this.crudProvider.getIndex('my-contacts?', GlobalVars.profile.token)
        .subscribe(data => {
          let toast = this.toastCtrl.create({
            message: 'Contacts have been updated.',
            position: 'top',
            duration: 1000
          });
          this.allContact = data.contacts;
          this.number = data.contacts.length;
          this.start = this.number;
          if(this.number < 1) {
            this.empty = true;
          }

          toast.present();
          refresher.complete();
        });
    }, 2000);
  }

  /**
   * loadContact method
   * @returns {Promise<T>}
   */
  loadContact() {
    return new Promise(resolve => {
      this.crudProvider.getIndex('my-contacts?skip=' + this.start + '&take=5&', GlobalVars.profile.token)
        .subscribe(data => {
          if(data.contacts.length > 0){
          for (let item of data.contacts) {
            if(item.first_name !="" && item.first_name != null){
              this.allContact.push(item);
            }
          }
          }
          resolve(true);
        })
    });
  }

  /**
   * setFilteredItems method
   * @param search
   */
  protected setFilteredItems(search) {
    let val = search.target.value;
    this.search.getContacts('my-contacts?search=' + val)
      .subscribe(data => {
        this.contacts = data.contacts;
      })
  }

  /**
   * goToEditContact method
   * @param id
   */
  public goToEditContact(id) {
    this.navCtrl.push(ContactDetailPage, {
      id
    });
  }

  /**
   * scan method
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
      company_id: GlobalVars.company_id
    };

    this.crudProvider.create('scan-qr-code', body, GlobalVars.profile.token)
      .subscribe(resultData => {
          this.navCtrl.push(ContactDataPage, {
            resultData,
            contact: true
          })
        },
        function (error) {
          //alert('error' + error);
        }
      );
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
   * goToCompany method
   */
  protected goToHome() {
    this.navCtrl.setRoot(AgendaPage);
  }

  /**
   * send request method
   */
  protected sendRequest() {
    this.noButton = true;
    let toast = this.toastCtrl.create({
      message: ' You will receive an email with your contacts shortly.',
      duration: 3000,
      position: 'top'
    });

    this.crudProvider.getIndex('contacts-request?', GlobalVars.profile.token)
      .subscribe(data => {
        toast.present();
      })
  }

  /**
   * go to back
   */
  protected goBack() {
    this.navCtrl.setRoot(HomePage);
  }

  /**
   * @return void
   */
  openMenu() {
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
}
