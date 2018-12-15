import { NgModule, ErrorHandler } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { IonicApp, IonicModule, IonicErrorHandler } from "ionic-angular";
import { MyApp } from "./app.component";
import { HttpClient } from "@angular/common/http";
import { AboutPage } from "../pages/about/about";
import { ContactPage } from "../pages/contact/contact";
import { HomePage } from "../pages/home/home";
import { TabsPage } from "../pages/tabs/tabs";
import { LoginPage } from "../pages/login/login";
import { RootPage } from '../pages/root/root';
import { PostPage } from "../pages/post/post";
import { HttpModule } from "@angular/http";
import { AuthService } from './../providers/auth-service';
import { Credentials } from './../providers/credentials.holder';

import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { FileOpener } from "@ionic-native/file-opener";
import { File } from "@ionic-native/file";
import { FileTransfer } from "@ionic-native/file-transfer";
import { DocumentViewer } from "@ionic-native/document-viewer";
import { BackendService } from "../providers/backend.service";
@NgModule({
  declarations: [MyApp, AboutPage, ContactPage, HomePage, TabsPage, LoginPage, RootPage, PostPage],
  imports: [BrowserModule, IonicModule.forRoot(MyApp), HttpModule],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, AboutPage, ContactPage, HomePage, TabsPage, LoginPage, RootPage, PostPage],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    File,
    DocumentViewer,
    FileTransfer,
    FileOpener,
    BackendService,
    AuthService,
    Credentials
  ]
})
export class AppModule {}
