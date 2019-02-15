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
import { RootPage } from "../pages/root/root";
import { PostPage } from "../pages/post/post";
import { ViewPostPage } from "../pages/view_post/view_post";
import { HttpModule } from "@angular/http";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { AuthService } from "./../providers/auth-service";
import { Credentials } from "./../providers/credentials.holder";

import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { FileOpener } from "@ionic-native/file-opener";
import { File } from "@ionic-native/file";
import { FileTransfer } from "@ionic-native/file-transfer";
import { DocumentViewer } from "@ionic-native/document-viewer";
import { BackendService } from "../providers/backend.service";
import { NewPostPage } from "../pages/post/new_post/new_post";
import { FileChooser } from "@ionic-native/file-chooser";
import { FilePath } from "@ionic-native/file-path";
import { DatePicker } from "@ionic-native/date-picker";
import { AndroidPermissions } from "@ionic-native/android-permissions";
import { ProfilePage } from "../pages/profile/profile";

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    LoginPage,
    RootPage,
    PostPage,
    ViewPostPage,
    NewPostPage,
    ProfilePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    LoginPage,
    RootPage,
    PostPage,
    ViewPostPage,
    NewPostPage,
    ProfilePage
  ],
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
    Credentials,
    FileChooser,
    FilePath,
    DatePicker,
    AndroidPermissions
  ]
})
export class AppModule {}
