import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  ActionSheet,
  ActionSheetController,
  ToastController,
  AlertController
} from "ionic-angular";
import { File } from "@ionic-native/file";
import {
  DocumentViewer,
  DocumentViewerOptions
} from "@ionic-native/document-viewer";
import { FileTransfer, FileTransferObject } from "@ionic-native/file-transfer";
import { FileOpener } from "@ionic-native/file-opener";
import { BackendService } from "../../../providers/backend.service";
import { LoadingController } from "ionic-angular";

import { Platform } from "ionic-angular";
import * as moment from "moment";
import { ViewPostPage } from "../../view_post/view_post";

import { FileChooser } from "@ionic-native/file-chooser";
import { FilePath } from "@ionic-native/file-path";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { OptionValidator } from "./option_validator";
import { Credentials } from "../../../providers/credentials.holder";
import { Observable } from "rxjs";
import { onErrorResumeNext } from "rxjs/operator/onErrorResumeNext";

@Component({
  selector: "page-new_post",
  templateUrl: "new_post.html"
})
export class NewPostPage {
  documents = [];
  sendParams = {
    no_post: "string",
    type: 1,
    posted_by: "string",
    title: "string",
    organisasi: 0,
    status: 0,
    province_id: "xx",
    province: "string",
    regency_id: "xxxx",
    regency: "string",
    district_id: "string",
    district: "string",
    village_id: "xxxxxxxxxx",
    village: "string",
    nama_korban: "string",
    nama_pelaku: "string",
    jenis_kejadian: 0,
    tanggal_kejadian: "2019-01-16T09:05:47.831Z",
    kronologi: "string",
    pembelajaran: "string",
    date_created: moment().format(),
    date_modified: moment().format()
  };

  constructor(
    private document: DocumentViewer,
    private file: File,
    private transfer: FileTransfer,
    public navCtrl: NavController,
    private opener: FileOpener,
    private service: BackendService,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public platform: Platform,
    public fileChooser: FileChooser,
    public filePath: FilePath,
    public formBuilder: FormBuilder,
    public creds: Credentials,
    public alertCtrl: AlertController
  ) {
    this.formKasus = formBuilder.group({
      judul: ["", Validators.required],
      propinsi: [{ id: "", name: "" }, OptionValidator.isValid],
      kabupaten: [{ id: "", name: "" }, OptionValidator.isValid],
      kecamatan: [{ id: "", name: "" }, OptionValidator.isValid],
      kelurahan: [{ id: "", name: "" }, OptionValidator.isValid],
      penggugat: ["", Validators.required],
      tergugat: ["", Validators.required],
      kronologi: ["", Validators.required]
    });

    this.type = navParams.get("type");
    console.log(this.type);
    this.userName = navParams.get("userName");

    this.loadAllAreas();
  }

  formKasus: any;

  submitAttempt: boolean;

  userName = "Nurul";
  type: any;
  post_id;

  judul: any;
  daerah;
  propinsi: any;
  kabupaten: any;
  kecamatan: any;
  kelurahan: any;
  penggugat;
  tergugat;
  kronologi;

  propinsiList = [];
  kabupatenList = [];
  kecamatanList = [];
  kelurahanList = [];

  updateAllAreas(index) {
    if (index == 0) {
      let query = {
        "filter[where][province_id]": this.formKasus.controls.propinsi.value.id,
        "filter[order]": "name asc"
      };
      this.kabupatenList = [];
      this.kecamatanList = [];
      this.kelurahanList = [];

      this.service.getReqNew("regencies", query).subscribe(
        response => {
          if (response != null) {
            // view the created page
            console.log(response);
            let newList: any = response;
            this.kabupatenList = newList;
          }
        },
        error => {
          if (error != null) {
            console.log("failed to create post!");
            console.log(error);
          }
        }
      );
    }

    if (index == 1) {
      let query = {
        "filter[where][regency_id]": this.formKasus.controls.kabupaten.value.id,
        "filter[order]": "name asc"
      };
      this.kecamatanList = [];
      this.kelurahanList = [];

      this.service.getReqNew("districts", query).subscribe(
        response => {
          if (response != null) {
            // view the created page
            console.log(response);
            let newList: any = response;
            this.kecamatanList = newList;
          }
        },
        error => {
          if (error != null) {
            console.log("failed to create post!");
            console.log(error);
          }
        }
      );
    }

    if (index == 2) {
      let query = {
        "filter[where][district_id]": this.formKasus.controls.kecamatan.value
          .id,
        "filter[order]": "name asc"
      };
      this.kelurahanList = [];
      this.service.getReqNew("villages", query).subscribe(
        response => {
          if (response != null) {
            // view the created page
            console.log(response);
            let newList: any = response;
            this.kelurahanList = newList;
          }
        },
        error => {
          if (error != null) {
            console.log("failed to create post!");
            console.log(error);
          }
        }
      );
    }
  }

