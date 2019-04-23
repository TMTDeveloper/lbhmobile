import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { PostPage } from '../post/post';

import { Credentials } from '../../providers/credentials.holder';
import { Events, NavController, AlertController } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { ChoosePostPage } from '../post/choose_post';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;
  tab4Root = ChoosePostPage;
  tab5Root = ProfilePage;

  role;

  constructor(
    private creds: Credentials,
    public events:Events,
    public navCtrl:NavController,
    public alert: AlertController) {
    this.role = creds.data.role;
    events.subscribe('user:logout',()=>{
      this.askLogout();
    })
  }

  askLogout() {
    let alert = this.alert.create({
      subTitle: "Apakah anda ingin keluar?",
      buttons: [
        {
          text: "Ya",
          handler: () => {
            this.navCtrl.popToRoot();
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
}
