import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {CrudProvider} from "../../providers/crud/crud";
import {InAppBrowser, InAppBrowserOptions} from '@ionic-native/in-app-browser';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import {ApplicationPage} from "../application/application";
import {ExactCategoriesPage} from "../exact-categories/exact-categories";

// @IonicPage()
@Component({
  selector: 'page-exact-contents',
  templateUrl: 'exact-contents.html',
})
export class ExactContentsPage {
  @ViewChild(Slides) slides: Slides;
  protected data: any;
  protected page: boolean;
  private browserOptions: InAppBrowserOptions = {
    location: 'no',//Or 'no'
    hidden: 'no', //Or  'yes'
    clearcache: 'yes',
    clearsessioncache: 'yes',
    zoom: 'yes',//Android only ,shows browser zoom controls
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

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public crudProvider: CrudProvider,
              private iab: InAppBrowser
  ) {
    this.page = false;
    this.data = this.navParams.get('data');
    if(this.navParams.get('category')) {
      this.page =  this.navParams.get('category');
    }
  }

  ngAfterViewInit() {
    this.slides.zoom = true;
  }

  /**
   * open new browser
   * @param url
   */
  protected openUrl(url) {
    this.iab.create(url, "_blank", this.browserOptions);
  }

  /**
   * @return void
   */
  protected goBack() {
    let exactContent = true;
    this.navCtrl.push(ExactCategoriesPage, {
      data: this.navParams.get('hide'),
      exactContent
    });
  }
}
