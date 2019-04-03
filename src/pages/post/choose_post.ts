import { Component, AfterViewInit, OnChanges, ViewChild } from "@angular/core";
import {
    NavController,
    Item,
    Content,
    Refresher,
    NavParams,
    AlertController,
    Events
} from "ionic-angular";
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
import { LoginPage } from "../login/login";
import { TabsPage } from "../tabs/tabs";
import { Observable } from "rxjs/Rx";
import { Credentials } from "../../providers/credentials.holder";
import * as moment from "moment";
import sort from "fast-sort";
import { PostPage } from "./post";
import { CreditsPage } from "../login/credits";

@Component({
    selector: "page-choose_post",
    templateUrl: "choose_post.html"
})
export class ChoosePostPage implements AfterViewInit {
    documents = [];
    jenis = "kasus";
    view = "me";
    items0 = [];
    items1 = [];
    items2 = [];
    items3 = [];

    userName;
    role;
    organisasi;

    visibleName;

    constructor(
        private document: DocumentViewer,
        private file: File,
        private transfer: FileTransfer,
        public navCtrl: NavController,
        private opener: FileOpener,
        public service: BackendService,
        public loadingCtrl: LoadingController,
        public navParams: NavParams,
        public alert: AlertController,
        public events: Events,
        public platform: Platform,
        public creds: Credentials
    ) {
        //console.log(this.service.baseurl);
    }

    @ViewChild(Content) content: Content;

    ngAfterViewInit() {
        this.getUserData();
        //console.log(this.creds.data.email);
        // this.reqAllPosts();

        this.platform.registerBackButtonAction(() => {
            this.askLogout();
        });
    }

    ionViewWillEnter() {
        //console.log("woi");

        this.jenis = "kasus";
        this.view = "me";
    }

    getUserData() {
        this.userName = this.creds.data.email;
        this.role = this.creds.data.role;
        this.organisasi = this.creds.data.organisasi;

        this.visibleName = this.creds.data.name;
    }

    ionViewDidEnter() {
        //console.log(this.jenis);
    }

    seeMyKasus() {
        this.navCtrl.push(PostPage, {
            jenis: "kasus",
            view: "me"
        });
        this.waitingNewPost = true;
    }

    seeAllKasus() {
        this.navCtrl.push(PostPage, {
            jenis: "kasus",
            view: "all"
        });
        this.waitingNewPost = true;
    }

    seeClosedKasus() {
        this.navCtrl.push(PostPage, {
            jenis: "kasus",
            view: "closed"
        });
        this.waitingNewPost = true;
    }

    seeKegiatan() {
        this.navCtrl.push(PostPage, {
            jenis: "kegiatan",
            view: "all"
        });
        this.waitingNewPost = true;
    }

    newKasus() {
        this.navCtrl.push(NewPostPage, {
            type: 1,
            userName: this.userName
        });
        this.waitingNewPost = true;
    }

    newKegiatan() {
        this.navCtrl.push(NewPostPage, {
            type: 2,
            userName: this.userName
        });
        this.waitingNewPost = true;
    }

    waitingNewPost = false;

    askLogout() {
        let alert = this.alert.create({
            subTitle: "Apakah anda ingin keluar?",
            buttons: [
                {
                    text: "Ya",
                    handler: () => {
                        this.logout();
                    }
                },
                {
                    text: "Tidak",
                    role: "cancel",
                    handler: () => {
                        //console.log("Cancel logout");
                    }
                }
            ]
        });
        alert.present();
    }

    showCredits() {
        this.navCtrl.push(CreditsPage, {
            type: 2,
            userName: this.userName
        });
        this.waitingNewPost = true;
    }

    logout() {
        this.events.publish("user:logout");
    }
}
