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

    this.getTotalPosts();
  }

  myPost;

  async getTotalPosts() {
    const loader = this.loadingCtrl.create({
      content: "Mohon tunggu...",
      duration: 3000
    });
    loader.present();

    // first we get the post details
    let arr = [];
    await this.service
      .getReqNew("postdetails/postedby", { email: this.creds.data.email })
      .toPromise()
      .then(response => {
        console.log(response);
        this.myPost = response;
        this.myPost = this.myPost.reverse();

        arr = this.myPost.slice(0, 10);
        console.log(arr);
      });
    for (let element of arr) {
      console.log(element);
      let postQueryByName = [];
      postQueryByName["filter[where][no_post]"] = element;
      postQueryByName["filter[reqby]"] = this.creds.data.email;

      // finally get all the post headers here
      await this.service
        .getReqNew("postheaders", postQueryByName)
        .toPromise()
        .then(response => {
          if (response != null) {
            console.log(response);

            let newItems: any;
            newItems = response;

            newItems.forEach(newItem => {
              // append the new posts to current array

              this.totalPosts.push(newItem);
            });

            console.log(this.totalPosts.length);

            // populate the list
            // this.populateList(this.items);
          }
        });
    }
  }

  async getTotalDevelopments(){
    const loader = this.loadingCtrl.create({
      content: "Mohon tunggu...",
      duration: 3000
    });
    loader.present();

    // first we get the post details
    let arr = [];
    await this.service
      .getReqNew("postdevelopments", { email: this.creds.data.email })
      .toPromise()
      .then(response => {
        console.log(response);
        this.myPost = response;
        this.myPost = this.myPost.reverse();

        arr = this.myPost.slice(0, 10);
        console.log(arr);
      });
    for (let element of arr) {
      console.log(element);
      let postQueryByName = [];
      postQueryByName["filter[where][no_post]"] = element;
      postQueryByName["filter[reqby]"] = this.creds.data.email;

      // finally get all the post headers here
      await this.service
        .getReqNew("postheaders", postQueryByName)
        .toPromise()
        .then(response => {
          if (response != null) {
            console.log(response);

            let newItems: any;
            newItems = response;

            newItems.forEach(newItem => {
              // append the new posts to current array

              this.totalPosts.push(newItem);
            });

            console.log(this.totalPosts.length);

            // populate the list
            // this.populateList(this.items);
          }
        });
    }
  }

  totalPosts;
  totalDevelopments;
  totalApprovedDevelopments;

  averageDevelopments() {
    return this.totalDevelopments / this.totalPosts;
  }

  approvedPercentage() {
    return this.totalApprovedDevelopments / this.totalDevelopments;
  }

}
