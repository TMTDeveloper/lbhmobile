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
  ) { }

  ngAfterViewInit() {
    this.updateDokumen();
    //this.getDocument();
    console.log(this.cred.data);
  }

  presentLoading() {
    const loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });
    loader.present();
  }

  dokumenList;

  updateDokumen() {
    this.dokumenList = [];

    let query = {
      "filter[where][keyword]": "jenis_dokumen"
    };

    this.service.getReqNew("generals", query).subscribe(
      response => {
        if (response != null) {
          // view the created page
          console.log(response);
          let newList: any = response;
          this.dokumenList = newList;
        }
      },
      error => {
        if (error != null) {
          console.log("failed to get dokumen!");
          console.log(error);
        }
      }
    );
  }

  setDocType(index) {
    this.documentType = index;
    this.getDocument();
  }

  documentType = 0;

  getDocument() {
    const loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });
    loader.present();

    this.documents = [];
    console.log(this.documentType);

    this.service
      .postreq("findupload", { "where": { "no_post": "document", "type": this.documentType } })
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
      .postreq("findupload", { "where": { "no_post": "document", "type": this.documentType } })
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
