import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { File } from "@ionic-native/file";
import { 
  DocumentViewer, DocumentViewerOptions
} from "@ionic-native/document-viewer";
import { FileTransfer } from "@ionic-native/file-transfer";
import { FileOpener } from "@ionic-native/file-opener";
import { BackendService } from "../../../providers/backend.service";
import { LoadingController } from "ionic-angular";

import { Platform } from 'ionic-angular';
import moment = require("moment");

@Component({
  selector: "page-new_post",
  templateUrl: "new_post.html"
})
export class NewPostPage {
  documents = [];
  sendParams =
    {
      "no_post": "string",
      "type": 0,
      "posted_by": "string",
      "title": "string",
      "organisasi": 0,
      "status": 0,
      "province_id": "xx",
      "province": "string",
      "regency_id": "xxxx",
      "regency": "string",
      "district_id": "string",
      "district": "string",
      "village_id": "xxxxxxxxxx",
      "village": "string",
      "nama_korban": "string",
      "nama_pelaku": "string",
      "jenis_kejadian": 0,
      "tanggal_kejadian": "2019-01-16T09:05:47.831Z",
      "kronologi": "string",
      "pembelajaran": "string",
      "date_created": "2019-01-16T09:05:47.832Z",
      "date_modified": "2019-01-16T09:05:47.832Z"
    };

  propinsi = "";

  constructor(
    private document: DocumentViewer,
    private file: File,
    private transfer: FileTransfer,
    public navCtrl: NavController,
    private opener: FileOpener,
    private service: BackendService,
    public loadingCtrl: LoadingController,
    public navParams: NavParams
  ) {
    this.type = navParams.get("type");
  }

  type = "";
  post_id;
  message;

  

  items1=[];

  createNewPost = () =>
  {
    this.sendParams["no_post"] = this.post_id;
    this.sendParams["kronologi"] = this.message;
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
            message: this.sendParams.kronologi,
            date_created: this.sendParams.date_created
          };

          this.items1.push(newMsg);

          console.log(this.items1.length);

          // populate the list
          // this.populateList(this.items);
        }
      },
      error => {
        if (error != null) {
          console.log("failed to send message!");
        }
      }
    );
  }
}