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

@Component({
  selector: "page-post",
  templateUrl: "post.html"
})
export class PostPage implements AfterViewInit {
  documents = [];
  jenis = "kasus";
  items = [];

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

    // return the tab to null
    //this.jenis = jenis;

    if (this.items.length > 0) return;

    this.service
      .getReqNew("postheaders", this.postQuery)
      .subscribe(response => {
        if (response != null) {
          console.log(response);

          let newItems: any;
          newItems = response;

          newItems.forEach(newItem => {
            // append the new posts to current array
            this.items.push(newItem);
          });

          console.log(this.items.length);

          // populate the list
          // this.populateList(this.items);

          // add the offset
          this.postQuery["filter[skip]"] += this.postLimit;
        }
      });
  };

  doInfinite(infiniteScroll) {
    console.log("Begin async operation");

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
              this.items.push(newItem);
            });

            console.log(this.items.length);

            // populate the list
            // this.populateList(this.items);

            // add the offset
            this.postQuery["filter[skip]"] += this.postLimit;

            // end operation
            console.log("Async operation has ended");
            infiniteScroll.complete();
          }
        });
    }, 500);
  }

  viewPost(no_post:string)
  {
    
  }

  populateList(any) {}
}
