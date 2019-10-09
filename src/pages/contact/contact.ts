import { Component } from '@angular/core';
import { NavController, LoadingController, NavParams, AlertController, Events, ToastController } from 'ionic-angular';
import { Credentials } from '../../providers/credentials.holder';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { DocumentViewer } from '@ionic-native/document-viewer';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FileOpener } from '@ionic-native/file-opener';
import { BackendService } from '../../providers/backend.service';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  name;
  organisasi;
  role;
  email;

  constructor(
    private transfer: FileTransfer,
    public navCtrl: NavController,
    private opener: FileOpener,
    private service: BackendService,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public creds: Credentials,
    public alert: AlertController,
    public events: Events,
    public toastCtrl: ToastController
  ) {
    this.name = creds.data.name;
    this.organisasi = creds.data.organisasi;
    this.role = creds.data.role;
    this.email = creds.data.email;

    //this.getTotalPosts();
  }

  ionViewWillEnter(){
    this.getAllStats();
  }

  myPost;

  async getAllStats() {
    const loader = this.loadingCtrl.create({
      content: "Mohon tunggu...",
      duration: 3000
    });
    loader.present();

    this.clearCache();

    // first we get the post details
    let arr = [];
    await this.service
      .getReqNew("postdetails/postedby", { email: this.creds.data.email })
      .toPromise()
      .then(response => {
        //console.log(response);

        let newItems: any;
        newItems = response;

        newItems.forEach(newItem => {
          // append the new posts to current array

          if (newItem.includes("PST")) this.allPosts.push(newItem);
        });

        //console.log(this.allPosts.length);

        this.totalPosts = this.allPosts.length;

        // add all my post to array for filter
        this.myPost = response;
        //console.log(this.myPost);
      });
    for (let element of this.myPost) {
      //console.log(element);
      let postQueryByName = [];
      postQueryByName["filter[where][no_post]"] = element;

      // finally get all the post headers here
      await this.service
        .getReqNew("developments", postQueryByName)
        .toPromise()
        .then(response => {
          if (response != null) {
            //console.log(response);

            let newItems: any;
            newItems = response;

            newItems.forEach(newItem => {
              // append the new posts to current array

              this.allDevelopments.push(newItem);
              if (newItem.approved == "Y") this.allApprovedDevelopments.push(newItem);
            });

            //console.log(this.allDevelopments.length);
            //console.log(this.allApprovedDevelopments.length);

            this.totalDevelopments = this.allDevelopments.length;
            this.totalApprovedDevelopments = this.allApprovedDevelopments.length;
          }
        });
    }
    loader.dismiss();
  }

  allPosts = [];
  allDevelopments = [];
  allApprovedDevelopments = [];

  totalPosts = 0;
  totalDevelopments = 0;
  totalApprovedDevelopments = 0;

  clearCache(){
    this.allPosts = [];
    this.allDevelopments = [];
    this.allApprovedDevelopments = [];
    this.totalPosts = 0;
    this.totalDevelopments = 0;
    this.totalApprovedDevelopments = 0;
  }

  approvedPercentage() {
    let result;
    if (this.allDevelopments.length <= 0) result = 0;
    else result = this.allApprovedDevelopments.length / this.allDevelopments.length;
    return (result * 100).toFixed(2);
  }

  averageDevelopments() {
    let result;
    if (this.allPosts.length <= 0) result = 0;
    else result = this.allDevelopments.length / this.allPosts.length;
    return result.toFixed(1);
  }

}
