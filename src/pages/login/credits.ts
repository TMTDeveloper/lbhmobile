import { Component } from "@angular/core";
import {
  NavController,
  AlertController,
  LoadingController,
  Loading,
  IonicPage,
  Events
} from "ionic-angular";
import { AuthService } from "../../providers/auth-service";

import { TabsPage } from "../tabs/tabs";
import { Credentials } from "../../providers/credentials.holder";

@Component({
  selector: "page-credits",
  templateUrl: "credits.html"
})
export class CreditsPage {
  loading: Loading;
  registerCredentials = { email: "", password: "" };

  constructor(
    private nav: NavController,
    private auth: AuthService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    public events: Events
  ) {}

  checkCookie()
  {
    // always check if has cookie to continue session
    // session lasts ~5 mins
  }

  ionViewWillEnter()
  {
    // did we just logout?
    //this.events.unsubscribe('user:logout');
  }

  public createAccount() {
    this.nav.push("RegisterPage");
  }

  public login() {
    this.showLoading();
    this.auth.login(this.registerCredentials).subscribe(
      allowed => {
        if (allowed) {
          this.nav.push(TabsPage);
        } else {
          this.showError("Email atau Sandi salah!");
          //console.log("wrong credentials");
        }
      },
      error => {
        // if (error != null) {
        //   this.showError("Login error:" + error);
        //   //console.log("server error");
        // }
      }
    );
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: "Mohon tunggu...",
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  showError(text) {
    this.loading.dismiss();

    let alert = this.alertCtrl.create({
      title: "Gagal",
      subTitle: text,
      buttons: ["OK"]
    });
    alert.present();
  }
}
