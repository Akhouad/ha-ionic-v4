import {Component, ViewChild} from '@angular/core';
import {GlobalVars} from '../common/globalVars';
import {NavController, Searchbar} from 'ionic-angular';
import {SessionPage} from '../session/session';
import {SearchProvider} from "../../providers/search/search";
import {SpeakerPage} from "../speaker/speaker";
import {SponsorPage} from "../sponsor/sponsor";
import {InAppBrowser, InAppBrowserOptions} from "@ionic-native/in-app-browser";
import {ExhibitorPage} from "../exhibitor/exhibitor";
import {ExactContentsPage} from "../exact-contents/exact-contents";
import {CrudProvider} from "../../providers/crud/crud";
import {SearchMorePage} from "../search-more/search-more";
import {ExactMapPage} from "../exact-map/exact-map";
import {GlobalProvider} from "../../providers/global/global";
import {File} from '@ionic-native/file';
import {FileOpener} from '@ionic-native/file-opener';
import {HTTP} from '@ionic-native/http';

@Component({
  selector: 'search',
  templateUrl: 'search.html'
})
export class SearchPage {
  @ViewChild('searchBar') searchBar : Searchbar;  
  protected sessions: any;
  protected speakers: any;
  protected sponsors: any;
  protected surveys: any;
  protected exhibitors: any;
  protected contents: any;
  protected maps: any;
  protected searchVal: string;

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

  protected options : InAppBrowserOptions = {
    location : 'no',//Or 'no'
    hidden : 'no', //Or  'yes'
    clearcache : 'yes',
    clearsessioncache : 'yes',
    zoom : 'no',//Android only ,shows browser zoom controls
    hardwareback : 'yes',
    mediaPlaybackRequiresUserAction : 'no',
    shouldPauseOnSuspend : 'no', //Android only
    closebuttoncaption : 'Close', //iOS only
    disallowoverscroll : 'no', //iOS only
    toolbar : 'yes', //iOS only
    enableViewportScale : 'no', //iOS only
    allowInlineMediaPlayback : 'no',//iOS only
    presentationstyle : 'pagesheet',//iOS only
    fullscreen : 'yes',//Windows only
  };
  
  constructor(private navCtrl: NavController,
              protected search: SearchProvider,
              private iab: InAppBrowser,
              protected crudProvider: CrudProvider,
              private globalService: GlobalProvider,
              private file: File,
              private fileOpener: FileOpener,
              private http: HTTP
              ) {
  }

  ionViewDidLoad() {
    this.searchBar.setFocus()
  }

  /**
   * make global search
   * @param ev
   */
  protected filterResults(ev) {
    this.searchVal = ev.target.value;

    this.search.globalSearch('global-search?event_id=' + GlobalVars.event_id + '&search=' + this.searchVal)
      .subscribe(data => {
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
   * clear search result
   */
  protected clearSearch() {
    this.sessions = this.speakers = this.sponsors = this.surveys = this.exhibitors = this.contents = [];
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
   * show more search result
   * @param type
   */
  protected goToMore(type) {
    this.navCtrl.push(SearchMorePage,{
      type: type,
      val: this.searchVal
    })
  }

  // This method was navigating to the Screen where a series of
  // images, related to the selected content, is diplayed in a
  // slider.
  // It is replaced with the improved version that follows/
  //
  // /**
  //  * goToExactContent method
  //  * @param id
  //  */
  // protected goToExactContent(id) {
  //   this.crudProvider.getIndex('contents/' + id+ "?", GlobalVars.profile.token)
  //     .subscribe(data => {
  //       this.navCtrl.push(ExactContentsPage, {
  //         data: data.content.file_path
  //       });
  //     });
  // }


  /**
   * goToExactContent method
   * @param content_id
   */
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
