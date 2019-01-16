import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { File } from "@ionic-native/file";
import {
  DocumentViewer, DocumentViewerOptions
} from "@ionic-native/document-viewer";
import { FileTransfer } from "@ionic-native/file-transfer";
import { FileOpener } from "@ionic-native/file-opener";
import { BackendService } from "../../providers/backend.service";
import { LoadingController } from "ionic-angular";

import { Platform } from 'ionic-angular';

@Component({
  selector: "page-post",
  templateUrl: "post.html"
})
export class PostPage {
  documents = [];
  jenis = "kasus";
  items = [
  ]

  constructor(
    private document: DocumentViewer,
    private file: File,
    private transfer: FileTransfer,
    public navCtrl: NavController,
    private opener: FileOpener,
    private service: BackendService,
    public loadingCtrl: LoadingController
  ) { }

  postLimit = 20;

  postQuery = {
    "where": {},
    "field":{},
    "offset":0,
    "limit":this.postLimit,
    "skip":0,
    "order":["no_post ASC"]
  }

  resetPostOffset()
  {
    this.postQuery.offset = 0;
  }

  setOrderRule(rules:any[])
  {
    this.postQuery.order = rules;
  }

  currentPostOffset = 0;

  reqNewestPosts()
  {
    this.service
      .postreq("postheaders", this.postQuery)
      .subscribe(response => {
        if (response != null) {
          console.log(response);

          // append the new posts to current array
          this.items.push(response);
        }
      });

    // populate the list
    this.populateList(this.items);

    // add the offset
    this.postQuery.offset += this.postLimit;
  }

  populateList(any)
  {

  }
}