import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {CrudProvider} from "../../providers/crud/crud";
import {CompaniesPage} from "../companies/companies";
import {GlobalVars} from '../common/globalVars';

/**
 * Generated class for the ProfilePage page.
 */
// @IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  protected user: any;
  protected first_name: string;
  protected last_name: string;
  protected middle_name: string;
  protected email: string;
  protected country: string;
  protected country_code: string;
  protected state: string;
  protected address: string;
  protected canNavBack: boolean;

  showLoader: boolean = true;

  constructor(public navCtrl: NavController,
              public crudProvider: CrudProvider) {
    this.crudProvider.getIndex('user-info?', GlobalVars.profile.token)
      .subscribe(data => {
        this.showLoader = false;
        
        this.user = data.user;
        this.first_name = data.user.first_name;
        this.last_name = data.user.last_name;
        this.middle_name = data.user.middle_name;
        this.email = data.user.email;
        this.country = data.user.country;
        this.country_code = data.user.country_code;
        this.state = data.user.state;
        this.address = data.user.address;
      });
  }

  ionViewWillEnter(){
    this.canNavBack = this.navCtrl.canGoBack();
  }

  /**
   * change data method
   */
  protected changeData() {
    let body = {
      email: this.email,
      first_name: this.first_name,
      last_name: this.last_name,
      middle_name: this.middle_name,
      country: this.country,
      state: this.state,
      address: this.address,
      country_code: this.country_code
    };

    this.crudProvider.update('users', body, GlobalVars.profile.token)
      .subscribe(data => {
        //alert("Messages: " + data.error.message);
      })
  }

  /**
   * goToCompany method
   */
  protected goToCompany() {
    this.navCtrl.setRoot(CompaniesPage);
  }

  /**
   * change qr code size
   */
  protected showQr() {
    let elem = document.getElementById('showQr');
    let prof = document.getElementById('showProf');
    if (elem.style.width == '48px') {
      elem.style.position = 'relative';
      elem.style.top = '0';
      elem.style.right = '0';
      elem.style.width = '100%';
      prof.style.display = 'none';
    } else {
      elem.style.position = 'absolute';
      elem.style.width = '48px';
      elem.style.top = '25px';
      elem.style.right = '25px';
      prof.style.display = 'block';
    }
  }

}
