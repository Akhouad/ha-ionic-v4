import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {SpeakerPage} from "../speaker/speaker";
import {SessionPage} from "../session/session";
import {SponsorPage} from "../sponsor/sponsor";
import {ExhibitorPage} from "../exhibitor/exhibitor";
import {GlobalVars} from "../common/globalVars";
import {ExactContentsPage} from "../exact-contents/exact-contents";
import {CrudProvider} from "../../providers/crud/crud";
import {SearchProvider} from "../../providers/search/search";
import {InAppBrowser, InAppBrowserOptions} from "@ionic-native/in-app-browser";
import {ExactMapPage} from "../exact-map/exact-map";
import {GlobalProvider} from "../../providers/global/global";
import {File} from '@ionic-native/file';
import {FileOpener} from '@ionic-native/file-opener';
import {HTTP} from '@ionic-native/http';

/**
 * Generated class for the SearchMorePage page.
 */

@Component({
  selector: 'page-search-more',
  templateUrl: 'search-more.html',
})
export class SearchMorePage {

  protected sessions: any;
  protected speakers: any;
  protected sponsors: any;
  protected surveys: any;
  protected exhibitors: any;
  protected contents: any;
  protected maps: any;
  protected type: string;


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

  protected options: InAppBrowserOptions = {
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

  showLoader: boolean = true;


  constructor(protected navParam: NavParams,
              protected navCtrl: NavController,
              protected search: SearchProvider,
              protected iab: InAppBrowser,
              protected globalService: GlobalProvider,
              protected crudProvider: CrudProvider,
              private file: File,
              private fileOpener: FileOpener,
              private http: HTTP) {
    this.type = this.navParam.get('type');
    this.search.globalSearch('global-search/'+ this.type +'?event_id=' + GlobalVars.event_id + '&search=' + this.navParam.get('val'))
      .subscribe(data => {
        this.showLoader = false

        this.sessions = data.sessions;
        this.speakers = data.speakers;
        this.sponsors = data.sponsors;
        this.surveys = data.surveys;
        this.exhibitors = data.exhibitors;
        this.contents = data.contents;
        this.maps = data.maps;
      });

  }

  /**
   * open exact search result page
   * @param id
   * @param type
   */
  protected goToPageDetails(id, type) {
    switch (type) {
      case 'speaker':
        this.navCtrl.push(SpeakerPage, {id});
        break;
      case 'session':
        this.navCtrl.push(SessionPage, {session_id: id});
        break;
      case 'sponsor':
        this.navCtrl.push(SponsorPage, {id});
        break;
      case 'survey':
        this.goToBrowse(id);
        break;
      case 'exhibitor':
        this.navCtrl.push(ExhibitorPage, {id});
        break;
      case 'content':
        this.goToExactContent(id);
        break;
      case 'map':
        this.navCtrl.push(ExactMapPage, {id});
        break;
    }
  }

  /**
   * open browser method
   * @param url
   */
  protected goToBrowse(url) {
    this.iab.create('https://app.highattendance.com/' + url, "_blank", this.options);
  }

  /**
   * goToExactContent method
   * @param id
   */
  // protected goToExactContent(id) {
  //   this.crudProvider.getIndex('contents/' + id + "?", GlobalVars.profile.token)
  //     .subscribe(data => {
  //       this.navCtrl.push(ExactContentsPage, {
  //         data: data.content.file_path
  //       });
  //     });
  // }
  protected goToExactContent(content_id) {
    this.globalService.getLoad(true);
    this.crudProvider.getIndex('contents/' + content_id + "?", GlobalVars.profile.token)
      .subscribe(data => {
        // let name = data.content.name.replace(/\s+/g, '-') + '.pdf';
        let name = this.globalService.normalizeFilename(data.content.name, 'pdf');

        switch (data.content.file_type) {
          case 'video':
            this.globalService.getLoad(false);
          case 'website':
            this.globalService.getLoad(false);
          case 'vimeo':
            this.globalService.getLoad(false);
          case 'youtube':
            this.globalService.getLoad(false);
            this.openUrl(data.content.file_path[0]);
            break;
          case 'pdf':
            // Loader will be dismissed when the download is finished.
            this.downloadPdf(data.content.url, name);
            break;
          default:
            this.globalService.getLoad(false);
            this.navCtrl.push(ExactContentsPage, {
              data: data.content.file_path
            });
            break;
        }
      });
  }
  
    /**
     * @param data
     * @param name
     */
    public downloadPdf(data, name) {
      this.globalService.getLoad(true);
      this.http.downloadFile(data, {}, {}, this.file.dataDirectory + name)
        .then((data) => {
          this.showDownload(this.file.dataDirectory + name);
          this.globalService.getLoad(false);
        })
        .catch(error => {
          this.globalService.getLoad(false);
        });
    }
  
    /**
     * @param data
     * @return void
     */
    public showDownload(data) {
      this.fileOpener.open(data, 'application/pdf')
        .then(() => {
        })
        .catch(e => alert(JSON.stringify(e)));
    }
  
    /**
     * @param url
     * @return void
     */
    openUrl(url) {
      this.iab.create(url, "_blank", this.browserOptions);
    }

}
