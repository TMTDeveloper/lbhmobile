import { Component, AfterViewInit, OnChanges, ViewChild } from "@angular/core";
import { NavController, Item, Content } from "ionic-angular";
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

  userName = "Nurul";

  constructor(
    private document: DocumentViewer,
    private file: File,
    private transfer: FileTransfer,
    public navCtrl: NavController,
    private opener: FileOpener,
    public service: BackendService,
    public loadingCtrl: LoadingController,
  ) {
    console.log(this.service.baseurl);
  }
  
  @ViewChild(Content) content: Content

  ngAfterViewInit() {
    this.reqMyPosts();
    this.reqNewestPosts();
    this.populateItems2();
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

  postQueryByName = {
    "filter[where][type]": 1,
    "filter[where][nama_korban]": "",
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

  reqMyPosts = () => {
    console.log(this.service.baseurl);

    this.timeOut = 0;

    // return the tab to null
    //this.jenis = jenis;

    // set the query
    this.postQueryByName["filter[where][type]"] = 1;

    // filter by user's posts
    this.postQueryByName["filter[where][nama_korban]"] = this.userName;

    // add the offset
    this.postQueryByName["filter[skip]"] = this.items0.length;

    // resize the view
    this.content.resize();

    if (this.items0.length > 0) return;

    this.service
      .getReqNew("postheaders", this.postQueryByName)
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
    this.postQuery["filter[where][type]"] = 2;

    // add the offset
    this.postQuery["filter[skip]"] = this.items2.length;

    // resize the view
    this.content.resize();

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
        }
      });
  };

  purgeList(refresh)
  {
    if (this.jenis === "kasus")
    {
      this.items1 = [];
      this.doInfinite(refresh);
    }

    if (this.jenis === "kegiatan")
    {
      this.items2 = [];
      this.doInfinite2(refresh);
    }
  }

  doInfiniteMe(infiniteScroll) {
    console.log("Begin async operation");
    console.log(this.postQuery);

    // set the query
    this.postQueryByName["filter[where][type]"] = 1;

    // add the offset
    this.postQueryByName["filter[skip]"] = this.items0.length;

    // filter by user's posts
    this.postQueryByName["filter[where][nama_korban]"] = this.userName;
    
    this.timeOut = 500;

    setTimeout(() => {
      this.service
        .getReqNew("postheaders", this.postQueryByName)
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

            // end operation
            console.log("Async operation has ended");
            infiniteScroll.complete();
          }
        });
    }, this.timeOut);
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
    console.log(this.postQuery);

    // set the query
    this.postQuery["filter[where][type]"] = 2;

    // add the offset
    this.postQuery["filter[skip]"] = this.items2.length;
    
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

  viewPost(no_post:string)
  {
    this.navCtrl.push(ViewPostPage,{post_id:no_post});
  }

  newKasus()
  {
    this.navCtrl.push(NewPostPage,{type:"kasus"});
  }

  newKegiatan()
  {
    this.navCtrl.push(NewPostPage,{type:"kegiatan"});
  }

  populateList(any) {}
}
