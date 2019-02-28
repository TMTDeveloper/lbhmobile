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
  }

  totalPosts(){
    return 0;
  }

  totalDevelopments(){
    return 0;
  }

  totalApprovedDevelopments(){
    return 0;
  }

  averageDevelopments(){
    return 0;
  }

  approvedPercentage(){
    return 0;
  }

}
