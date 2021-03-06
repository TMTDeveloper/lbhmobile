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
import { DatePicker } from "@ionic-native/date-picker";

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
    posted_name: "string",
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
    usia: 0,
    jenis_kelamin: 0,
    tanggal_kejadian: "2019-01-16T09:05:47.831Z",
    kronologi: "string",
    pembelajaran: "",
    date_created: moment().format(),
    date_modified: moment().format()
  };

  sendParams2 = {
    no_post: "string",
    type: 0,
    posted_by: "string",
    posted_name: "string",
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
    nama_pelaksana: "string",
    jenis_kegiatan: 0,
    tanggal_kegiatan: "2019-02-19T03:17:16.226Z",
    deskripsi: "string",
    date_created: "2019-02-19T03:17:16.226Z",
    date_modified: "2019-02-19T03:17:16.226Z"
  }

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
    public alertCtrl: AlertController,
    // public window: Window,
    public alert: AlertController,
    public datePicker: DatePicker
  ) {
    this.formKasus = formBuilder.group({
      judul: ["", Validators.required],
      tanggal_kejadian: ["", Validators.required],
      jenis_kejadian: ["", Validators.required],
      propinsi: [{ id: "", name: "" }, OptionValidator.isValid],
      kabupaten: [{ id: "", name: "" }, OptionValidator.isValid],
      kecamatan: [{ id: "", name: "" }, OptionValidator.isValid],
      kelurahan: [{ id: "", name: "" }, OptionValidator.isValid],
      penggugat: ["", Validators.required],
      tergugat: [""],
      kronologi: ["", Validators.required],
      jenis_klien: ["", Validators.required],
      usia: ["", Validators.required],
      jenis_kelamin: ["", Validators.required]
    });

    this.formKegiatan = formBuilder.group({
      judul: ["", Validators.required],
      tanggal_kejadian: ["", Validators.required],
      jenis_kejadian: ["", Validators.required],
      propinsi: [{ id: "", name: "" }, OptionValidator.isValid],
      kabupaten: [{ id: "", name: "" }, OptionValidator.isValid],
      kecamatan: [{ id: "", name: "" }, OptionValidator.isValid],
      kelurahan: [{ id: "", name: "" }, OptionValidator.isValid],
      penggugat: ["", Validators.required],
      kronologi: ["", Validators.required]
    });

    this.type = navParams.get("type");
    //console.log(this.type);
    this.userName = navParams.get("userName");

    this.loadAllAreas();
    this.updateClient();
    this.updateKejadian();
  }

  formKasus: any;
  formKegiatan: any;

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
  usia;
  kelamin;

  kejadianList = [
    { value: "Pelanggaran Ham", id: 1 },
    { value: "Pidana", id: 2 },
    { value: "Perdata", id: 3 },
    { value: "Lain-lain", id: 4 }
  ];

  klienList = [{ value: "Individu", id: 0 }, { value: "Non-Individu", id: 1 }];

  kelaminList = [
    { value: "Perempuan", id: 1 },
    { value: "Laki-laki", id: 2 },
    { value: "Lain-lain", id: 3 }
  ];

  kegiatanList_OLD = [
    { value: "Peserta Acara", id: 1 }
  ]

  kegiatanList = [
    { value: "Pelatihan", id: 1 },
    { value: "Diskusi", id: 2 },
    { value: "Seminar", id: 3 },
    { value: "Pendampingan", id: 4 },
    { value: "Mediasi", id: 5 },
    { value: "Audiensi", id: 6 },
    { value: "Pembicara", id: 7 },
    { value: "Unjuk rasa", id: 8 },
    { value: "Riset", id: 9 },
    { value: "Lain-lain", id: 10 }
  ];

  propinsiList = [];
  kabupatenList = [];
  kecamatanList = [];
  kelurahanList = [];

  individu = false;

  updateKejadian() {
    this.kejadianList = [];

    let query = {
      "filter[where][and][0][keyword]": "jenis_kejadian",
      "filter[where][and][1][active]": "Y"
    };

    this.service.getReqNew("generals", query).subscribe(
      response => {
        if (response != null) {
          // view the created page
          //console.log(response);
          let newList: any = response;
          this.kejadianList = newList;
        }
      },
      error => {
        if (error != null) {
          //console.log("failed to get kejadian!");
          //console.log(error);
        }
      }
    );
  }

  loglog() {
    //console.log(this.formKasus.controls.jenis_kelamin);
  }

  updateClient() {
    if (this.formKasus.controls.jenis_klien.value.id == 0) {
      this.usia = "";
      this.kelamin = "";
      this.formKasus.controls.usia.setValue("");
      this.formKasus.controls.jenis_kelamin.setValue("");
      this.kelaminList = [
        { value: "Perempuan", id: 1 },
        { value: "Laki-laki", id: 2 },
        { value: "Lain-lain", id: 3 }
      ];

      this.individu = true;
    }

    if (this.formKasus.controls.jenis_klien.value.id == 1) {
      this.kelaminList = [];

      this.usia = "";
      this.kelamin = "";
      this.formKasus.controls.usia.setValue("  ");
      this.formKasus.controls.jenis_kelamin.setValue("  ");

      this.individu = false;
    }
  }

  updateAllAreas(index) {
    if (index == 0) {
      this.kabupatenList = [];
      this.kecamatanList = [];
      this.kelurahanList = [];

      let query = {
        "filter[where][province_id]":
          this.type == 1
            ? this.formKasus.controls.propinsi.value.id
            : this.formKegiatan.controls.propinsi.value.id,
        "filter[order]": "name asc"
      };

      this.service.getReqNew("regencies", query).subscribe(
        response => {
          if (response != null) {
            // view the created page
            //console.log(response);
            let newList: any = response;
            this.kabupatenList = newList;
          }
        },
        error => {
          if (error != null) {
            //console.log("failed to create post!");
            //console.log(error);
          }
        }
      );
    }

    if (index == 1) {
      let query = {
        "filter[where][regency_id]":
          this.type == 1
            ? this.formKasus.controls.kabupaten.value.id
            : this.formKegiatan.controls.kabupaten.value.id,
        "filter[order]": "name asc"
      };
      this.kecamatanList = [];
      this.kelurahanList = [];

      this.service.getReqNew("districts", query).subscribe(
        response => {
          if (response != null) {
            // view the created page
            //console.log(response);
            let newList: any = response;
            this.kecamatanList = newList;
          }
        },
        error => {
          if (error != null) {
            //console.log("failed to create post!");
            //console.log(error);
          }
        }
      );
    }

    if (index == 2) {
      let query = {
        "filter[where][district_id]":
          this.type == 1
            ? this.formKasus.controls.kecamatan.value.id
            : this.formKegiatan.controls.kecamatan.value.id,
        "filter[order]": "name asc"
      };
      this.kelurahanList = [];
      let emptyLabel = { id: "0000000000", district_id: "0000000", name: "TIDAK TERSEDIA" };
      this.service.getReqNew("villages", query).subscribe(
        response => {
          if (response != null) {
            // view the created page
            //console.log(response);
            let newList: any = response;
            console.log(response);
            this.kelurahanList = newList;
            this.kelurahanList.reverse();
            this.kelurahanList.push(emptyLabel);
            this.kelurahanList.reverse();
          }
        },
        error => {
          if (error != null) {
            //console.log("failed to create post!");
            //console.log(error);
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
            //console.log(response);
            let newList: any = response;
            this.propinsiList = newList;
          }
        },
        error => {
          if (error != null) {
            //console.log("failed to create post!");
            //console.log(error);
          }
        }
      );
  }

  items1 = [];

  confirmCreatePost()
  {
    let alert = this.alertCtrl.create({
      title: "Kirimkan input data?",
      subTitle: "Mohon periksa kebenaran data yang ditulis sebelum mengirim",
      buttons: [{
        text: 'Kirim',
        handler: data => {
          console.log('user confirmed create new post');
          this.createNewPost();
        }
      },
      {
        text: 'Batal',
        role: 'cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      }]
    });
    alert.present();
  }

  formatLineBreaks()
  {
    console.log(this.kronologi);
  }

  createNewPost = async () => {

    let url;
    let paramsToSend;

    // we format the line breaks
    this.formatLineBreaks();

    // begin by uploading images first.
    // if image upload fails, end operation.


    // kasus
    if (this.type == 1) {
      this.sendParams["no_post"] = "";
      this.sendParams["posted_by"] = this.creds.data.email;
      this.sendParams["posted_name"] = this.creds.data.name;
      this.sendParams["date_created"] = moment().format();
      this.sendParams["pembelajaran"] = "";

      this.sendParams.type = this.type;
      this.sendParams.tanggal_kejadian = moment(
        this.formKasus.controls.tanggal_kejadian.value,
        moment.ISO_8601
      ).format();
      this.sendParams.jenis_kejadian = this.formKasus.controls.jenis_kejadian.value;
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
      if (this.formKasus.controls.jenis_klien.value.id == 0) {
        this.sendParams.usia = Number(this.formKasus.controls.usia.value);
        this.sendParams.jenis_kelamin = Number(
          this.formKasus.controls.jenis_kelamin.value
        );
      }

      this.sendParams.organisasi = this.creds.data.organisasi;
      this.sendParams.status = 1;
      this.sendParams.type = this.type;

      url = "postheaders";
      paramsToSend = this.sendParams;
    }

    // kegiatan
    if (this.type == 2) {
      this.sendParams2["no_post"] = "";
      this.sendParams2["posted_by"] = this.creds.data.email;
      this.sendParams2["posted_name"] = this.creds.data.name;
      this.sendParams2["date_created"] = moment().format();

      this.sendParams2.type = this.type;
      this.sendParams2.tanggal_kegiatan = moment(
        this.formKegiatan.controls.tanggal_kejadian.value,
        moment.ISO_8601
      ).format();
      this.sendParams2.jenis_kegiatan = this.formKegiatan.controls.jenis_kejadian.value;
      this.sendParams2.title = this.formKegiatan.controls.judul.value;
      this.sendParams2.province = this.formKegiatan.controls.propinsi.value.name;
      this.sendParams2.province_id = this.formKegiatan.controls.propinsi.value.id;
      this.sendParams2.regency = this.formKegiatan.controls.kabupaten.value.name;
      this.sendParams2.regency_id = this.formKegiatan.controls.kabupaten.value.id;
      this.sendParams2.district = this.formKegiatan.controls.kecamatan.value.name;
      this.sendParams2.district_id = this.formKegiatan.controls.kecamatan.value.id;
      this.sendParams2.village = this.formKegiatan.controls.kelurahan.value.name;
      this.sendParams2.village_id = this.formKegiatan.controls.kelurahan.value.id;
      this.sendParams2.nama_pelaksana = this.formKegiatan.controls.penggugat.value;
      this.sendParams2.deskripsi = this.formKegiatan.controls.kronologi.value;

      this.sendParams2.organisasi = this.creds.data.organisasi;
      this.sendParams2.status = 1;
      this.sendParams2.type = this.type;

      url = "kegiatanheaders";
      paramsToSend = this.sendParams2;
    }

    // empty the chat bar
    this.kronologi = "";

    let loading = this.loadingCtrl.create({
      content: "Loading..."
    });
    loading.present();
    let alert = this.alertCtrl.create({
      title: "Pengirimin formulir gagal",
      subTitle: "Coba mengirimkan lagi.",
      buttons: ["Ok"]
    });

    let alertMediaUploadFailed = this.alertCtrl.create({
      title: "Gagal menambahkan dokumen",
      subTitle: "Silahkan menambahkan lagi di kasus.",
      buttons: ["Ok"]
    });

    // check fail
    let fail = false;

    //console.log(this.formKasus);

    // post to server. upon success, add to list
    await this.service.postreq(url, paramsToSend).subscribe(
      async response => {
        if (response != null) {
          //console.log(response);

          let blankReq = {
            no_post: response.no_post,
            posted_by: this.creds.data.email
          };

          // add a blank message to show this is user's post
          await this.service.postreq("postdetails", blankReq).subscribe(
            response => {
              //console.log(response);
            },
            error => {
              if (error != null) {
                fail = true;
                //console.log("failed to send message!");
              }
            }
          );

          // upload image operation [ADD WARNING IF FAILED TO UPLOAD]
          if (this.uploads.length > 0) {
            this.uploadImage(response.no_post).then(response => {
              loading.dismiss();
              this.viewCreatedPost(response);
            }, error => {
              loading.dismiss();
              alertMediaUploadFailed.present();
              this.viewCreatedPost(response);
            });
          } else {
            loading.dismiss();
            this.viewCreatedPost(response);
          }

          //if (!fail)

          // populate the list
          // this.populateList(this.items);
        }
      },
      error => {
        if (error != null) {
          loading.dismiss();

          alert.present();
          //console.log("failed to create post!");
          //console.log(error);
        }
      }
    );
  };

  viewCreatedPost(response) {
    // this.navCtrl.getPrevious().data.waitingNewPost = true;
    // this.navCtrl.pop();
    // this.navCtrl.push(ViewPostPage, { post_id: no_post });

    if (this.type == 1){
      this.navCtrl.remove(1).then(resp => {
        this.navCtrl.push(ViewPostPage, {
          type: 1,
          post_id: response.no_post,
          judul:
            this.type == 1
              ? this.formKasus.controls.judul.value
              : this.formKegiatan.controls.judul.value,
          posted_by: this.sendParams.posted_by,
          posted_name: this.sendParams.posted_name,
          tanggal_kejadian: this.sendParams.tanggal_kejadian,
          province: this.sendParams.province,
          nama_korban: this.sendParams.nama_korban,
          usia: this.sendParams.usia,
          kelamin: this.sendParams.jenis_kelamin,
          nama_pelaku: this.sendParams.nama_pelaku,
          kronologi: this.sendParams.kronologi,
          jenis_kejadian: this.sendParams.jenis_kejadian,
          object: this.sendParams,
          pembelajaran: this.sendParams.pembelajaran
        });
      });
    }

    if (this.type == 2){
      this.navCtrl.remove(1).then(resp => {
        this.navCtrl.push(ViewPostPage, {
          type: 2,
          post_id: response.no_post,
          judul:
            this.type == 1
              ? this.formKasus.controls.judul.value
              : this.formKegiatan.controls.judul.value,
          posted_by: this.sendParams2.posted_by,
          posted_name: this.sendParams2.posted_name,
          tanggal_kejadian: this.sendParams2.tanggal_kegiatan,
          province: this.sendParams2.province,
          nama_korban: this.sendParams2.nama_pelaksana,
          kronologi: this.sendParams2.deskripsi,
          jenis_kejadian: this.sendParams2.jenis_kegiatan,
          object: this.sendParams2
        });
      });
    }
  }

  viewCreatedPost_OLD(response) {
    // this.navCtrl.getPrevious().data.waitingNewPost = true;
    // this.navCtrl.pop();
    // this.navCtrl.push(ViewPostPage, { post_id: no_post });

    this.navCtrl.remove(1).then(resp => {
      this.navCtrl.push(ViewPostPage, {
        type: this.sendParams.type,
        post_id: response.no_post,
        judul:
          this.type == 1
            ? this.formKasus.controls.judul.value
            : this.formKegiatan.controls.judul.value,
        posted_by: this.sendParams.posted_by,
        posted_name: this.sendParams.posted_name,
        tanggal_kejadian: this.sendParams.tanggal_kejadian,
        province: this.sendParams.province,
        nama_korban: this.sendParams.nama_korban,
        usia: this.sendParams.usia,
        kelamin: this.sendParams.jenis_kelamin,
        nama_pelaku: this.sendParams.nama_pelaku,
        kronologi: this.sendParams.kronologi,
        jenis_kejadian: this.sendParams.jenis_kejadian,
        object: this.sendParams,
        pembelajaran: this.sendParams.pembelajaran
      });
    });
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

  async uploadImage(no_post) {
    const fileTransfer: FileTransferObject = this.transfer.create();

    for (let element of this.uploads) {
      var options = {
        fileKey: "file",
        fileName: element.substr(element.lastIndexOf("/") + 1),
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params: { no_post: no_post }
      };
      this.optionsss = JSON.stringify(options);
      // old url = http://178.128.212.2:3003/uploadpost
      await fileTransfer
        .upload(element, "http://68.183.191.201:3003/uploadpost", options)
        .then(
          res => {
            this.testres = JSON.stringify(res);
          },
          error => {
            this.test = JSON.stringify(error);
          }
        );
    }
  }

  addImage() { }

  addFile() {
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
          this.uploads.push(filePath);
        });
      })
      .catch(e => {
        // alert
      });
  }

  alertMaxSize() {
    let alert = this.alert.create({
      subTitle: "Maksimum ukuran 5MB!",
      buttons: [
        {
          text: "Ok",
          handler: () => { }
        }
      ]
    });
    alert.present();
  }

  alertInvalidFile() {
    let alert = this.alert.create({
      subTitle: "Gagal mengambil file!",
      buttons: [
        {
          text: "Ok",
          handler: () => { }
        }
      ]
    });
    alert.present();
  }

  getFileSize(fileUri) {
    return new Promise(function (resolve, reject) {
      this.window.resolveLocalFileSystemURL(
        fileUri,
        function (fileEntry) {
          fileEntry.file(
            function (fileObj) {
              resolve(fileObj.size);
            },
            function (err) {
              reject(err);
            }
          );
        },
        function (err) {
          reject(err);
        }
      );
    });
  }

  insertDate() {
    this.datePicker
      .show({
        date: new Date(),
        mode: "date",
        androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
      })
      .then(
        date => {
          let dateString = moment(date).format();
          if (this.type == 1)
            this.formKasus.controls["tanggal_kejadian"].setValue(dateString);
          if (this.type == 1)
            this.formKegiatan.controls["tanggal_kejadian"].setValue(dateString);
        },
        err => console.log("Error occurred while getting date: ", err)
      );
  }

  presentLoading() {
    const loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });
    loader.present();
    return loader;
  }
}
