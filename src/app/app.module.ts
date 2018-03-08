import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Keyboard } from '@ionic-native/keyboard';
import { Network } from '@ionic-native/network';
import { Geolocation } from '@ionic-native/geolocation';
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import {Camera} from "@ionic-native/camera";
import {Contacts} from "@ionic-native/contacts";
import {SocialSharing} from "@ionic-native/social-sharing";
import {FileOpener} from '@ionic-native/file-opener';
import {File} from '@ionic-native/file';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import {CompaniesPage} from "../pages/companies/companies";
import {AgendaPage} from "../pages/agenda/agenda";
import {GamesPage} from '../pages/games/games';
import {LeaderBoardPage} from "../pages/leader-board/leader-board";
import {ExhibitorListPage} from "../pages/exhibitor-list/exhibitor-list";
import {SponsorsPage} from '../pages/sponsors/sponsors';
import {SpeakersListPage} from "../pages/speakers-list/speakers-list";
import {ContentListPage} from "../pages/content-list/content-list";
import {ParticipantsListPage} from "../pages/participants-list/participants-list";
import {MapListPage} from "../pages/map-list/map-list";
import {PerformancePage} from "../pages/performance/performance";
import {SurvaysPage} from "../pages/survays/survays";
import {ProfilePage} from "../pages/profile/profile";
import {ContactDataPage} from "../pages/contact-data/contact-data";
import {EventOverviewPage} from "../pages/event-overview/event-overview";
import {ContactPage} from "../pages/contact/contact";
import {MyEventListPage} from "../pages/my-event-list/my-event-list";
import {LinksPage} from '../pages/links/links';
import {ForgotPasswordPage} from '../pages/forgot-password/forgot-password';
import { SignupPage } from '../pages/signup/signup';
import { ContactDetailPage } from '../pages/contact-detail/contact-detail';
import { SearchPage } from '../pages/search/search';
import { SessionPage } from '../pages/session/session';
import { ParticipantsPage } from '../pages/participants/participants';
import { SpeakerPage } from '../pages/speaker/speaker';
import { TopLeaderBoardPage } from '../pages/top-leader-board/top-leader-board';
import { ApplicationPage } from '../pages/application/application';
import { SponsorPage } from '../pages/sponsor/sponsor';
import { ExactContentsPage } from '../pages/exact-contents/exact-contents';
import { FilterPage } from '../pages/filter/filter';
import { SendContentPage } from '../pages/send-content/send-content';
import { ExactCategoriesPage } from '../pages/exact-categories/exact-categories';
import { ExactMapPage } from '../pages/exact-map/exact-map';
import { SearchMorePage } from '../pages/search-more/search-more';
import { ExhibitorPage } from '../pages/exhibitor/exhibitor';

import { LoaderComponent } from '../components/loader/loader';

import { GlobalProvider } from '../providers/global/global';
import { AuthProvider } from '../providers/auth/auth';
import { CrudProvider } from '../providers/crud/crud';
import { HTTP } from "@ionic-native/http";
import { HttpModule } from "@angular/http";
import { IonicStorageModule } from '@ionic/storage';
// import { Intercom } from '@ionic-native/intercom';
import { InAppBrowser } from "@ionic-native/in-app-browser";
import {AppVersion} from '@ionic-native/app-version';
import { SearchProvider } from '../providers/search/search';
import { Ionic2RatingModule } from 'ionic2-rating';
import { FileTransfer } from '@ionic-native/file-transfer';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    CompaniesPage,
    AgendaPage,
    GamesPage,
    LeaderBoardPage,
    ExhibitorListPage,
    SponsorsPage,
    SpeakersListPage,
    ContentListPage,
    ParticipantsListPage,
    MapListPage,
    PerformancePage,
    SurvaysPage,
    ProfilePage,
    ContactDataPage,
    EventOverviewPage,
    ContactPage,
    MyEventListPage,
    LinksPage,
    ForgotPasswordPage,
    SignupPage,
    ContactDetailPage,
    SessionPage,
    SearchPage,
    ParticipantsPage,
    LoaderComponent,
    SpeakerPage,
    TopLeaderBoardPage,
    ApplicationPage,
    SponsorPage,
    ExactContentsPage,
    FilterPage,
    SendContentPage,
    ExactCategoriesPage,
    ExactMapPage,
    SearchMorePage,
    ExhibitorPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp, {
      mode: 'md'
    }),
    Ionic2RatingModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    CompaniesPage,
    AgendaPage,
    GamesPage,
    LeaderBoardPage,
    ExhibitorListPage,
    SponsorsPage,
    SpeakersListPage,
    ContentListPage,
    ParticipantsListPage,
    MapListPage,
    PerformancePage,
    SurvaysPage,
    ProfilePage,
    ContactDataPage,
    EventOverviewPage,
    ContactPage,
    MyEventListPage,
    LinksPage,
    ForgotPasswordPage,
    SignupPage,
    ContactDetailPage,
    SessionPage,
    SearchPage,
    ParticipantsPage,
    LoaderComponent,
    SpeakerPage,
    TopLeaderBoardPage,
    ApplicationPage,
    SponsorPage,
    ExactContentsPage,
    FilterPage,
    SendContentPage,
    ExactCategoriesPage,
    ExactMapPage,
    SearchMorePage,
    ExhibitorPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Keyboard,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GlobalProvider,
    Network,
    Geolocation,
    AuthProvider,
    CrudProvider,
    HTTP,
    // Intercom,
    InAppBrowser,
    AppVersion,
    SearchProvider,
    BarcodeScanner,
    Camera,
    SocialSharing,
    Contacts,
    LoaderComponent,
    FileOpener,
    File,
    FileTransfer
  ]
})
export class AppModule {}
