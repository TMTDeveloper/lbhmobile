import { Component, AfterViewInit, OnChanges, ViewChild } from "@angular/core";
import {
  NavController,
  Item,
  Content,
  Refresher,
  NavParams,
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

import { ViewPostPage } from "../view_post/view_post";
import { AppModule } from "../../app/app.module";
import { NewPostPage } from "./new_post/new_post";
import { LoginPage } from "../login/login";
import { TabsPage } from "../tabs/tabs";
import { Observable } from "rxjs/Rx";
import { Credentials } from "../../providers/credentials.holder";
import * as moment from "moment";

@Component({
  selector: "page-post",
  templateUrl: "post.html"
})
export class PostPage implements AfterViewInit {
  documents = [];
  jenis = "kasus";
  view = "me";
  items0 = [];
  items1 = [];
  items2 = [];
  items3 = [];

  userName;
  role;
  organisasi;

  visibleName;

  constructor(
    private document: DocumentViewer,
    private file: File,
    private transfer: FileTransfer,
    public navCtrl: NavController,
    private opener: FileOpener,
    public service: BackendService,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public alert: AlertController,
    public events: Events,
    public creds: Credentials
  ) {
    console.log(this.service.baseurl);
  }

  @ViewChild(Content) content: Content;

  ngAfterViewInit() {
    this.getUserData();

    this.reqMyPosts();
    this.reqNewestPosts();
    this.populateItems2();
  }

  getUserData() {
    this.userName = this.creds.data.email;
    this.role = this.creds.data.role;
    this.organisasi = this.creds.data.organisasi;

    this.visibleName = this.creds.data.name;
  }

  ionViewDidEnter() {
    console.log(this.jenis);
  }

  postLimit = 10;

  postQuery = {
    "filter[where][and][0][type]": 1,
    "filter[limit]": this.postLimit,
    "filter[skip]": 0,
    "filter[order]": ["date_modified DESC"],
    "filter[where][and][1][organisasi]": this.creds.data.organisasi
  };

  postQueryByName = {
    "filter[where][and][0][type]": 1,
    "filter[where][posted_by]": "",
    "filter[limit]": this.postLimit,
    "filter[skip]": 0,
    "filter[order]": ["date_modified DESC"],
    "filter[where][and][1][organisasi]": this.creds.data.organisasi
  };

  postQueryByPostIds = {
    "filter[where][and][0][type]": 1,
    "filter[where][posted_name]": "",
    "filter[limit]": this.postLimit,
    "filter[skip]": 0,
    "filter[order]": ["date_modified DESC"],
    "filter[where][and][1][organisasi]": this.creds.data.organisasi
  };

  postQuery2 = {
    "filter[where][and][0][type]": 2,
    "filter[limit]": this.postLimit,
    "filter[skip]": 0,
    "filter[order]": ["date_modified DESC"],
    "filter[where][and][1][organisasi]": this.creds.data.organisasi
  };

  postQueryAll = {
    "filter[where][and][0][type]": 2,
    "filter[limit]": this.postLimit,
    "filter[skip]": 0,
    "filter[order]": ["date_modified DESC"]
  };

  postQueryClosed = {
    "filter[where][and][0][status]": 2,
    "filter[where][posted_by]": this.creds.data.email,
    "filter[limit]": this.postLimit,
    "filter[skip]": 0,
    "filter[order]": ["date_modified DESC"]
  };

  postQueryClosedAll = {
    "filter[where][and][0][status]": 2,
    "filter[limit]": this.postLimit,
    "filter[skip]": 0,
    "filter[order]": ["date_modified DESC"]
  };

  resetPostOffset() {
    this.postQuery["filter[offset]"] = 0;
  }

  setOrderRule(rules: any[]) {
    this.postQuery["filter[order]"] = rules;
  }

  dateToDate(time) {
    return moment(time).format("DD/MM/YY");
  }

  currentPostOffset = 0;
  myPost: any;
  reqMyPosts = async () => {
    console.log(this.service.baseurl);

    this.timeOut = 0;

    // resize the view
    this.content.resize();

    // first we get the post details
    await this.service
      .getReqNew("postdetails/postedby", { email: this.creds.data.email })
      .subscribe(response => {
        console.log(response);
        this.myPost = response;
        this.myPost = this.myPost.reverse();

        let arr = this.myPost.slice(0, 10);
        console.log(arr);
        arr.forEach(async element => {
          console.log(element);
          let postQueryByName = [];
          postQueryByName["filter[where][no_post]"] = element;

          // resize the view
          this.content.resize();

          if (this.items0.length > 0) return;

          // finally get all the post headers here
          await this.service
            .getReqNew("postheaders", postQueryByName)
            .subscribe(response => {
              if (response != null) {
                console.log(response);

                let newItems: any;
                newItems = response;

                newItems.forEach(newItem => {
                  // append the new posts to current array
                  this.items0.push(newItem);
                });

                console.log(this.items0.length);

                // populate the list
                // this.populateList(this.items);
              }
            });
        });
      });

    // return the tab to null
    //this.jenis = jenis;

    // set the query
  };

  reqNewestPosts = () => {
    console.log(this.service.baseurl);

    this.timeOut = 0;

    // return the tab to null
    //this.jenis = jenis;

    // set the query
    this.postQuery["filter[where][type]"] = 1;

    // add the offset
    this.postQuery["filter[skip]"] = this.items1.length;

    // resize the view
    this.content.resize();

    if (this.items1.length > 0) return;

    this.service
      .getReqNew("postheaders", this.postQuery)
      .subscribe(response => {
        if (response != null) {
          console.log(response);

          let newItems: any;
          newItems = response;

          newItems.forEach(newItem => {
            // append the new posts to current array
            this.items1.push(newItem);
          });

          console.log(this.items1.length);
          console.log(this.items2.length);

          // populate the list
          // this.populateList(this.items);
        }
      });
  };

  timeOut = 500;

  populateItems2 = () => {
    console.log(this.service.baseurl);

    this.timeOut = 0;

    // return the tab to null
    //this.jenis = jenis;

    // set the query
    this.postQuery2["filter[where][type]"] = 2;

    // add the offset
    this.postQuery2["filter[skip]"] = this.items2.length;

    // order by latest
    this.postQuery2["filter[order]"] = ["no_post DESC"];

    // resize the view
    this.content.resize();

    console.log(this.organisasi);
    console.log();

    if (this.items2.length > 0) return;

    this.service
      .getReqNew("postheaders", this.postQuery2)
      .subscribe(response => {
        if (response != null) {
          console.log(response);

          let newItems: any;
          newItems = response;

          newItems.forEach(newItem => {
            // append the new posts to current array
            this.items2.push(newItem);
          });

          console.log(this.items1.length);
          console.log(this.items2.length);

          // populate the list
          // this.populateList(this.items);
        }
      });
  };

  reqClosedPosts = () => {
    console.log(this.service.baseurl);

    this.timeOut = 0;

    // return the tab to null
    //this.jenis = jenis;

    // set the query
    this.postQueryClosed["filter[where][type]"] = 1;

    // add the offset
    this.postQueryClosed["filter[skip]"] = this.items3.length;

    // order by latest
    this.postQueryClosed["filter[order]"] = ["no_post DESC"];

    // resize the view
    this.content.resize();

    if (this.items3.length > 0) return;

    this.service
      .getReqNew("postheaders", this.postQueryClosed)
      .subscribe(response => {
        if (response != null) {
          console.log(response);

          let newItems: any;
          newItems = response;

          newItems.forEach(newItem => {
            // append the new posts to current array
            this.items3.push(newItem);
          });

          // populate the list
          // this.populateList(this.items);
        }
      });
  };

  reqAllClosedPosts = () => {
    console.log(this.service.baseurl);

    this.timeOut = 0;

    // return the tab to null
    //this.jenis = jenis;

    // set the query
    this.postQueryClosedAll["filter[where][type]"] = 1;

    // add the offset
    this.postQueryClosedAll["filter[skip]"] = this.items3.length;

    // order by latest
    this.postQueryClosedAll["filter[order]"] = ["no_post DESC"];

    // resize the view
    this.content.resize();

    if (this.items3.length > 0) return;

    this.service
      .getReqNew("postheaders", this.postQueryClosedAll)
      .subscribe(response => {
        if (response != null) {
          console.log(response);

          let newItems: any;
          newItems = response;

          newItems.forEach(newItem => {
            // append the new posts to current array
            this.items3.push(newItem);
          });

          // populate the list
          // this.populateList(this.items);
        }
      });
  };

  purgeList(refresh) {
    if (this.jenis === "kasus" && this.view === "me") {
      this.items0 = [];
      this.doInfiniteMe(refresh);
    }

    if (this.jenis === "kasus" && this.view === "all") {
      this.items1 = [];
      this.doInfinite(refresh);
    }

    if (this.jenis === "kegiatan") {
      this.items2 = [];
      this.doInfinite2(refresh);
    }
  }

  doInfiniteMe(infiniteScroll) {
    this.infiniteMeObs().subscribe(
      response => {
        if (response == true) {
          infiniteScroll.complete();
        }
      },
      error => {
        infiniteScroll.complete();
        this.purgeList(infiniteScroll);
      }
    );
    // console.log("Begin async operation");
    // console.log(this.postQuery);

    // let arr = this.myPost.slice(this.items0.length, this.items0.length + 9);

    // arr.forEach((element, ind) => {
    //   console.log(element);
    //   let postQueryByName = [];
    //   postQueryByName["filter[where][no_post]"] = element;

    //   // resize the view
    //   this.content.resize();

    //   // if (this.items0.length > 0) return;

    //   this.service
    //     .getReqNew("postheaders", postQueryByName)
    //     .subscribe(response => {
    //       if (response != null) {
    //         console.log(response);

    //         let newItems: any;
    //         newItems = response;

    //         newItems.forEach(newItem => {
    //           // append the new posts to current array
    //           this.items0.push(newItem);
    //         });
    //         console.log(arr.length.toString() + " " + ind.toString());
    //         if (ind == 0) {
    //           infiniteScroll.complete();
    //         }
    //         console.log(this.items0.length);

    //         // populate the list
    //         // this.populateList(this.items);
    //       }
    //     });
    // });

    // set the query
    // this.postQueryByName["filter[where][type]"] = 1;

    // // add the offset
    // this.postQueryByName["filter[skip]"] = this.items0.length;

    // // filter by user's posts
    // this.postQueryByName["filter[where][posted_by]"] = this.userName;

    // this.timeOut = 500;

    // setTimeout(() => {
    //   this.service
    //     .getReqNew("postheaders", this.postQueryByName)
    //     .subscribe(response => {
    //       if (response != null) {
    //         console.log(response);

    //         let newItems: any;
    //         newItems = response;

    //         newItems.forEach(newItem => {
    //           // append the new posts to current array
    //           this.items0.push(newItem);
    //         });

    //         console.log(this.items0.length);

    //         // populate the list
    //         // this.populateList(this.items);

    //         // end operation
    //         console.log("Async operation has ended");
    //         infiniteScroll.complete();
    //       }
    //     });
    // }, this.timeOut);
  }

  infiniteMeObs() {
    return Observable.create(observer => {
      if (this.items0.length == this.myPost.length) {
        observer.next(true);
        observer.complete();
      }

      let arr = this.myPost.slice(this.items0.length, this.items0.length + 9);

      arr.forEach((element, ind) => {
        console.log(element);
        let postQueryByName = [];
        postQueryByName["filter[where][no_post]"] = element;

        // resize the view
        this.content.resize();

        // if (this.items0.length > 0) return;

        this.service.getReqNew("postheaders", postQueryByName).subscribe(
          response => {
            if (response != null) {
              console.log(response);

              let newItems: any;
              newItems = response;

              newItems.forEach(newItem => {
                // append the new posts to current array
                this.items0.push(newItem);
              });
              console.log(arr.length.toString() + " " + ind.toString());
              if (ind == 0) {
                observer.next(true);
                observer.complete();
              }
              console.log(this.items0.length);

              // populate the list
              // this.populateList(this.items);
            }
          },
          error => {
            observer.next();
            observer.error(error);
          }
        );
      });
    });
  }

  doInfinite(infiniteScroll) {
    console.log("Begin async operation");
    console.log(this.postQuery);

    // set the query
    this.postQuery["filter[where][type]"] = 1;

    // add the offset
    this.postQuery["filter[skip]"] = this.items1.length;

    this.timeOut = 500;

    setTimeout(() => {
      this.service
        .getReqNew("postheaders", this.postQuery)
        .subscribe(response => {
          if (response != null) {
            console.log(response);

            let newItems: any;
            newItems = response;

            newItems.forEach(newItem => {
              // append the new posts to current array
              this.items1.push(newItem);
            });

            console.log(this.items1.length);
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

  doInfinite2(infiniteScroll) {
    console.log("Begin async operation");
    console.log(this.postQuery2);

    // set the query
    this.postQuery2["filter[where][type]"] = 2;

    // add the offset
    this.postQuery2["filter[skip]"] = this.items2.length;

    // order by latest
    this.postQuery2["filter[order]"] = ["no_post DESC"];

    this.timeOut = 500;

    setTimeout(() => {
      this.service
        .getReqNew("postheaders", this.postQuery2)
        .subscribe(response => {
          if (response != null) {
            console.log(response);

            let newItems: any;
            newItems = response;

            newItems.forEach(newItem => {
              // append the new posts to current array
              this.items2.push(newItem);
            });

            console.log(this.items1.length);
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

  shortenDescription(description: string) {
    if (description == null) {
      return "";
    }
    if (description == "") {
      return "";
    }
    if (description.length < 40) {
      return description;
    }

    return description.slice(0, 40) + "...";
  }

  jenisKejadian(jenis) {
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

  namaOrganisasi(organisasi) {
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

  getRole(role) {
    if (role == 1) {
      return "Aplikasi Pendukung untuk Paralegal";
    }
    if (role == 2) {
      return "Aplikasi Pendukung untuk Bantuan Hukum";
    }
  }

  viewPost(
    type,
    no_post,
    posted_by,
    posted_name,
    tanggal,
    title,
    province,
    nama_korban,
    nama_pelaku,
    kronologi,
    pembelajaran,
    object
  ) {
    this.navCtrl.push(ViewPostPage, {
      type: type,
      post_id: no_post,
      posted_name: posted_name,
      posted_by: posted_by,
      tanggal: tanggal,
      judul: title,
      province: province,
      nama_korban: nama_korban,
      nama_pelaku: nama_pelaku,
      kronologi: kronologi,
      pembelajaran: pembelajaran,
      object: object
    });
  }

  newKasus() {
    this.navCtrl.push(NewPostPage, { type: 1, userName: this.userName });
    this.waitingNewPost = true;
  }

  newKegiatan() {
    this.navCtrl.push(NewPostPage, {
      type: 2,
      userName: this.userName
    });
    this.waitingNewPost = true;
  }

  waitingNewPost = false;

  ionViewWillEnter() {
    this.waitingNewPost = this.navParams.get("waitingNewPost");

    if (this.waitingNewPost) {
      this.waitingNewPost = false;
      this.navParams.data.waitingNewPost = false;
      this.jenis = "kasus";
      this.view = "me";

      this.items0 = [];
      this.reqMyPosts();
    }
  }

  populateList(any) { }

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
            console.log("Cancel logout");
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
