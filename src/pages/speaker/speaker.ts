import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {CrudProvider} from "../../providers/crud/crud";
import {GlobalVars} from '../common/globalVars';

/**
 * Generated class for the SpeakerPage page.
 */
// @IonicPage()
@Component({
  selector: 'page-speaker',
  templateUrl: 'speaker.html',
})
export class SpeakerPage {

  protected event_id: number;
  protected speaker: any;
  protected event_name: any;

  showLoader: boolean = true;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public crudProvider: CrudProvider) {
    this.event_name = GlobalVars.event_name;
    this.crudProvider.getIndex('speakers/' + this.navParams.get('id') + '?', GlobalVars.profile.token)
      .subscribe(data => {
        this.showLoader = false;
        this.speaker = data.speaker;
      })
  }

  /**
   * goToHome method
   */
  protected goToHome() {
    this.navCtrl.pop();
  }
}
