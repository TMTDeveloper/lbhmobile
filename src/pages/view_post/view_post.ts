import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { File } from "@ionic-native/file";
import { 
  DocumentViewer,
  DocumentViewerOptions
} from "@ionic-native/document-viewer";
import { FileTransfer } from "@ionic-native/file-transfer";
import { FileOpener } from "@ionic-native/file-opener";
import { BackendService } from "../../providers/backend.service";
import { LoadingController } from "ionic-angular";

import { Platform } from 'ionic-angular';
import { AppModule } from "../../app/app.module";

@Component({
  selector: "page-view_post",
  templateUrl: "view_post.html"
})
export class ViewPostPage {
  documents = [];
  jenis = "kasus";
  post_id = "";
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
    this.post_id = navParams.get('post_id');
  }

  backToPostPage()
  {
    this.navCtrl.pop();
    console.log(this.post_id);
  }
}