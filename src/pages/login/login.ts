import { Component } from "@angular/core";
import {
  NavController,
  AlertController,
  LoadingController,
  Loading,
  IonicPage,
  Events,
  Platform
} from "ionic-angular";
import { AuthService } from "../../providers/auth-service";

import { TabsPage } from "../tabs/tabs";
import { Credentials } from "../../providers/credentials.holder";
import { BackendService } from "../../providers/backend.service";
import { CreditsPage } from "./credits";

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
    private loadingCtrl: LoadingController,
    public events: Events,
    private platform: Platform,
    private service: BackendService
  ) { }

  checkCookie() {
    // always check if has cookie to continue session
    // session lasts ~5 mins
  }

  ionViewWillEnter() {
    // if in login page, back btn exits app
    this.events.subscribe('user:quit',
      response => this.closeApp()
    );
    this.getCurVersion();
  }

  ionViewWillExit() {
    // else, back btn logs user out
    //this.events.unsubscribe('user:quit');
  }

  clientVerInt = 1;
  clientVerStr = "1.00";

  curVerStr = "";

  getCurVersion() {
    this.service.getreq("/version").subscribe( response =>{
      if (response != null)
      {
        this.curVerStr = response["version"];
        this.checkVersion();
      }
    });
  }

  checkVersion() {
    if (this.clientVerStr != this.curVerStr) {
      this.askToUpdate();
    }
  }

  askToUpdate() {
    let alert = this.alertCtrl.create({
      title: "Versi ini sudah tidak didukung!",
      subTitle: "Mohon unduh versi terbaru",
      buttons: [{
        text: 'OK',
        handler: data => {
          console.log('Exited app bcs version mismatch');
          this.closeApp();
        }
      }]
    });
    alert.present();
  }

  closeApp() {
    this.platform.exitApp();
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

  showLogin() {
    let alert = this.alertCtrl.create({
      inputs: [
        {
          name: 'email',
          placeholder: 'Email'
        },
        {
          name: 'password',
          placeholder: 'Sandi',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Masuk',
          handler: data => {
            this.registerCredentials.email = data.email;
            this.registerCredentials.password = data.password;
            console.log(this.registerCredentials);
            this.login();
          }
        }
      ]
    });
    alert.present();
  }

  showCredits() {
    this.nav.push(CreditsPage);
  }
}
