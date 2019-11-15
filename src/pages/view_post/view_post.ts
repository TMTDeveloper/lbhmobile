import { Component, ViewChild } from "@angular/core";
import {
  NavController,
  NavParams,
  Content,
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
import { BackendService } from "../../providers/backend.service";
import { LoadingController } from "ionic-angular";

import { Platform } from "ionic-angular";
import { AppModule } from "../../app/app.module";

import * as moment from "moment";
import { Credentials } from "../../providers/credentials.holder";
import { AndroidPermissions } from "@ionic-native/android-permissions";
import { FileChooser } from "@ionic-native/file-chooser";
import { FilePath } from "@ionic-native/file-path";

@Component({
  selector: "page-view_post",
  templateUrl: "view_post.html"
})
export class ViewPostPage {
  documents = [];
  jenis = "kasus";
  post_id = "";
  view = "post";

  judul = "";

  images = [];

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
    public toastCtrl: ToastController,
    private fileChooser: FileChooser,
    private filePath: FilePath
  ) {
    this.getUserData();

    this.type = navParams.get("type");
    this.post_id = navParams.get("post_id");
    this.judul = navParams.get("judul");
    this.type = navParams.get("type");
  }

  @ViewChild(Content) content: Content;

  ngAfterViewInit() {
    this.getCurrentPostDetails_OLD();
  }

  afterGetPost() {
    this.reqNewestPosts();
    this.reqNewestProgress();
    // this.updatePost();
  }

  role;

  getUserData() {
    this.userName = this.creds.data["name"];
    this.role = this.creds.data["role"];

    //console.log(this.role);
  }

  backToPostPage() {
    this.navCtrl.pop();
    //console.log(this.post_id);
  }

  toggleView() {
    this.view = this.view == "post" ? "comment" : "post";

    // resize the view
    this.content.resize();
  }

  kelaminIs(index) {
    if (index === 0) {
      return "null";
    }
    if (index === 1) {
      return "Perempuan";
    }
    if (index === 2) {
      return "Laki-laki";
    }
    if (index === 3) {
      return "Lain-lain";
    }
  }

  peradilanIs(jenis) {
    if (jenis === 0) {
      return "null";
    }
    if (jenis == 1) {
      return "Pelanggaran HAM";
    }
    if (jenis == 2) {
      return "Pidana";
    }
    if (jenis == 3) {
      return "Perdata";
    }
    if (jenis == 4) {
      return "Lain-lain";
    }
  }

  kegiatanIs(index) {
    if (index === 0) {
      return "null";
    }
    if (index === 1) {
      return "Peserta Acara";
    }
    if (index === 2) {
      return "Pelaksana Acara";
    }
    if (index === 3) {
      return "Acara Kerjasama";
    }
    if (index === 4) {
      return "Lain-lain";
    }
  }

  changeView(viewIndex) {
    if (viewIndex === 1) {
      this.view = "post";
    }
    if (viewIndex === 2) {
      this.view = "comment";
    }
    if (viewIndex === 3) {
      this.view = "progress";
    }
    if (viewIndex === 4) {
      this.view = "close";
    }

    // resize the view
    this.content.resize();
  }

  formatNewline(text) {
    let formatted = this.replaceAll(text, '\n', '<br\/>');

    return formatted;
  }

  replaceAll(str, find, replace) {
    return str.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
  }

  escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  }

  users = [];
  userName = "Nurul";

  postLimit = 5;
  items1 = [];
  items2 = [];

  postQuery = {
    "filter[where][no_post]": this.post_id,
    "filter[limit]": this.postLimit,
    "filter[skip]": 0,
    "filter[order]": ["date_created DESC"]
  };

  message = "";
  message2 = "";

  sendParams = {
    no_post: this.post_id,
    posted_by: this.creds.data.email,
    posted_name: this.creds.data.name,
    message: this.message,
    date_created: moment().format()
  };

  sendProgressParams = {
    no_post: this.post_id,
    message: this.message,
    date_created: moment().format()
  };

  timeOut = 0;

  dateToTime(time) {
    return moment(time).format("DD/MM/YY hh:mm");
  }

  dateToDate(time) {
    return moment(time).format("DD/MM/YY");
  }

  send = () => {
    this.sendParams["no_post"] = this.post_id;
    this.sendParams["message"] = this.message;
    this.sendParams["date_created"] = moment().format();

    // empty the chat bar
    this.message = "";

    // post to server. upon success, add to list
    this.service.postreq("postdetails", this.sendParams).subscribe(
      response => {
        if (response != null) {
          //console.log(response);

          // update the post
          this.updatePost();

          // append the new posts to current array
          let newMsg = {
            no_post: this.sendParams.no_post,
            posted_by: this.sendParams.posted_by,
            posted_name: this.sendParams.posted_name,
            message: this.sendParams.message,
            date_created: this.sendParams.date_created
          };

          this.items1.push(newMsg);

          //console.log(this.items1.length);

          // populate the list
          // this.populateList(this.items);

          // resize the view
          this.content.resize();
        }
      },
      error => {
        if (error != null) {
          //console.log("failed to send message! \n error:" + error);
        }
      }
    );
  };

  reqNewestPosts = () => {
    //console.log(this.post_id);

    this.timeOut = 0;

    // return the tab to null
    //this.jenis = jenis;

    // set the query
    this.postQuery["filter[where][no_post]"] = this.post_id;

    // add the offset
    this.postQuery["filter[skip]"] = this.items1.length;

    if (this.items1.length > 0) return;

    this.service
      .getReqNew("postdetails", this.postQuery)
      .subscribe(response => {
        if (response != null) {
          //console.log(response);

          let newItems: any;
          newItems = response;

          newItems.forEach(newItem => {
            // append the new posts to current array
            this.items1.reverse();
            this.items1.push(newItem);
            this.items1.reverse();
          });

          //console.log(this.items1.length);

          // populate the list
          // this.populateList(this.items);
        }
      });
  };

  doInfinite(infiniteScroll) {
    //console.log("Begin async operation");
    //console.log(this.postQuery);

    // set the query
    this.postQuery["filter[where][no_post]"] = this.post_id;

    // add the offset
    this.postQuery["filter[skip]"] = this.items1.length;

    this.timeOut = 500;

    setTimeout(() => {
      this.service
        .getReqNew("postdetails", this.postQuery)
        .subscribe(response => {
          if (response != null) {
            //console.log(response);

            let newItems: any;
            newItems = response;

            newItems.forEach(newItem => {
              // append the new posts to current array
              this.items1.reverse();
              this.items1.push(newItem);
              this.items1.reverse();
            });

            //console.log(this.items1.length);

            // populate the list
            // this.populateList(this.items);

            // end operation
            //console.log("Async operation has ended");
            infiniteScroll.complete();
          }
        });
    }, this.timeOut);
  }

  askSendProgress() {
    let alert = this.alert.create({
      title: "Kirim laporan perkembangan?",
      subTitle: "Laporan anda akan dinilai oleh pengacara",
      buttons: [
        {
          text: "Ya",
          handler: () => {
            this.sendProgress();
          }
        },
        {
          text: "Tidak",
          role: "cancel",
          handler: () => {
            //console.log("Cancel close");
          }
        }
      ]
    });
    alert.present();
  }

  sendProgress = () => {
    this.sendProgressParams["no_post"] = this.post_id;
    this.sendProgressParams["message"] = this.message2;
    this.sendProgressParams["date_created"] = moment().format();

    // empty the chat bar
    this.message2 = "";

    // post progress to server. upon success, add to list
    this.service.postreq("developments", this.sendProgressParams).subscribe(
      response => {
        if (response != null) {
          //console.log(response);

          // update the post
          // this.updatePost();

          // append the new posts to current array
          let newMsg = {
            no_post: this.sendProgressParams.no_post,
            message: this.sendProgressParams.message,
            date_created: this.sendProgressParams.date_created
          };

          this.items2.push(newMsg);

          //console.log(this.items2.length);

          // populate the list
          // this.populateList(this.items);

          // resize the view
          this.content.resize();
        }
      },
      error => {
        if (error != null) {
          //console.log("failed to send message!");
          //console.log(error);
        }
      }
    );
  };

  reqNewestProgress = () => {
    //console.log(this.post_id);

    this.timeOut = 0;

    // return the tab to null
    //this.jenis = jenis;

    // set the query
    this.postQuery["filter[where][no_post]"] = this.post_id;

    // add the offset
    this.postQuery["filter[skip]"] = this.items2.length;

    if (this.items2.length > 0) return;

    this.service
      .getReqNew("developments", this.postQuery)
      .subscribe(response => {
        if (response != null) {
          //console.log(response);

          let newItems: any;
          newItems = response;

          newItems.forEach(newItem => {
            // append the new posts to current array
            this.items2.reverse();
            this.items2.push(newItem);
            this.items2.reverse();
          });
        }
      });
  };

  doInfiniteProgress(infiniteScroll) {
    //console.log("Begin async operation");
    //console.log(this.postQuery);

    // set the query
    this.postQuery["filter[where][no_post]"] = this.post_id;

    // add the offset
    this.postQuery["filter[skip]"] = this.items2.length;

    this.timeOut = 500;

    setTimeout(() => {
      this.service
        .getReqNew("developments", this.postQuery)
        .subscribe(response => {
          if (response != null) {
            //console.log(response);

            let newItems: any;
            newItems = response;

            newItems.forEach(newItem => {
              // append the new posts to current array
              this.items2.reverse();
              this.items2.push(newItem);
              this.items2.reverse();
            });

            //console.log(this.items2.length);

            // populate the list
            // this.populateList(this.items);

            // end operation
            //console.log("Async operation has ended");
            infiniteScroll.complete();
          }
        });
    }, this.timeOut);
  }

  type: number = 1;

  posted_by;
  posted_name;
  daerah;
  waktu;
  propinsi;
  penggugat;
  tergugat;
  kronologi;
  pembelajaran;

  post_status;

  getCurrentPostDetails_OLD = () => {
    //console.log(this.service.baseurl);
    let loading = this.presentLoading();

    this.timeOut = 0;
    let url;

    if (this.type == 1) url = "postheaders";
    if (this.type == 2) url = "kegiatanheaders";

    // set the query for current post
    //console.log(this.post_id);
    let postQueryCur = {
      "filter[where][no_post]": this.post_id
    };

    //console.log(this.type + url);

    this.service.getReqNew(url, postQueryCur).subscribe(response => {
      if (response != null) {
        //console.log(response);

        // kasus
        if (response[0].type == 1) {
          this.object = response;
          this.posted_by = response[0]["posted_by"];
          this.posted_name = response[0]["posted_name"];
          this.waktu = response[0]["tanggal_kejadian"];
          this.propinsi = response[0]["province"];
          this.penggugat = response[0]["nama_korban"];
          this.tergugat = response[0]["nama_pelaku"];
          this.kronologi = response[0]["kronologi"];
          this.pembelajaran = response[0]["pembelajaran"];
          this.usia = response[0]["usia"];
          this.kelamin = response[0]["jenis_kelamin"];
          this.jenis_kejadian = response[0]["jenis_kejadian"];
        }

        // kegiatan
        if (response[0].type == 2) {
          this.object = response;
          this.posted_by = response[0]["posted_by"];
          this.posted_name = response[0]["posted_name"];
          this.waktu = response[0]["tanggal_kegiatan"];
          this.propinsi = response[0]["province"];
          this.penggugat = response[0]["nama_pelaksana"];
          this.kronologi = response[0]["deskripsi"];
          this.jenis_kejadian = response[0]["jenis_kegiatan"];
        }

        // populate the list
        // this.populateList(this.items);

        // append the file links
        this.getFileAttachments();

        // get details
        this.afterGetPost();

        loading.dismiss();
      }
    });
  };

  object;
  usia;
  kelamin;
  jenis_kejadian;

  getCurrentPostDetails() {
    let loading = this.presentLoading();

    let postQuery = {
      "filter[where][no_post]": this.post_id
    };
    //console.log(postQuery);

    this.service.getReqNew("postheaders", postQuery).subscribe(
      response => {
        if (response != null) {
          //console.log(response);

          // append the post details
          this.posted_by = response["posted_by"];
          this.posted_name = response["posted_name"];
          this.waktu = response["tanggal"];
          this.propinsi = response["province"];
          this.penggugat = response["nama_korban"];
          this.tergugat = response["nama_pelaku"];
          this.kronologi = response["kronologi"];
          this.pembelajaran = response["pembelajaran"];
          this.object = response;
          this.usia = response["usia"];
          this.kelamin = response["kelamin"];
          this.jenis_kejadian = response["jenis_kejadian"];

          // populate the list
          // this.populateList(this.items);

          // append the file links
          this.getFileAttachments();

          // get details
          this.afterGetPost();

          loading.dismiss();
        }
      },
      error => {
        this.alertFailGetPost();
        this.navCtrl.pop();
      }
    );
  }

  getFileAttachments() {
    this.service
      .postreq("findupload", { where: { no_post: this.post_id } })
      .subscribe(response => {
        if (response != null) {
          //console.log(response);

          let newItems: any;
          newItems = response;

          newItems.forEach(newItem => {
            // append the new posts to current array
            this.images.push(newItem);
          });

          //console.log(this.items1.length);

          // populate the list
          // this.populateList(this.items);

          // end operation
          //console.log("Async operation has ended");
        }
      }, error => {
        if (error != null) {
          //console.log(error);
        }
      });
  }

  result: any;
  downloadAndOpenPdf(file, name) {
    this.androidPermissions
      .hasPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
      .then(status => {
        if (status.hasPermission) {
          //console.log(this.service.baseurl + "download?filename=" + file);
          let path = this.file.dataDirectory;
          // this.presentToast(this.service.baseurl + "download?filename=" + file);

          const transfer = this.transfer.create();
          transfer
            .download(
              this.service.baseurl + "download?filename=" + file,
              this.file.externalRootDirectory +
              "Download/" +
              name.split(" ").join("_")
            )
            .then(
              entry => {
                this.presentToast(
                  "File berhasil diunduh ke" +
                  this.file.externalRootDirectory +
                  "Download/"
                );
                // get the file name and split at the end
                // file;

                // this.result = JSON.stringify(entry);
                // let url = entry.toURL();
                // this.opener
                //   .open(url, "application/pdf")
                //   .then(() => //console.log("success"));
                // this.document.viewDocument(url, "application/pdf", {});
              },
              error => {
                this.presentToast("Pengunduhan file gagal");
              }
            );
        } else {
          this.androidPermissions
            .requestPermission(
              this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE
            )
            .then(status => {
              if (status.hasPermission) {
                //console.log(this.service.baseurl + "download?filename=" + file);
                let path = this.file.dataDirectory;
                // this.presentToast(this.service.baseurl + "download?filename=" + file);
                const transfer = this.transfer.create();
                transfer
                  .download(
                    this.service.baseurl + "download?filename=" + file,
                    this.file.externalRootDirectory +
                    "Download/" +
                    name.split(" ").join("_")
                  )
                  .then(
                    entry => {
                      this.presentToast(
                        "File berhasil diunduh ke" +
                        this.file.externalRootDirectory +
                        "Download/"
                      );
                      // get the file name and split at the end
                      // file;

                      // this.result = JSON.stringify(entry);
                      // let url = entry.toURL();
                      // this.opener
                      //   .open(url, "application/pdf")
                      //   .then(() => //console.log("success"));
                      // this.document.viewDocument(url, "application/pdf", {});
                    },
                    error => {
                      this.presentToast("Pengunduhan file gagal");
                    }
                  );
              }
            });
        }
      });
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: "bottom"
    });

    toast.onDidDismiss(() => {
      //console.log("Dismissed toast");
    });

    toast.present();
  }

  purgeList(refresh) {
    this.items1 = [];
    this.doInfinite(refresh);
  }

  updatePost() {
    var updateParams = {
      id_user: this.creds.data.email,
      no_post: this.post_id,
      last_access: moment(this.sendParams["date_created"]).add(1, "seconds")
    };

    // post update to server. upon success, add to list
    this.service.postreq("post-logs", updateParams).subscribe(
      response => {
        if (response != null) {
          //console.log(response);
        }
      },
      error => {
        if (error != null) {
          //console.log(error);
        }
      }
    );
  }

  askApproveProgress(development) {
    let alert = this.alert.create({
      title: "Apakah laporan ini dinilai baik?",
      subTitle: "Penilaian ini akan tersimpan dalam riwayat pendamping",
      buttons: [
        {
          text: "Ya",
          handler: () => {
            this.approveProgress(development);
          }
        },
        {
          text: "Tidak",
          role: "cancel",
          handler: () => {
            //console.log("Cancel close");
          }
        }
      ]
    });
    alert.present();
  }

  approveProgress(development) {
    // subscribe to patch request.
    // if fail, empty pembelajaran
    development.approved = "Y";

    //console.log(development);

    let query = {
      "where[no_post]": development.no_post,
      "where[ind]": development.ind
    }

    this.service.patchreqnew("developments", development, query).subscribe(
      response => {
        if (response != null) {
          //console.log(response);
        }
      },
      error => {
        if (error != null) {
          //console.log(error);
        }
      },
      () => {
        //console.log("success");
      }
    );
  }

  alertFailGetPost() {
    let alert = this.alert.create({
      subTitle: "Gagal menemukan halaman!",
      buttons: [
        {
          text: "Ok",
          handler: () => { }
        }
      ]
    });
    alert.present();
  }

  tempPembelajaran;

  askClosePost() {
    let postTxt = this.type == 1 ? "kasus" : "kegiatan";
    let alert = this.alert.create({
      title: "Apakah anda ingin tutup " + postTxt + " ini?",
      buttons: [
        {
          text: "Ya",
          handler: () => {
            this.closePost();
          }
        },
        {
          text: "Tidak",
          role: "cancel",
          handler: () => {
            //console.log("Cancel close");
            this.pembelajaran = "";
          }
        }
      ]
    });
    alert.present();
  }

  closePost() {
    // subscribe to patch request.
    // if fail, empty pembelajaran
    this.object[0].pembelajaran = this.tempPembelajaran;
    this.object[0].status = 2;

    //console.log(this.object);

    this.service.patchreq("postheaders/" + this.post_id, this.object[0]).subscribe(
      response => {
        if (response != null) {
          //console.log(response);
        }
      },
      error => {
        if (error != null) {
          //console.log(error);
        }
      },
      () => {
        //console.log("success");
        this.pembelajaran = this.tempPembelajaran;
        this.changeView(1);
      }
    );
  }

  showHint1() {
    let alert = this.alert.create({
      title: 'Laporan ini sedang menunggu penilaian pengacara.',
      buttons: [
        {
          text: "Ok"
        }
      ]
    });
    alert.present();
  }

  showHint2() {
    let alert = this.alert.create({
      title: 'Laporan ini sudah dinilai baik oleh pengacara.',
      buttons: [
        {
          text: "Ok"
        }
      ]
    });
    alert.present();
  }

  showHint3() {
    let alert = this.alert.create({
      title: 'Laporan ini sudah dinilai.',
      buttons: [
        {
          text: "Ok"
        }
      ]
    });
    alert.present();
  }

  viewComment() { }

  presentLoading() {
    const loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });
    loader.present();
    return loader;
  }

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

  uploadFiles() {
    let loading = this.loadingCtrl.create({
      content: "Loading..."
    });
    loading.present();

    let alertMediaUploadFailed = this.alert.create({
      title: "Gagal menambahkan dokumen",
      subTitle: "Silahkan menambahkan lagi di kasus.",
      buttons: ["Ok"]
    });

    // upload image operation [ADD WARNING IF FAILED TO UPLOAD]
    if (this.uploads.length > 0) {
      this.uploadImage(this.post_id).then(response => {
        loading.dismiss();
        this.refreshImgList();
      }, error => {
        loading.dismiss();
        alertMediaUploadFailed.present();
      });
    } else {
      loading.dismiss();
    }
  }

  removeUpload(index){
    this.uploads.splice(index,1);
  }

  refreshImgList() {
    this.uploads = [];
    this.images = [];

    this.getFileAttachments();
  }
}
