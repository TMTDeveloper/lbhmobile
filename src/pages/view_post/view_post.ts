import { Component, ViewChild } from "@angular/core";
import { NavController, NavParams, Content } from "ionic-angular";
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

  images = [{}];

  type;

  constructor(
    private document: DocumentViewer,
    private file: File,
    private transfer: FileTransfer,
    public navCtrl: NavController,
    private opener: FileOpener,
    private service: BackendService,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public creds:Credentials
  ) {
    this.post_id = navParams.get("post_id");
    this.judul = navParams.get("judul");
    this.type = navParams.get("type");
  }

  @ViewChild(Content) content: Content;

  ngAfterViewInit() {
    this.getCurrentPostDetails();
    this.reqNewestPosts();
  }

  role;

  getUserData()
  {
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

  users = [];
  userName = "Nurul";

  postLimit = 5;
  items1 = [];

  postQuery = {
    "filter[where][no_post]": this.post_id,
    "filter[limit]": this.postLimit,
    "filter[skip]": 0,
    "filter[order]": ["date_created DESC"]
  };

  message = "";

  sendParams = {
    no_post: this.post_id,
    posted_by: this.creds.data.email,
    posted_name: this.creds.data.name,
    message: this.message,
    date_created: moment().format()
  };

  timeOut = 0;

  dateToTime(time) {
    return moment(time).format("DD/MM/YY hh:mm");
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

  type: number = 1;

  posted_by;
  daerah;
  propinsi;
  penggugat;
  tergugat;
  kronologi;

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
        this.propinsi = response[0]["province"];
        this.penggugat = response[0]["nama_korban"];
        this.tergugat = response[0]["nama_pelaku"];
        this.kronologi = response[0]["kronologi"];

        // populate the list
        // this.populateList(this.items);
      }
    });
  };

  getCurrentPostDetails() {
    this.posted_by = this.navParams.get("posted_by");
    this.propinsi = this.navParams.get("province");
    this.penggugat = this.navParams.get("nama_korban");
    this.tergugat = this.navParams.get("nama_pelaku");
    this.kronologi = this.navParams.get("kronologi");
  }

  purgeList(refresh) {
    this.items1 = [];
    this.doInfinite(refresh);
  }

  viewComment() {}
}
