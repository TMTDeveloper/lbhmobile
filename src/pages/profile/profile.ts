import { Component, ViewChild } from "@angular/core";
import {
  NavController,
  NavParams,
  Content,
  ToastController,
  AlertController,
  Events
} from "ionic-angular";
import { File } from "@ionic-native/file";
import {
  DocumentViewer,
  DocumentViewerOptions
} from "@ionic-native/document-viewer";
import { FileTransfer } from "@ionic-native/file-transfer";
import { FileOpener } from "@ionic-native/file-opener";
import { BackendService } from "../../providers/backend.service";
import { LoadingController } from "ionic-angular";

import { Platform } from "ionic-angular";
import { AppModule } from "../../app/app.module";

import * as moment from "moment";
import { Credentials } from "../../providers/credentials.holder";
import { AndroidPermissions } from "@ionic-native/android-permissions";

import { SHA256 } from "crypto-js";

@Component({
  selector: "page-profile",
  templateUrl: "profile.html"
})
export class ProfilePage {

  name;
  organisasi;
  role;
  email;

  constructor(
    private androidPermissions: AndroidPermissions,
    private document: DocumentViewer,
    private file: File,
    private transfer: FileTransfer,
    public navCtrl: NavController,
    private opener: FileOpener,
    private service: BackendService,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public creds: Credentials,
    public alert: AlertController,
    public events: Events,
    public toastCtrl: ToastController
  ) {
      this.name = creds.data.name;
      this.organisasi = creds.data.organisasi;
      this.role = creds.data.role;
      this.email = creds.data.email;
  }

  roleIs(role){
    if (role == 0) {
      return "Paralegal";
    }
    if (role == 1) {
      return "Pengacara";
    }
    if (role == 2) {
      return "Pengawas";
    }
    if (role == 3) {
      return "Admin";
    }
  }

  organisasiIs(organisasi){
    if (organisasi == 0) {
      return "LBH Jakarta";
    }
    if (organisasi == 1) {
      return "LBH Apik Jakarta";
    }
    if (organisasi == 2) {
      return "LBH Yogyakarta";
    }
    if (organisasi == 3) {
      return "LBH Bali";
    }
    if (organisasi == 4) {
      return "LBH Apik Bali";
    }
    if (organisasi == 5) {
      return "LKBH UII";
    }
  }

  askChangePassword() {
    let alert = this.alert.create({
      title: 'Masukkan password baru',
      buttons: [
        {
          text: "Ubah",
          handler: data => {
            this.confirmPassword(data.password);
          }
        },
        {
          text: "Batal",
          role: "cancel",
          handler: () => {
            console.log("Cancel close");
          }
        }
      ],
      inputs: [
        {
          name: 'password',
          type: 'text'
        }
      ]
    });
    alert.present();
  }

  confirmPassword(password) {
    let alert = this.alert.create({
      title: 'Ulangi password baru',
      buttons: [
        {
          text: "Ubah",
          handler: data => {
            if (data.password == password) this.changePassword(password);
            else this.failedConfirm();
          }
        },
        {
          text: "Batal",
          role: "cancel",
          handler: () => {
            console.log("Cancel close");
          }
        }
      ],
      inputs: [
        {
          name: 'password',
          type: 'text'
        }
      ]
    });
    alert.present();
  }

  failedConfirm() {
    let alert = this.alert.create({
      title: 'Password tidak sama!',
      buttons: [
        {
          text: "Tutup",
          role: "cancel",
          handler: () => {
            console.log("Cancel close");
          }
        }
      ]
    });
    alert.present();
  }

  changePassword(newPassword:string){
    this.creds.data.password = SHA256(newPassword).toString().toUpperCase();
    
    this.service
      .patchreq("users/" + this.creds.data.email, this.creds.data)
      .subscribe(response => {
        if (response != null) {
        }
      },
      error => {
      },
      () => {
        console.log("success change pass");
        this.promptRelog();
      });
  }

  promptRelog()
  {
    let alert = this.alert.create({
      title: 'Password berhasil diubah. Tolong masuk kembali.',
      buttons: [
        {
          text: "Masuk",
          handler: () => {
            this.logout();
          }
        }
      ]
    });
    alert.present();
  }

  logout() {
    this.events.publish("user:logout");
  }
}