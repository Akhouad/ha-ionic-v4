import {Component} from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {CrudProvider} from "../../providers/crud/crud";
import {Storage} from '@ionic/storage';
import {GlobalVars} from '../common/globalVars';
import {AgendaPage} from "../agenda/agenda";
import {HomePage} from "../home/home";
export interface User {
  email: string,
  pass: string
}

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  protected inEmail: boolean;
  protected pass: boolean;
  protected onlineCheck: boolean;
  protected passShow: boolean;
  protected showLabel: boolean;
  protected passValMessage: string;
  protected emailValMessage: string;
  protected top: string;

  passType: any = 'password';

  protected data: User = {
    email: '',
    pass: ''
  };

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public crudProvider: CrudProvider,
              public storage: Storage,
              public alertCtrl: AlertController,) {
    this.inEmail = false;
    this.showLabel = false;
    this.passShow = false;
    this.onlineCheck = false;
  }

  SignUpForm() {
    let body = {
      email: this.data.email,
      password: this.data.pass,
    };
    if (!this.onlineCheck) {
      this.emailValMessage = "This email is invalid. It must match the email used to register for the event.";
    } else {
      this.emailValMessage = '';
      if (!this.pass) {
        this.passValMessage = 'Password must be at least 6 characters and include both a letter and number.';
      } else {
        this.passValMessage = '';
        this.crudProvider.signUp('user-registration', body)
          .subscribe(data => {
            if (data['token']) {
              this.success();
              GlobalVars.profile ={
                token:data['token'],
                email:this.data.email,
                userType:data['usertype'],
                guest: false
              };
              this.storage.set("profile", JSON.stringify(GlobalVars.profile)).then(()=>{
                this.navCtrl.setRoot(HomePage);
                this.navCtrl.pop()
              });
            } else {
              this.emailValMessage = data.error.message;
            }
          })
      }
    }
  }

  /**
   * success message method
   */
  protected success() {
    let alert = this.alertCtrl.create({
      title: 'Congratulations!',
      subTitle: 'You are successfully registered in High Attend!',
      buttons: ['Ok']
    });
    alert.present();
  }

  /**
   * validation part
   * @param type
   * @param data
   */
  public inputValid(type, data) {
    switch (type) {
      case 'email':
        this.checkMail(data);
        break;
      case 'pass':
        this.pass = this.validatePass(data) ? true : false;
        break;
    }
  }

  /**
   * email validation method
   * @returns {boolean}
   */
  protected validateEmail(data) {
    this.checkMail(data);
    this.inEmail = true;
    let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(data);
  }

  /**
   * @param data
   */
  protected checkMail(data) {
    let body = {
      email: data
    };

    if(data.length > 7) {
      this.crudProvider.signUp('email-validation', body)
        .subscribe(data => {
          console.log(data);
          if(data.error.code == 422) {
            this.onlineCheck = false;
          } else {
            this.onlineCheck = data.email_valid;
          }
        })
    }
  }

  private checkMail2(){
    if(this.data.email.length > 0){
      this.checkMail(this.data.email)
    }
  }

  /**
   * text validation method
   * @returns {boolean}
   */
  protected validateText(data) {
    let pattern = /[A-Za-z]{3}/;
    return pattern.test(data);
  }

  /**
   * text validation method
   * @returns {boolean}
   */
  protected validatePass(data) {
    let pattern = /^(?=.*[0-9])(?=.*[a-z])[a-zA-Z0-9!@#$%^&*]{6,15}$/;
    return pattern.test(data);
  }

  /**
   *
   */
  public showPassword() {
    this.passShow = this.passShow === true ? false : true;
  }

  /**
   *
   */
  public showInfo() {
    this.showLabel = this.showLabel === false ? true : false;
    this.top = this.top === "5px" ? "20px" : "5px";
  }

  public showPass(){
    this.passType = (this.passType === 'password') ? 'text' : 'password'
  }

}
