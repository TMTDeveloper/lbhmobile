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
  selector: "page-post",
  templateUrl: "post.html"
})
export class PostPage {
  documents = [];
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