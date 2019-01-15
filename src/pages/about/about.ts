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
import { Credentials } from "../../providers/credentials.holder";
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
    public loadingCtrl: LoadingController,
    public cred: Credentials
  ) {}

  ngAfterViewInit() {
    this.getDocument();
    console.log(this.cred.data);
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
    this.service
      .postreq("findupload", { where: { no_post: "document" } })
      .subscribe(response => {
        if (response != null) {
          console.log(response);
          this.documents = response;
          this.result = JSON.stringify(response);
          loader.dismiss();
        }
      });
  }

  getDocumentRefresh(refresher) {
    // const loader = this.loadingCtrl.create({
    //   content: "Please wait..."
    // });
    // loader.present();
    this.service
      .postreq("findupload", { where: { no_post: "document" } })
      .subscribe(response => {
        if (response != null) {
          console.log(response);
          refresher.complete();
          this.documents = response;
          // loader.dismiss();
        }
      });
  }
  result: any;
  downloadAndOpenPdf(file, name) {
    console.log(this.service.baseurl + "download?filename=" + file);
    let path = this.file.dataDirectory;

    const transfer = this.transfer.create();
    transfer
      .download(this.service.baseurl + "download?filename=" + file, path + name.split(' ').join('_'))
      .then(entry => {
        this.result = JSON.stringify(entry);
        let url = entry.toURL();
        this.opener
          .open(url, "application/pdf")
          .then(() => console.log("success"));
        // this.document.viewDocument(url, "application/pdf", {});
      });
  }
}
