import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { File } from "@ionic-native/file";
import { 
  DocumentViewer, DocumentViewerOptions
} from "@ionic-native/document-viewer";
import { FileTransfer } from "@ionic-native/file-transfer";
import { FileOpener } from "@ionic-native/file-opener";
import { BackendService } from "../../../providers/backend.service";
import { LoadingController } from "ionic-angular";

import { Platform } from 'ionic-angular';

@Component({
  selector: "page-new_post",
  templateUrl: "new_post.html"
})
export class PostPage {
  documents = [];
  post_temp =
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
  constructor(
    private document: DocumentViewer,
    private file: File,
    private transfer: FileTransfer,
    public navCtrl: NavController,
    private opener: FileOpener,
    private service: BackendService,
    public loadingCtrl: LoadingController
  ) {}
}