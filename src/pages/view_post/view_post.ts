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
import { FileTransfer } from "@ionic-native/file-transfer";
import { FileOpener } from "@ionic-native/file-opener";
import { BackendService } from "../../providers/backend.service";
import { LoadingController } from "ionic-angular";

import { Platform } from "ionic-angular";
import { AppModule } from "../../app/app.module";

import * as moment from "moment";
import { Credentials } from "../../providers/credentials.holder";
import { AndroidPermissions } from "@ionic-native/android-permissions";

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
    public toastCtrl: ToastController
  ) {
    this.post_id = navParams.get("post_id");
    this.judul = navParams.get("judul");
    this.type = navParams.get("type");
  }

  @ViewChild(Content) content: Content;

  ngAfterViewInit() {
    this.getCurrentPostDetails();
    this.reqNewestPosts();
    this.reqNewestProgress();
  }

  role;

  getUserData() {
    this.userName = this.creds.data["name"];
    this.role = this.creds.data["role"];
  }

  backToPostPage() {
    this.navCtrl.pop();
    console.log(this.post_id);
  }

  toggleView() {
    this.view = this.view == "post" ? "comment" : "post";

    // resize the view
    this.content.resize();
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
          console.log(response);

          // append the new posts to current array
          let newMsg = {
            no_post: this.sendParams.no_post,
            posted_by: this.sendParams.posted_by,
            posted_name: this.sendParams.posted_name,
            message: this.sendParams.message,
            date_created: this.sendParams.date_created
          };

          this.items1.push(newMsg);

          console.log(this.items1.length);

          // populate the list
          // this.populateList(this.items);

          // resize the view
          this.content.resize();
        }
      },
      error => {
        if (error != null) {
          console.log("failed to send message!");
        }
      }
    );
  };

  reqNewestPosts = () => {
    console.log(this.post_id);

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
          console.log(response);

          let newItems: any;
          newItems = response;

          newItems.forEach(newItem => {
            // append the new posts to current array
            this.items1.reverse();
            this.items1.push(newItem);
            this.items1.reverse();
          });

          console.log(this.items1.length);

          // populate the list
          // this.populateList(this.items);
        }
      });
  };

  doInfinite(infiniteScroll) {
    console.log("Begin async operation");
    console.log(this.postQuery);

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
            console.log(response);

            let newItems: any;
            newItems = response;

            newItems.forEach(newItem => {
              // append the new posts to current array
              this.items1.reverse();
              this.items1.push(newItem);
              this.items1.reverse();
            });

            console.log(this.items1.length);

            // populate the list
            // this.populateList(this.items);

            // end operation
            console.log("Async operation has ended");
            infiniteScroll.complete();
          }
        });
    }, this.timeOut);
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
          console.log(response);

          // append the new posts to current array
          let newMsg = {
            no_post: this.sendProgressParams.no_post,
            message: this.sendProgressParams.message,
            date_created: this.sendProgressParams.date_created
          };

          this.items2.push(newMsg);

          console.log(this.items2.length);

          // populate the list
          // this.populateList(this.items);

          // resize the view
          this.content.resize();
        }
      },
      error => {
        if (error != null) {
          console.log("failed to send message!");
          console.log(error);
        }
      }
    );
  };

  reqNewestProgress = () => {
    console.log(this.post_id);

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
          console.log(response);

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
    console.log("Begin async operation");
    console.log(this.postQuery);

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
            console.log(response);

            let newItems: any;
            newItems = response;

            newItems.forEach(newItem => {
              // append the new posts to current array
              this.items2.reverse();
              this.items2.push(newItem);
              this.items2.reverse();
            });

            console.log(this.items2.length);

            // populate the list
            // this.populateList(this.items);

            // end operation
            console.log("Async operation has ended");
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
    console.log(this.service.baseurl);

    this.timeOut = 0;

    // set the query for current post
    let postQueryCur = {
      "filter[where][no_post]": this.post_id,
      "filter[where][type]": this.type
    };

    this.service.getReqNew("postheaders", postQueryCur).subscribe(response => {
      if (response != null) {
        console.log(response);

        this.posted_by = response[0]["posted_by"];
        this.posted_name = response[0]["posted_by"];
        this.waktu = response[0]["tanggal_kejadian"];
        this.propinsi = response[0]["province"];
        this.penggugat = response[0]["nama_korban"];
        this.tergugat = response[0]["nama_pelaku"];
        this.kronologi = response[0]["kronologi"];
        this.pembelajaran = response[0]["pembelajaran"];

        // populate the list
        // this.populateList(this.items);
      }
    });
  };

  object;
  usia;
  kelamin;

  getCurrentPostDetails() {
    this.posted_by = this.navParams.get("posted_by");
    this.posted_name = this.navParams.get("posted_name");
    this.waktu = this.navParams.get("tanggal");
    this.propinsi = this.navParams.get("province");
    this.penggugat = this.navParams.get("nama_korban");
    this.tergugat = this.navParams.get("nama_pelaku");
    this.kronologi = this.navParams.get("kronologi");
    this.pembelajaran = this.navParams.get("pembelajaran");
    this.object = this.navParams.get("object");
    this.usia = this.navParams.get("usia");
    this.kelamin = this.navParams.get("kelamin");

    // append the file links
    this.getFileAttachments();
  }

  getFileAttachments() {
    this.service
      .postreq("findupload", { where: { no_post: this.post_id } })
      .subscribe(response => {
        if (response != null) {
          console.log(response);

          let newItems: any;
          newItems = response;

          newItems.forEach(newItem => {
            // append the new posts to current array
            this.images.push(newItem);
          });

          console.log(this.items1.length);

          // populate the list
          // this.populateList(this.items);

          // end operation
          console.log("Async operation has ended");
        }
      });
  }

  result: any;
  downloadAndOpenPdf(file, name) {
    this.androidPermissions
      .hasPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
      .then(status => {
        if (status.hasPermission) {
          console.log(this.service.baseurl + "download?filename=" + file);
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
                //   .then(() => console.log("success"));
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
                console.log(this.service.baseurl + "download?filename=" + file);
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
                      //   .then(() => console.log("success"));
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
      console.log("Dismissed toast");
    });

    toast.present();
  }

  purgeList(refresh) {
    this.items1 = [];
    this.doInfinite(refresh);
  }

  tempPembelajaran;

  askClosePost() {
    let alert = this.alert.create({
      title: 'Apakah anda ingin tutup kasus ini?',
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
            console.log("Cancel close");
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
    this.object.pembelajaran = this.tempPembelajaran;

    console.log("object: " + this.object);

    this.service
      .patchreq("postheaders/" + this.post_id, this.object)
      .subscribe(response => {
        if (response != null) {
          this.pembelajaran = this.tempPembelajaran;
          this.changeView(1);
        }
      });
  }

  viewComment() { }
}
