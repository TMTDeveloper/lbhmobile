import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { File } from "@ionic-native/file";
import {
  DocumentViewer,
  DocumentViewerOptions
} from "@ionic-native/document-viewer";
import { FileTransfer } from "@ionic-native/file-transfer";
import { FileOpener } from "@ionic-native/file-opener";
import { BackendService } from "../../providers/backend.service";
import { LoadingController } from "ionic-angular";
@Component({
  selector: "page-about",
  templateUrl: "about.html"
})
export class AboutPage {
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

  ngAfterViewInit() {
    this.getDocument();
  }

  presentLoading() {
    const loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });
    loader.present();
  }

  getDocument() {
    const loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });
    loader.present();
    this.service.getreq("files/pdf/files").subscribe(response => {
      if (response != null) {
        this.documents = response;
        loader.dismiss();
      }
    });
  }

  getDocumentRefresh(refresher) {
    // const loader = this.loadingCtrl.create({
    //   content: "Please wait..."
    // });
    // loader.present();
    this.service.getreq("files/pdf/files").subscribe(response => {
      if (response != null) {
        this.documents = response;
        refresher.complete();
        // loader.dismiss();
      }
    });
  }

  downloadAndOpenPdf(file) {
    console.log(file);
    let path = this.file.dataDirectory;

    const transfer = this.transfer.create();
    transfer
      .download(
        "http://188.166.199.153/webadmin/api/files/pdf/download/" + file,
        path + file
      )
      .then(entry => {
        let url = entry.toURL();
        this.opener
          .open(url, "application/pdf")
          .then(() => console.log("success"));
        // this.document.viewDocument(url, "application/pdf", {});
      });
  }
}
