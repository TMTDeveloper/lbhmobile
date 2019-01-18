import { Component, AfterViewInit, OnChanges } from "@angular/core";
import { NavController, Item } from "ionic-angular";
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

@Component({
  selector: "page-post",
  templateUrl: "post.html"
})
export class PostPage implements AfterViewInit {
  documents = [];
  jenis = "kasus";
  items1 = [];
  items2 = [];

  constructor(
    private document: DocumentViewer,
    private file: File,
    private transfer: FileTransfer,
    public navCtrl: NavController,
    private opener: FileOpener,
    public service: BackendService,
    public loadingCtrl: LoadingController
  ) {
    console.log(this.service.baseurl);
  }

  ngAfterViewInit() {
    this.reqNewestPosts();
  }

  ionViewDidEnter() {
    console.log(this.jenis);
  }

  postLimit = 10;

  postQuery = {
    "filter[where][type]": 1,
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

  currentPostOffset = 0;

  reqNewestPostsFake() {}

  reqNewestPosts = () => {
    console.log(this.service.baseurl);

    this.timeOut = 0;

    // return the tab to null
    //this.jenis = jenis;

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

          // add the offset
          this.postQuery["filter[skip]"] = this.items1.length + this.postLimit;
        }
      });
  };

  timeOut = 500;

  populateItems2 = () => {
    console.log(this.service.baseurl);

    this.timeOut = 0;

    // return the tab to null
    //this.jenis = jenis;

    if (this.items2.length > 0) return;

    this.service
      .getReqNew("postheaders", this.postQuery)
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

          // add the offset
          this.postQuery["filter[skip]"] = this.items2.length + this.postLimit;
        }
      });
  };

  purgeList()
  {
    if (this.jenis === "kasus")
    {
      this.items1 = [];
      this.reqNewestPosts();
    }

    if (this.jenis === "kegiatan")
    {
      this.items2 = [];
      this.populateItems2();
    }
  }

  doInfinite(infiniteScroll) {
    console.log("Begin async operation");
    console.log(this.postQuery);

    // check the current active tab
    if (this.jenis === "kasus") this.postQuery["filter[where][type]"] = 1;
    if (this.jenis === "kegiatan") this.postQuery["filter[where][type]"] = 2;
    
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
              if (this.jenis === "kasus") this.items1.push(newItem);
              if (this.jenis === "kegiatan") this.items2.push(newItem);
            });

            console.log(this.items1.length);
            console.log(this.items2.length);

            // populate the list
            // this.populateList(this.items);

            // add the offset
            let curLen
            if (this.jenis === "kasus") curLen = this.items1.length;
            if (this.jenis === "kegiatan") curLen = this.items2.length;
            this.postQuery["filter[skip]"] = curLen + this.postLimit;

            // end operation
            console.log("Async operation has ended");
            infiniteScroll.complete();
          }
        });
    }, this.timeOut);
  }

  viewPost(no_post:string)
  {
    this.navCtrl.push(ViewPostPage,{post_id:no_post});
  }

  populateList(any) {}
}
