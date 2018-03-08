import { Component } from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {AuthUser, LoginPage} from "../login/login";
import {AuthProvider} from "../../providers/auth/auth";

/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {
  
    private button: boolean = false;
    private data: AuthUser = {
      email: ""
    };
    private loading: boolean = false;
  
    constructor(private alertCtrl: AlertController,
                public navCtrl: NavController,
                private http: AuthProvider) {
  
    }
  
    /**
     * @param $event
     */
    private submit($event = false) {
      this.http.forgotPassword(this.data.email).subscribe(res => {
        let alert;
        if (res['error'] && res['error']['code'] == 422) {
          alert = this.alertCtrl.create({
            title: 'Wrong email address',
            subTitle: res['error']['message'],
            buttons: ['Dismiss']
          });
        } else {
          alert = this.alertCtrl.create({
            title: 'Check your email',
            subTitle: 'Please follow the instructions sent by email to restore your password.',
            buttons: ['Dismiss']
          });
          this.navCtrl.push(LoginPage);
        }
        alert.present();
      })
    }
  
    /**
     * @param code
     * @param $event
     */
    private input(code, $event) {
      if (this.validateEmail())
        this.triggerButton(true);
      else this.triggerButton(false);
    }
  
    /**
     * @param _switch
     */
    private triggerButton(_switch: boolean) {
      this.button = _switch;
    }
  
    /**
     * @returns {boolean}
     */
    private validateEmail() {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(this.data.email);
    }
  
    /**
     * @param val
     * @param key
     */
    enterSubmit(val, key) {
      console.log('enterSubmit', val, key);
      if (val.length > 0 && this.button && key == 'Enter' && !this.loading && this.validateEmail())
        this.submit();
    }
  
    private signIn() {
      this.navCtrl.setRoot(LoginPage);
    }

}
