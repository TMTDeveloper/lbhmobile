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
import sort from "fast-sort";

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
    public platform: Platform,
    public creds: Credentials
  ) {
    console.log(this.service.baseurl);
  }

  @ViewChild(Content) content: Content;

  ngAfterViewInit() {
    this.getUserData();
    console.log(this.creds.data.email);
    // this.reqAllPosts();

    this.platform.registerBackButtonAction(() => {
      this.askLogout();
    });
  }

  ionViewWillEnter() {
    console.log("woi");

    this.jenis = "kasus";
    this.view = "me";

    this.reqAllPosts();
  }

  reqAllPosts() {
    this.items0 = [];
    this.items1 = [];
    this.items2 = [];
    this.items3 = [];
    this.reqMyPosts();
    this.reqNewestPosts();
    this.reqKegiatan();
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
    "filter[where][and][1][organisasi]": this.creds.data.organisasi,
    "filter[reqby]": this.creds.data.email
  };

  postQueryByName = {
    "filter[where][and][0][type]": 1,
    "filter[where][posted_by]": "",
    "filter[limit]": this.postLimit,
    "filter[skip]": 0,
    "filter[order]": ["date_modified DESC"],
    "filter[where][and][1][organisasi]": this.creds.data.organisasi,
    "filter[reqby]": this.creds.data.email
  };

  postQueryByPostIds = {
    "filter[where][and][0][type]": 1,
    "filter[where][posted_name]": "",
    "filter[limit]": this.postLimit,
    "filter[skip]": 0,
    "filter[order]": ["date_modified DESC"],
    "filter[where][and][1][organisasi]": this.creds.data.organisasi,
    "filter[reqby]": this.creds.data.email
  };

  postQuery2 = {
    "filter[where][and][0][type]": 2,
    "filter[limit]": this.postLimit,
    "filter[skip]": 0,
    "filter[order]": ["date_modified DESC"],
    "filter[where][and][1][organisasi]": this.creds.data.organisasi,
    "filter[reqby]": this.creds.data.email
  };

  postQueryAll = {
    "filter[where][and][0][type]": 2,
    "filter[limit]": this.postLimit,
    "filter[skip]": 0,
    "filter[order]": ["date_modified DESC"],
    "filter[reqby]": this.creds.data.email
  };

  postQueryClosed = {
    "filter[where][and][0][status]": 2,
    "filter[where][posted_by]": this.creds.data.email,
    "filter[limit]": this.postLimit,
    "filter[skip]": 0,
    "filter[order]": ["date_modified DESC"],
    "filter[reqby]": this.creds.data.email
  };

  postQueryClosedAll = {
    "filter[where][and][0][status]": 2,
    "filter[limit]": this.postLimit,
    "filter[skip]": 0,
    "filter[order]": ["date_modified DESC"],
    "filter[reqby]": this.creds.data.email
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
  async reqMyPosts() {
    if (this.items0.length > 0) return;
    console.log(this.service.baseurl);

    // this.timeOut = 0;

    // resize the view
    this.content.resize();

    // first we get the post details
    let arr = [];
    await this.service
      .getReqNew("postdetails/postedby", { email: this.creds.data.email })
      .toPromise()
      .then(response => {
        console.log(response);
        this.myPost = response;
        this.myPost = this.myPost.reverse();

        arr = this.myPost.slice(0, 10);
        console.log(arr);
      });
    for (let element of arr) {
      console.log(element);
      let postQueryByName = [];
      postQueryByName["filter[where][no_post]"] = element;
      postQueryByName["filter[reqby]"] = this.creds.data.email;

      // resize the view
      this.content.resize();

      // finally get all the post headers here
      await this.service
        .getReqNew("postheaders", postQueryByName)
        .toPromise()
        .then(response => {
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
    }

    // return the tab to null
    //this.jenis = jenis;

    // set the query
  }

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

  reqKegiatan = () => {
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
    if (this.jenis == "kasus" && this.view == "closed") {
      this.items3 = [];
      this.doInfiniteClosed(refresh);
    }
    if (this.jenis === "kegiatan") {
      this.items2 = [];
      this.doInfinite2(refresh);
    }
  }

  doInfiniteMe(infiniteScroll) {
    let promiseTimeout = new Promise((resolve, reject) => {
      setTimeout(resolve, 5000, null);
    });

    let promiseRequest = this.infiniteMeObs();

    let race = Promise.race([promiseTimeout, promiseRequest]);

    race.then(
      response => {
        infiniteScroll.complete();
      },
      error => {
        infiniteScroll.complete();
      }
    );
  }

  async infiniteMeObs() {
    console.log(this.items0.length);
    console.log(this.myPost.length);
    if (this.items0.length == this.myPost.length) {
      return;
    }

    let arr = this.myPost.slice(this.items0.length, this.items0.length + 9);
    console.log(arr);
    for (let element of arr) {
      console.log(element);
      let postQueryByName = [];
      postQueryByName["filter[where][no_post]"] = element;
      postQueryByName["filter[reqby]"] = this.creds.data.email;
      // resize the view
      this.content.resize();

      // if (this.items0.length > 0) return;

      await this.service
        .getReqNew("postheaders", postQueryByName)
        .toPromise()
        .then(
          response => {
            if (response != null) {
              console.log(response);

              let newItems: any;
              newItems = response;

              newItems.forEach(newItem => {
                // append the new posts to current array
                this.items0.push(newItem);
              });
              // console.log(arr.length.toString() + " " + ind.toString());
              // if (ind == 0) {
              // }
              console.log(this.items0.length);

              // populate the list
              // this.populateList(this.items);
            }
          },
          error => {
            return;
          }
        );
    }
  }

  doInfinite(infiniteScroll) {
    console.log("Begin async operation");
    console.log(this.postQuery);

    // set the query
    // this.postQuery["filter[where][type]"] = 1;

    // add the offset
    this.postQuery["filter[skip]"] = this.items1.length;

    this.timeOut = 5000;

    let promiseTimeout = new Promise((resolve, reject) => {
      setTimeout(resolve, this.timeOut, null);
    });

    let promiseRequest = this.service
      .getReqNew("postheaders", this.postQuery)
      .toPromise();

    let race = Promise.race([promiseTimeout, promiseRequest]);

    race.then(
      response => {
        if (response !== null) {
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
        } else {
          console.log("disini");
          typeof infiniteScroll["enable"] === "function"
            ? infiniteScroll.enable(false)
            : null;
          infiniteScroll.complete();
        }
      },
      error => {
        console.log("disini");
        typeof infiniteScroll["enable"] === "function"
          ? infiniteScroll.enable(false)
          : null;
        infiniteScroll.complete();
      }
    );
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

    this.timeOut = 5000;

    let promiseTimeout = new Promise((resolve, reject) => {
      setTimeout(resolve, this.timeOut, null);
    });

    let promiseRequest = this.service
      .getReqNew("postheaders", this.postQuery2)
      .toPromise();

    let race = Promise.race([promiseTimeout, promiseRequest]);

    race.then(
      response => {
        if (response !== null) {
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
        } else {
          console.log("disini");
          typeof infiniteScroll["enable"] === "function"
            ? infiniteScroll.enable(false)
            : null;
          infiniteScroll.complete();
        }
      },
      error => {
        console.log("disini");
        typeof infiniteScroll["enable"] === "function"
          ? infiniteScroll.enable(false)
          : null;
        infiniteScroll.complete();
      }
    );
  }

  doInfiniteClosed(infiniteScroll) {
    console.log("Begin async operation");
    console.log(this.postQueryClosed);

    // set the query
    this.postQueryClosed["filter[where][type]"] = 1;
    delete this.postQueryClosed["filter[where][posted_by]"];
    // add the offset
    this.postQueryClosed["filter[skip]"] = this.items3.length;

    // order by latest
    this.postQueryClosed["filter[order]"] = ["no_post DESC"];

    this.timeOut = 5000;

    let promiseTimeout = new Promise((resolve, reject) => {
      setTimeout(resolve, this.timeOut, null);
    });

    let promiseRequest = this.service
      .getReqNew("postheaders", this.postQueryClosed)
      .toPromise();

    let race = Promise.race([promiseTimeout, promiseRequest]);

    race.then(
      response => {
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

          // end operation
          console.log("Async operation has ended");
          infiniteScroll.complete();
        } else {
          console.log("disini");
          console.log(typeof infiniteScroll["enable"] === "function");
          typeof infiniteScroll["enable"] === "function"
            ? infiniteScroll.enable(false)
            : null;
          infiniteScroll.complete();
        }
      },
      error => {
        console.log("disini");
        console.log(typeof infiniteScroll["enable"] === "function");
        typeof infiniteScroll["enable"] === "function"
          ? infiniteScroll.enable(false)
          : null;
        infiniteScroll.complete();
      }
    );
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

  hasNewPost(item) {
    var hasNew = moment(item.last_post).isAfter(item.date_access);
    // if (item.date_access == null) hasNew = true;
    // console.log(hasNew);
    // item.hasNewPost = hasNew;
    return hasNew;
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
    var updateParams = {
      id_user: this.creds.data.email,
      no_post: no_post,
      last_access: moment().format()
    };

    // post update to server. upon success, add to list
    this.service.postreq("post-logs", updateParams).subscribe(
      response => {
        if (response != null) {
          console.log(response);
        }
      },
      error => {
        if (error != null) {
          console.log(error);
        }
      }
    );
    object.date_access = moment().format();
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



  populateList(any) {}

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

  sortMethod(arr) {
    return sort(arr).by([
      { desc: u => moment(u.last_post).isAfter(u.date_access) },
      { desc: u => (u.last_post == null ? u.date_modified : u.last_post) }
    ]);
  }

  sortMethodKegiatan(arr) {
    return sort(arr).by([{ desc: u => u.date_modified }]);
  }
}
