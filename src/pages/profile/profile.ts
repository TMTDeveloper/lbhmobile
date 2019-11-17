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
import { FileTransfer, FileTransferObject } from "@ionic-native/file-transfer";
import { FileOpener } from "@ionic-native/file-opener";
import { BackendService } from "../../providers/backend.service";
import { LoadingController } from "ionic-angular";

import { Platform } from "ionic-angular";
import { AppModule } from "../../app/app.module";

import * as moment from "moment";
import { Credentials } from "../../providers/credentials.holder";
import { AndroidPermissions } from "@ionic-native/android-permissions";

import { SHA256 } from "crypto-js";
import { FileChooser } from "@ionic-native/file-chooser";
import { FilePath } from "@ionic-native/file-path";

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
    public fileChooser: FileChooser,
    public filePath: FilePath,
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

    this.updateOrganisasi();
  }

  roleIs(role) {
    if (role == 1) {
      return "Paralegal";
    }
    if (role == 2) {
      return "Pengacara";
    }
    if (role == 3) {
      return "Pengawas";
    }
    if (role == 0) {
      return "Admin";
    }
  }

  organisasiList;

  updateOrganisasi() {
    this.organisasiList = [];

    let query = {
      "filter[where][and][0][keyword]": "organisasi",
      "filter[where][and][1][active]": "Y"
    };

    this.service.getReqNew("generals", query).subscribe(
      response => {
        if (response != null) {
          // view the created page
          //console.log(response);
          let newList: any = response;
          this.organisasiList = newList;

          this.organisasiLabel = this.organisasiIs(this.organisasi);
        }
      },
      error => {
        if (error != null) {
          //console.log("failed to get dokumen!");
          //console.log(error);
        }
      }
    );
  }

  organisasiLabel = "";

  organisasiIs(organisasi) {
    return this.organisasiList[organisasi - 1].value_keyword;
  }

  organisasiIs_OLD(organisasi) {
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
            //console.log("Cancel close");
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
            //console.log("Cancel close");
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
            //console.log("Cancel close");
          }
        }
      ]
    });
    alert.present();
  }

  changePassword(newPassword: string) {
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
          //console.log("success change pass");
          this.promptRelog();
        });
  }

  getUserPhoto(email){
    // use url, if error, use default pic
    let urlString;

    urlString = "http://68.183.191.201:3003/downloadprofpic?email=" + email;

    return urlString
  }

  photo;

  askChangePic() {
    this.fileChooser
      .open()
      .then(uri => {
        // add the file uri
        this.filePath.resolveNativePath(uri).then(filePath => {
          // check file size (max 5mb)
          // this.getFileSize(filePath).
          // then(function(fileSize){
          //    //console.log(fileSize);

          //    if (fileSize<500000) this.uploads.push(filePath);
          //    else this.alertMaxSize();
          // }).
          // catch(function(err){
          //   console.error(err);
          // });

          // push
          this.photo = filePath;
          this.confirmChangePic();
        });
      })
      .catch(e => {
        // alert
      });
  }

  confirmChangePic() {
    let alert = this.alert.create({
      subTitle: "Apakah anda ingin menggunakan foto ini?",
      buttons: [
        {
          text: "Ya",
          handler: () => {
            this.changePic();
          }
        },
        {
          text: "Tidak",
          role: "cancel",
          handler: () => {
            //console.log("Cancel logout");
          }
        }
      ]
    });
    alert.present();
  }

  test: string;
  testres: string;
  optionsss: string;

  async changePic() {
    // if hasPic, patch. else upload new

    const fileTransfer: FileTransferObject = this.transfer.create();

    var options = {
      fileKey: "file",
      fileName: this.photo.substr(this.photo.lastIndexOf("/") + 1),
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params: { email: this.email }
    };
    this.optionsss = JSON.stringify(options);
    // old url = http://178.128.212.2:3003/uploadpost
    await fileTransfer
      .upload(this.photo, "http://68.183.191.201:3003/uploadprofpic", options)
      .then(
        res => {
          this.testres = JSON.stringify(res);
        },
        error => {
          this.test = JSON.stringify(error);
        }
      );
  }

  promptRelog() {
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

  askLogout() {
    let alert = this.alert.create({
      subTitle: "Apakah anda ingin keluar?",
      buttons: [
        {
          text: "Ya",
          handler: () => {
            this.logout();
          }
        },
        {
          text: "Tidak",
          role: "cancel",
          handler: () => {
            //console.log("Cancel logout");
          }
        }
      ]
    });
    alert.present();
  }

  logout() {
    console.log("logging out");
    this.events.publish("user:logout");
  }
}