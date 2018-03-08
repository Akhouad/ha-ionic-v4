import {Component} from '@angular/core';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import { SocialSharing } from '@ionic-native/social-sharing';
import {NavController, NavParams, AlertController, ToastController} from 'ionic-angular';
import {CrudProvider} from "../../providers/crud/crud";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {GlobalVars} from '../common/globalVars';
import {ContactPage} from "../contact/contact";

// @IonicPage()
@Component({
  selector: 'page-contact-detail',
  templateUrl: 'contact-detail.html',
})
export class ContactDetailPage {

  protected id: number;
  protected contact: any;
  protected data: any;
  protected first_name: string;
  protected last_name: string;
  protected email: string;
  protected notes: string;
  protected company: string;
  protected job_title: string;
  protected token: any;
  protected photos: any;
  protected company_id: number;
  protected photoData: any;
  protected imgId: number[] = [];
  protected image: any;
  protected mobile_phone: any;
  protected office_phone: any;
  protected address1: any;
  protected city: any;
  protected state: any;
  protected zip: any;
  protected country: any;
  protected body: any;
  private submitFlag: boolean;
  cameraOptions: CameraOptions;

  showLoader: boolean = true;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              protected crudProvider: CrudProvider,
              public camera: Camera,
              private contacts: Contacts,
              private socialSharing: SocialSharing,
              private toastCtrl: ToastController,
              private alertCtrl:AlertController

  ) {
    this.photos = [];
    this.id = this.navParams.get('id');
    this.company_id = GlobalVars.company_id;
    this.cameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 1000,
      targetHeight: 1000
    };
    if(this.id) {
      this.contact = this.crudProvider.getIndex('contacts/' + this.id + '?', GlobalVars.profile.token)
        .subscribe(data => {
          this.showLoader = false;
          
          this.data = data.contact;
          this.first_name = data.contact.first_name;
          this.last_name = data.contact.last_name;
          this.email = data.contact.email;
          this.notes = data.contact.notes;
          this.company = data.contact.company;
          this.job_title = data.contact.job_title;
          this.photoData = data.contact.images;
          this.mobile_phone = data.contact.mobile_phone;
          this.office_phone = data.contact.office_phone;
          this.address1 = data.contact.address1;
          this.city = data.contact.city;
          this.state = data.contact.state;
          this.zip = data.contact.zip;
        });
    }
    this.submitFlag = false;
  }

  /**
   * return void
   */
  deleteData(){
    this.submitFlag = false;
    let alert = this.alertCtrl.create({
    title: 'Confirm',
    message: 'Are you sure to delete this contact?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'OK',
        handler: () => {
          this.crudProvider.delete('contacts/' + this.id, GlobalVars.profile.token).subscribe(data=>{
            this.navCtrl.push(ContactPage);
          });
        }
      }
    ]
    });
    alert.present();
  }

  /**
   * saveData method
   * @param data
   */
  saveData(data) {
    console.log(data);
    if(this.submitFlag){
    let body = {
      user: data,
      images: this.photos,
      company_id: this.company_id,
      images_id: this.imgId,
    };
      this.crudProvider.update('contacts/' + this.id, body, GlobalVars.profile.token)
        .subscribe(data => {
          let toast = this.toastCtrl.create({
            message: 'Contact was successfully updated.',
            duration: 3000,
            position: 'top'
          });
          toast.present();
        })
    }
  }

  /**
   * deleteImage method
   * @param id
   */
  deleteImage(id) {
    this.submitFlag = false;
    this.imgId.push(id);
    let imgStyle = document.getElementById(id);
    imgStyle.style.display = 'none !important';
    document.getElementById(id)
  }

  /**
   * onCamera method
   * @returns {Promise<void>}
   */
  async onCamera(): Promise<any> {
    try {
      this.image = await this.camera.getPicture(this.cameraOptions);
      this.photos.push('data:image/jpeg;base64,' + this.image);
      this.photos.reverse();
    } catch (e) {
      //alert(e);
    }
  }

  /**
   * save contact date in phone
   */
  protected saveToPhone() {
    let contact: Contact = this.contacts.create();
    contact.name = new ContactName(null, this.first_name, this.last_name);
    contact.phoneNumbers = [
      new ContactField('mobile', this.mobile_phone),
      new ContactField('office', this.office_phone)];
    contact.emails = [new ContactField('emails', this.email)];
    contact.save().then(
      () => {
        //alert('Contact successfully saved')
      },
      (error: any) => console.error('Error saving contact.', error)
    );
  }

  /**
   * contact date share in social
   */
  protected shareContact() {
    this.socialSharing.canShareViaEmail().then(() => {
      //alert('Sharing via email is possible');
    }).catch(() => {
      //alert('Not possible');
    });

    this.socialSharing.share(this.body, 'subj', null).then(
      () => {
        //alert('Global share')
      },
      () => {
        //alert('Sorry something went to wrong in global sharing')
      }
    )
  }
}
