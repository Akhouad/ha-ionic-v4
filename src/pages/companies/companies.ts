import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import {CrudProvider} from "../../providers/crud/crud";
import {Storage} from '@ionic/storage';
import {HomePage} from "../home/home";
import {GlobalVars} from '../common/globalVars';

/**
 * Generated class for the CompaniesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-companies',
  templateUrl: 'companies.html',
})
export class CompaniesPage {

  protected company: any;
  showLoader: Boolean = true
  profileStorage
  
  constructor(
    public navCtrl: NavController,
    private crudProvider: CrudProvider,
    public storage: Storage,
    private platform: Platform,
  ) {
    this.storage.get('profile').then((data) => {
      this.profileStorage = JSON.parse(data)
      console.log(this.profileStorage)
    })
    this.crudProvider.getIndex('companies?', GlobalVars.profile.token)
      .subscribe(data => {
        this.showLoader = false
        this.company = data.companies;
        GlobalVars.companies = this.company;
        if(GlobalVars.companies.length == 1){
          GlobalVars.company_id = GlobalVars.companies[0].id;
          this.navCtrl.setRoot(HomePage);
        }
      }, error=>{
        alert("error = " + error);
      });

    if(this.platform.is('android')){
      this.storage.get('push_key').then((key) => {
        let body = {
          id: key,
          type: 'android'
        };
        GlobalVars.push_key = body;
        this.crudProvider.create('registration', body, GlobalVars.profile.token)
          .subscribe(data => {
            //console.log(data)
          });
      });
    }
    if(this.platform.is('ios')){
      this.storage.get('push_key').then((key) => {
        let body = {
          id: key,
          type: 'ios'
        };
        GlobalVars.push_key = body;
        this.crudProvider.create('registration', body, GlobalVars.profile.token)
          .subscribe(data => {
            console.log(data)
          });
      });
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CompaniesPage');
  }
  
  /**
   * goToTabs method
   * @param id
   */
  protected goToTabs(id) {
    GlobalVars.company_id = id;
    GlobalVars.event_id = null;
    this.navCtrl.setRoot(HomePage);
  }

}