  loadAllAreas() {
    // get the areas ids
    this.service
      .getReqNew("provinces", { "filter[order]": "name asc" })
      .subscribe(
        response => {
          if (response != null) {
            // view the created page
            console.log(response);
            let newList: any = response;
            this.propinsiList = newList;
          }
        },
        error => {
          if (error != null) {
            console.log("failed to create post!");
            console.log(error);
          }
        }
      );
  }

  items1 = [];

  createNewPost = () => {
    this.sendParams["no_post"] = "";
    this.sendParams["posted_by"] = this.userName;
    this.sendParams["date_created"] = moment().format();
    this.sendParams["pembelajaran"] = "";

    this.sendParams.title = this.formKasus.controls.judul.value;
    this.sendParams.province = this.formKasus.controls.propinsi.value.name;
    this.sendParams.province_id = this.formKasus.controls.propinsi.value.id;
    this.sendParams.regency = this.formKasus.controls.kabupaten.value.name;
    this.sendParams.regency_id = this.formKasus.controls.kabupaten.value.id;
    this.sendParams.district = this.formKasus.controls.kecamatan.value.name;
    this.sendParams.district_id = this.formKasus.controls.kecamatan.value.id;
    this.sendParams.village = this.formKasus.controls.kelurahan.value.name;
    this.sendParams.village_id = this.formKasus.controls.kelurahan.value.id;
    this.sendParams.nama_korban = this.formKasus.controls.penggugat.value;
    this.sendParams.nama_pelaku = this.formKasus.controls.tergugat.value;
    this.sendParams.kronologi = this.formKasus.controls.kronologi.value;
    this.sendParams.organisasi = this.creds.data.organisasi;
    this.sendParams.status = 1;
    this.sendParams.type = this.type;
    // empty the chat bar
    this.kronologi = "";

    let loading = this.loadingCtrl.create({
      content: "Loading..."
    });
    loading.present();
    let alert = this.alertCtrl.create({
      title: "Error",
      subTitle: "Pengirimin formulir gagal",
      buttons: ["Ok"]
    });
    // post to server. upon success, add to list
    this.service.postreq("postheaders", this.sendParams).subscribe(
      response => {
        if (response != null) {
          console.log(response);

          // append the new posts to current array
          let newMsg = {
            no_post: this.sendParams.no_post,
            posted_by: this.sendParams.posted_by,
            message: this.sendParams.kronologi,
            date_created: this.sendParams.date_created
          };

          this.items1.push(newMsg);

          this.uploadImage(response.no_post).subscribe(response => {
            if (response) {
              loading.dismiss();
              this.navCtrl.remove(1).then(response=>{
                this.navCtrl.push(ViewPostPage, {
                  "post_id": "response.no_post",
                  "judul": this.formKasus.controls.judul.value
                });
              })
            }
          });

          console.log(this.items1.length);

          // populate the list
          // this.populateList(this.items);
        }
      },
      error => {
        if (error != null) {
          loading.dismiss();

          alert.present();
          console.log("failed to create post!");
          console.log(error);
        }
      }
    );
  };

  viewCreatedPost(no_post) {
    this.navCtrl.getPrevious().data.waitingNewPost = true;
    this.navCtrl.pop();
    this.navCtrl.push(ViewPostPage, { post_id: no_post });
  }

  private prepareSave(no_post): any {
    let input = new FormData();
    input.append("no_post", no_post);
    this.uploads.forEach((element, ind) => {
      input.append("file", element);
    });
    return input;
  }

  uploads = [];
  test: string;
  testres: string;
  optionsss: string;

  uploadImage(no_post) {
    return Observable.create(observer => {
      const fileTransfer: FileTransferObject = this.transfer.create();
      this.uploads.forEach(async (element, id) => {
        var options = {
          fileKey: "file",
          fileName: element.substr(element.lastIndexOf("/") + 1),
          chunkedMode: false,
          mimeType: "multipart/form-data",
          params: { no_post: no_post }
        };
        this.optionsss = JSON.stringify(options);

        await fileTransfer
          .upload(element, "http://178.128.212.2:3003/uploadpost", options)
          .then(
            res => {
              this.testres = JSON.stringify(res);
            },
            error => {
              this.test = JSON.stringify(error);
            }
          );
        if (id == 0) {
          observer.next(true);
          observer.complete();
        }
      });
    });
  }

  addImage() {}

  addFile() {
    this.fileChooser
      .open()
      .then(uri => {
        // add the file uri
        this.filePath.resolveNativePath(uri).then(filePath => {
          this.uploads.push(filePath);
        });
      })
      .catch(e => {
        // alert
      });
  }
}
