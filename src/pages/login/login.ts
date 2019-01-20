import { Component } from "@angular/core";
import {
  NavController,
  AlertController,
  LoadingController,
  Loading,
  IonicPage
} from "ionic-angular";
import { AuthService } from "../../providers/auth-service";

import { TabsPage } from "../tabs/tabs";
//import { Credentials } from '../../providers/credentials.holder';

@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  loading: Loading;
  registerCredentials = { email: "", password: "" };

  constructor(
    private nav: NavController,
    private auth: AuthService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  public createAccount() {
    this.nav.push("RegisterPage");
  }

  public login() {
    this.showLoading();
    this.auth.login(this.registerCredentials).subscribe(
      allowed => {
        if (allowed) {
          this.nav.setRoot(TabsPage);
        } else {
          this.showError("Email atau Sandi salah!");
          console.log("wrong credentials");
        }
      },
      error => {
        // if (error != null) {
        //   this.showError("Login error:" + error);
        //   console.log("server error");
        // }
      }
    );
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  showError(text) {
    this.loading.dismiss();

    let alert = this.alertCtrl.create({
      title: "Fail",
      subTitle: text,
      buttons: ["OK"]
    });
    alert.present();
  }
}
